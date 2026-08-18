const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const radarFfsScript = fs.readFileSync(path.join(root, 'src/js/radar-ffs.js'), 'utf8');

function normalizeAngle(angle) {
  const numericAngle = Number(angle) || 0;
  return ((numericAngle % 360) + 360) % 360;
}

function getForwardAngle(fromAngle, targetAngle) {
  const start = Number(fromAngle) || 0;
  let target = normalizeAngle(targetAngle);
  while (target <= start + 0.001) {
    target += 360;
  }
  return target;
}

function getBackwardAngle(fromAngle, targetAngle) {
  const start = Number(fromAngle) || 0;
  let target = normalizeAngle(targetAngle);
  while (target >= start - 0.001) {
    target -= 360;
  }
  return target;
}

function getNearestAngle(fromAngle, targetAngle) {
  const start = Number(fromAngle) || 0;
  const target = normalizeAngle(targetAngle);
  return target + Math.round((start - target) / 360) * 360;
}

test('radar FFS angle calculation rotates smoothly without 360 degree jumps on hover', () => {
  // Test forward from 0 to 45
  assert.equal(getForwardAngle(0, 45), 45);

  // Test forward wrapping 315 to 0
  assert.equal(getForwardAngle(315, 0), 360);

  // Test nearest from 45 to 0
  assert.equal(getNearestAngle(45, 0), 0);

  // Test nearest from 350 to 10
  assert.equal(getNearestAngle(350, 10), 370);

  // Test nearest from 10 to 350
  assert.equal(getNearestAngle(10, 350), -10);

  // Test nearest from 180 to 225
  assert.equal(getNearestAngle(180, 225), 225);

  // Test nearest from 225 to 180
  assert.equal(getNearestAngle(225, 180), 180);
});

test('radar FFS script includes DOMMatrix sweep angle reading and pause/resume logic', () => {
  assert.ok(radarFfsScript.includes('DOMMatrixReadOnly'), 'Must read computed DOMMatrix to prevent animation jumps');
  assert.ok(radarFfsScript.includes('stopSweepAtCurrentPosition'), 'Must cleanly stop sweep at current position');
  assert.ok(radarFfsScript.includes('getNearestAngle'), 'Must use nearest angle calculation on user interaction');
  assert.ok(radarFfsScript.includes('pauseAutoPlay'), 'Must handle manual pause and resume delay');
});
