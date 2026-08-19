const assert = require('node:assert/strict');
const test = require('node:test');
const {
  buildConnections,
  canConnect,
  getBackwardAngle,
  getDistanceToRect,
  getConnectionVisualState,
  getDomAngle,
  getForwardAngle,
  getNearestAngle,
  getConnectionInsetDegrees,
  getConnectionGradientStops,
  getConnectionGradientVector,
  getLabelPlacement,
  normalizeAngle,
  getSafeArcAngles,
  getSafeSweepRadius,
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

test('fades connection endpoints to zero before reaching icons', () => {
  const stops = getConnectionGradientStops(0.82);

  assert.deepEqual(stops[0], ['0%', '0']);
  assert.deepEqual(stops[1], ['18%', '0']);
  assert.deepEqual(stops.at(-2), ['82%', '0']);
  assert.deepEqual(stops.at(-1), ['100%', '0']);
});

test('orients side-arc gradients from the real start point to the end point', () => {
  assert.deepEqual(
    getConnectionGradientVector({ x: 480, y: 180 }, { x: 480, y: 320 }),
    {
      gradientUnits: 'userSpaceOnUse',
      x1: 480,
      y1: 180,
      x2: 480,
      y2: 320
    }
  );
});

test('leaves a clear angular gap around each icon', () => {
  const inset = getConnectionInsetDegrees({
    iconDiameter: 50,
    viewBoxScale: 1,
    ringRadius: 247.5
  });

  assert.ok(inset >= 14);
  assert.ok(inset <= 18);
});

test('places labels by polar quadrant', () => {
  assert.equal(getLabelPlacement(-90), 'top');
  assert.equal(getLabelPlacement(30), 'right');
  assert.equal(getLabelPlacement(90), 'bottom');
  assert.equal(getLabelPlacement(180), 'left');
});

test('places labels according to the approved radar alignment map', () => {
  assert.equal(getLabelPlacement(-30), 'right');
  assert.equal(getLabelPlacement(30), 'right');
  assert.equal(getLabelPlacement(60), 'bottom');
  assert.equal(getLabelPlacement(90), 'bottom');
  assert.equal(getLabelPlacement(120), 'bottom');
  assert.equal(getLabelPlacement(150), 'left');
  assert.equal(getLabelPlacement(210), 'left');
  assert.equal(getLabelPlacement(-60), 'bottom');
  assert.equal(getLabelPlacement(0), 'right');
  assert.equal(getLabelPlacement(180), 'left');
  assert.equal(getLabelPlacement(240), 'bottom');
});

test('normalizes angles without reversing the 350 to 10 degree transition', () => {
  assert.equal(normalizeAngle(-10), 350);
  assert.equal(getForwardAngle(350, 10), 370);
  assert.equal(getForwardAngle(330, 0), 360);
});

test('keeps manual previous and direct selection movements natural', () => {
  assert.equal(getBackwardAngle(300, 240), 240);
  assert.equal(getBackwardAngle(30, 330), -30);
  assert.equal(getNearestAngle(300, 30), 390);
  assert.equal(getNearestAngle(120, 60), 60);
});

test('calculates sweep angles from real DOM-style center points', () => {
  const center = { x: 100, y: 100 };

  assert.equal(getDomAngle(center, { x: 100, y: 20 }), 0);
  assert.equal(getDomAngle(center, { x: 180, y: 100 }), 90);
  assert.equal(getDomAngle(center, { x: 100, y: 180 }), 180);
  assert.equal(getDomAngle(center, { x: 20, y: 100 }), 270);
});

test('calculates exact Euclidean distance to axis-aligned bounding rectangles', () => {
  const center = { x: 300, y: 300 };

  // Rectangle directly above
  const topRect = { left: 270, right: 330, top: 100, bottom: 160 };
  assert.equal(getDistanceToRect(center, topRect), 140);

  // Rectangle directly to the right
  const rightRect = { left: 420, right: 480, top: 270, bottom: 330 };
  assert.equal(getDistanceToRect(center, rightRect), 120);

  // Rectangle diagonal
  const diagRect = { left: 400, right: 460, top: 100, bottom: 160 };
  assert.equal(Math.round(getDistanceToRect(center, diagRect)), 172);
});

test('computes safe sweep radius terminating before icon and label with requested margin', () => {
  const center = { x: 350, y: 350 };
  const iconRect = { left: 326, right: 374, top: 20, bottom: 68 }; // icon dist = 282
  const labelRect = { left: 290, right: 410, top: 77, bottom: 117 }; // label dist = 233 (between icon and center)

  const safeRadius = getSafeSweepRadius(center, [iconRect, labelRect], {
    safetyGap: 16,
    minRadius: 50,
    maxRadius: 350
  });

  // Nearest obstacle is the label bottom (dist = 233), safeRadius should be 233 - 16 = 217
  assert.equal(safeRadius, 217);
});

test('radar sweep on index.html has initial safe sweep radius inline style to prevent load/F5 overflow', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const rootDir = path.resolve(__dirname, '..');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

  assert.ok(
    indexHtml.includes('id="radarSweep" style="--sweep-radius: 29.2%; transform: rotate(0deg);"'),
    'index.html must have initial safe --sweep-radius and rotation inline on #radarSweep'
  );
});

