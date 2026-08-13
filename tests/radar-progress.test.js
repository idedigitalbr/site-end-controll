const assert = require('node:assert/strict');
const test = require('node:test');
const {
  buildConnections,
  canConnect,
  getConnectionVisualState,
  getLabelPlacement,
  getSafeArcAngles,
  getProgressState
} = require('../src/js/radar-progress.js');

const services = Array.from({ length: 12 }, (_, stepIndex) => ({
  stepIndex,
  ringIndex: stepIndex < 6 ? 0 : 1,
  positionInRing: stepIndex % 6,
  angle: stepIndex < 6 ? -90 + stepIndex * 60 : -60 + (stepIndex - 6) * 60
}));

test('selecting item 2 activates only the 1 to 2 segment and marks item 3 as next', () => {
  const state = getProgressState(services, 1);

  assert.deepEqual(state.nodes.map(node => node.state).slice(0, 4), [
    'completed', 'active', 'next', 'inactive'
  ]);

  const active = state.connections
    .filter(connection => connection.state === 'active')
    .map(connection => [connection.fromStepIndex, connection.toStepIndex]);

  assert.deepEqual(active, [[0, 1]]);
});

test('jumping directly to item 6 activates every preceding segment in ring 1', () => {
  const state = getProgressState(services, 5);
  const active = state.connections
    .filter(connection => connection.state === 'active' && !connection.isClosing)
    .map(connection => [connection.fromStepIndex, connection.toStepIndex]);

  assert.deepEqual(active, [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]);
  assert.equal(state.nodes[5].state, 'active');
  assert.equal(state.nodes[6].state, 'next');
});

test('returning from item 6 to item 2 removes later progress', () => {
  const state = getProgressState(services, 1);
  const active = state.connections
    .filter(connection => connection.state === 'active')
    .map(connection => [connection.fromStepIndex, connection.toStepIndex]);

  assert.deepEqual(active, [[0, 1]]);
  assert.equal(state.nodes[2].state, 'next');
  assert.equal(state.nodes[5].state, 'inactive');
});

test('item 6 and item 7 never produce a cross-ring connection', () => {
  const connections = buildConnections(services);

  assert.equal(connections.some(connection =>
    connection.fromStepIndex === 5 && connection.toStepIndex === 6
  ), false);

  assert.equal(connections.every(connection => {
    const from = services[connection.fromStepIndex];
    const to = services[connection.toStepIndex];
    return from.ringIndex === to.ringIndex;
  }), true);
});

test('selecting item 7 keeps ring 1 complete and starts ring 2 independently', () => {
  const state = getProgressState(services, 6);

  assert.ok(state.nodes.slice(0, 6).every(node => node.state === 'completed'));
  assert.equal(state.nodes[6].state, 'active');
  assert.equal(state.nodes[7].state, 'next');
  assert.equal(state.connections.some(connection =>
    connection.fromStepIndex === 5 && connection.toStepIndex === 6
  ), false);
});

test('only the last item of a ring can activate its explicit closing segment', () => {
  const stateAtSix = getProgressState(services, 5);
  const stateAtSeven = getProgressState(services, 6);

  const ringOneClosure = connection =>
    connection.isClosing && connection.fromStepIndex === 5 && connection.toStepIndex === 0;

  assert.equal(stateAtSix.connections.some(connection =>
    ringOneClosure(connection) && connection.state === 'active'
  ), true);
  assert.equal(stateAtSeven.connections.some(connection =>
    ringOneClosure(connection) && connection.state === 'active'
  ), true);
});

test('canConnect accepts only consecutive positions within one ring', () => {
  assert.equal(canConnect(services[0], services[1]), true);
  assert.equal(canConnect(services[0], services[2]), false);
  assert.equal(canConnect(services[5], services[6]), false);
});

test('classifies the segment arriving at the active item as current', () => {
  const state = getProgressState(services, 8);
  const current = state.connections
    .filter(connection => getConnectionVisualState(connection, 8) === 'current')
    .map(connection => [connection.fromStepIndex, connection.toStepIndex]);

  assert.deepEqual(current, [[7, 8]]);
});

test('keeps completed and future segments distinct from the current segment', () => {
  assert.equal(getConnectionVisualState({
    fromStepIndex: 0,
    toStepIndex: 1,
    isClosing: false,
    ringLastStepIndex: 5
  }, 8), 'completed');

  assert.equal(getConnectionVisualState({
    fromStepIndex: 8,
    toStepIndex: 9,
    isClosing: false,
    ringLastStepIndex: 11
  }, 8), 'future');
});

test('recedes both ends of a sixty degree arc by the requested safe angle', () => {
  const result = getSafeArcAngles(-90, -30, { insetDegrees: 7 });

  assert.deepEqual(result, {
    startAngle: -83,
    endAngle: -37,
    sweep: 1
  });
});

test('places labels by polar quadrant', () => {
  assert.equal(getLabelPlacement(-90), 'top');
  assert.equal(getLabelPlacement(0), 'right');
  assert.equal(getLabelPlacement(90), 'bottom');
  assert.equal(getLabelPlacement(180), 'left');
});

test('places requested service labels below the icon', () => {
  assert.equal(getLabelPlacement(-30), 'bottom');
  assert.equal(getLabelPlacement(30), 'bottom');
  assert.equal(getLabelPlacement(60), 'bottom');
  assert.equal(getLabelPlacement(150), 'bottom');
  assert.equal(getLabelPlacement(210), 'bottom');
});
