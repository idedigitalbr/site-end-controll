(function attachRadarProgress(root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.RadarProgress = api;
  }
})(typeof window !== 'undefined' ? window : globalThis, function createRadarProgress() {
  function canConnect(from, to) {
    return Boolean(from && to) &&
      from.ringIndex === to.ringIndex &&
      to.positionInRing === from.positionInRing + 1;
  }

  function buildConnections(services) {
    const ringGroups = new Map();

    services.forEach(service => {
      if (!ringGroups.has(service.ringIndex)) {
        ringGroups.set(service.ringIndex, []);
      }
      ringGroups.get(service.ringIndex).push(service);
    });

    const connections = [];

    ringGroups.forEach(ringServices => {
      const ordered = [...ringServices].sort((a, b) => a.positionInRing - b.positionInRing);
      if (ordered.length < 2) return;

      const ringLastStepIndex = ordered[ordered.length - 1].stepIndex;

      for (let index = 0; index < ordered.length - 1; index += 1) {
        const from = ordered[index];
        const to = ordered[index + 1];

        if (canConnect(from, to)) {
          connections.push({
            fromStepIndex: from.stepIndex,
            toStepIndex: to.stepIndex,
            ringIndex: from.ringIndex,
            isClosing: false,
            ringLastStepIndex
          });
        }
      }

      const first = ordered[0];
      const last = ordered[ordered.length - 1];
      const hasExplicitPositions = first.positionInRing === 0 &&
        last.positionInRing === ordered.length - 1;

      if (hasExplicitPositions && first.ringIndex === last.ringIndex) {
        connections.push({
          fromStepIndex: last.stepIndex,
          toStepIndex: first.stepIndex,
          ringIndex: last.ringIndex,
          isClosing: true,
          ringLastStepIndex
        });
      }
    });

    return connections.sort((a, b) => {
      if (a.fromStepIndex !== b.fromStepIndex) {
        return a.fromStepIndex - b.fromStepIndex;
      }
      return Number(a.isClosing) - Number(b.isClosing);
    });
  }

  function getNodeState(stepIndex, activeStep, totalSteps) {
    if (stepIndex === activeStep) return 'active';
    if (stepIndex < activeStep) return 'completed';
    if (activeStep < totalSteps - 1 && stepIndex === activeStep + 1) return 'next';
    return 'inactive';
  }

  function getConnectionState(connection, activeStep) {
    if (connection.isClosing) {
      return activeStep >= connection.ringLastStepIndex ? 'active' : 'inactive';
    }

    return connection.toStepIndex <= activeStep ? 'active' : 'inactive';
  }

  function getConnectionVisualState(connection, activeStep) {
    if (!connection.isClosing && connection.toStepIndex === activeStep) {
      return 'current';
    }

    return getConnectionState(connection, activeStep) === 'active'
      ? 'completed'
      : 'future';
  }

  function getSafeArcAngles(fromAngle, toAngle, options) {
    const insetDegrees = Math.max(0, Number(options && options.insetDegrees) || 0);

    return {
      startAngle: fromAngle + insetDegrees,
      endAngle: toAngle - insetDegrees,
      sweep: 1
    };
  }

  function getConnectionGradientStops(peakOpacity) {
    const peak = Math.max(0, Math.min(1, Number(peakOpacity) || 0));

    return [
      ['0%', '0'],
      ['18%', '0'],
      ['42%', String(peak)],
      ['58%', String(peak)],
      ['82%', '0'],
      ['100%', '0']
    ];
  }

  function getConnectionGradientVector(start, end) {
    return {
      gradientUnits: 'userSpaceOnUse',
      x1: Number(start && start.x) || 0,
      y1: Number(start && start.y) || 0,
      x2: Number(end && end.x) || 0,
      y2: Number(end && end.y) || 0
    };
  }

  function getConnectionInsetDegrees(options) {
    const iconDiameter = Math.max(0, Number(options && options.iconDiameter) || 0);
    const viewBoxScale = Math.max(Number(options && options.viewBoxScale) || 1, 0.0001);
    const ringRadius = Math.max(Number(options && options.ringRadius) || 1, 1);
    const halfIconUnits = iconDiameter / viewBoxScale / 2;
    const ratio = Math.min(0.92, halfIconUnits / ringRadius);
    const iconAngle = Math.asin(ratio) * 180 / Math.PI;

    return Math.min(18, Math.max(14, iconAngle + 8));
  }

  function getLabelPlacement(angle) {
    const normalizedAngle = ((Number(angle) % 360) + 360) % 360;

    if (normalizedAngle === 300) return 'bottom';
    if (normalizedAngle === 0) return 'left';
    if (normalizedAngle === 30 || normalizedAngle === 180) return 'right';
    if (normalizedAngle === 240) return 'bottom';
    if (normalizedAngle === 330 || normalizedAngle === 150 || normalizedAngle === 210) {
      return normalizedAngle === 330 ? 'right' : 'left';
    }
    if (normalizedAngle >= 330 || normalizedAngle < 30) return 'right';
    if (normalizedAngle < 150) return 'bottom';
    if (normalizedAngle < 270) return 'left';
    return 'top';
  }

  function getProgressState(services, activeStep) {
    const normalizedActiveStep = Math.max(0, Math.min(activeStep, services.length - 1));
    const connections = buildConnections(services).map(connection => ({
      ...connection,
      state: getConnectionState(connection, normalizedActiveStep)
    }));

    return {
      activeStep: normalizedActiveStep,
      nextStep: normalizedActiveStep < services.length - 1 ? normalizedActiveStep + 1 : null,
      nodes: services.map(service => ({
        stepIndex: service.stepIndex,
        state: getNodeState(service.stepIndex, normalizedActiveStep, services.length)
      })),
      connections
    };
  }

  return {
    buildConnections,
    canConnect,
    getConnectionState,
    getConnectionVisualState,
    getConnectionGradientStops,
    getConnectionGradientVector,
    getConnectionInsetDegrees,
    getLabelPlacement,
    getSafeArcAngles,
    getNodeState,
    getProgressState
  };
});