test('solucoes.css defines --sweep-radius-initial and uses it as safe fallback for .radar-sweep', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const rootDir = path.resolve(__dirname, '..');
  const solucoesCss = fs.readFileSync(path.join(rootDir, 'src/css/solucoes.css'), 'utf8');

  assert.ok(
    solucoesCss.includes('--sweep-radius-initial: 29.2%'),
    'solucoes.css must define --sweep-radius-initial: 29.2%'
  );
  assert.ok(
    solucoesCss.includes('--sweep-radius, var(--sweep-radius-initial, 29.2%)'),
    '.radar-sweep must use --sweep-radius-initial as fallback instead of full outer ring'
  );
});

test('solucoes.js protects item 0 at 12:00 from exceeding label boundary on initial render and resize', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const rootDir = path.resolve(__dirname, '..');
  const solucoesJs = fs.readFileSync(path.join(rootDir, 'src/js/solucoes.js'), 'utf8');

  assert.ok(
    solucoesJs.includes('if (service.angle === -90 && service.ringIndex === 0)'),
    'solucoes.js must enforce strict boundary protection for item 0 at 12:00'
  );
});

test('solucoes.js configures hoverResumeDelay at 2s and manualResumeDelay at 10s', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const rootDir = path.resolve(__dirname, '..');
  const solucoesJs = fs.readFileSync(path.join(rootDir, 'src/js/solucoes.js'), 'utf8');

  assert.ok(solucoesJs.includes('hoverResumeDelay: 2000'), 'hoverResumeDelay must be 2000ms');
  assert.ok(solucoesJs.includes('manualResumeDelay: 10000'), 'manualResumeDelay must be 10000ms');
  assert.ok(solucoesJs.includes('highlightCard.addEventListener(\'mouseenter\', handleHoverEnter)'));
  assert.ok(solucoesJs.includes('highlightCard.addEventListener(\'mouseleave\', handleHoverLeave)'));
});

test('pause state prioritization logic enforces 10s cooldown priority over 2s hover resume', () => {
  const hoverDelay = 2000;
  const manualDelay = 10000;

  // Scenario 1: Simple hover enter and leave (no manual click)
  let manualPauseUntil = 0;
  let now = 1000;
  let remainingManual = manualPauseUntil - now;
  let computedDelay = remainingManual > 0 ? Math.max(hoverDelay, remainingManual) : hoverDelay;
  assert.equal(computedDelay, 2000, 'Simple hover leave should resume after 2 seconds');

  // Scenario 2: Manual click occurred at t=0, hover leave at t=3s (7s remaining on manual cooldown)
  manualPauseUntil = 10000;
  now = 3000;
  remainingManual = manualPauseUntil - now;
  computedDelay = remainingManual > 0 ? Math.max(hoverDelay, remainingManual) : hoverDelay;
  assert.equal(computedDelay, 7000, 'Hover leave with active click cooldown must respect the remaining 7 seconds');

  // Scenario 3: Manual click occurred at t=0, hover leave at t=12s (click cooldown already expired)
  manualPauseUntil = 10000;
  now = 12000;
  remainingManual = manualPauseUntil - now;
  computedDelay = remainingManual > 0 ? Math.max(hoverDelay, remainingManual) : hoverDelay;
  assert.equal(computedDelay, 2000, 'Hover leave after click cooldown has expired should resume after 2 seconds');
});
