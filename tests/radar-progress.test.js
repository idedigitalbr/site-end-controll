const assert = require('node:assert/strict');
const test = require('node:test');
const {
  buildConnections,
  canConnect,
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
