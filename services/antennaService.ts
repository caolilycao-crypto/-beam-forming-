
import { AntennaParams, CalculationResults, PatternPoint, PhaseData } from '../types';

export const calculateAntennaArray = (params: AntennaParams): CalculationResults => {
  const { frequencyGhz, spacingMm, scanAngleDeg, numElements, bits } = params;

  // Constants
  const c = 3e8;
  const f = frequencyGhz * 1e9;
  const d = spacingMm * 1e-3;
  const lambda = c / f;
  const k = (2 * Math.PI) / lambda;
  const scanAngleRad = (scanAngleDeg * Math.PI) / 180;
  
  const levels = Math.pow(2, bits);
  const step = (2 * Math.PI) / levels;

  // Progressive phase shift (rad)
  const deltaPhi = -k * d * Math.sin(scanAngleRad);

  // Calculate phases for each element
  const phases: PhaseData[] = [];
  const nArray = Array.from({ length: numElements }, (_, i) => i);

  for (const n of nArray) {
    const phaseContRad = n * deltaPhi;
    const phaseModRad = ((phaseContRad % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
    
    // 6-bit quantization
    const phaseQuantRad = Math.round(phaseModRad / step) * step % (2 * Math.PI);

    phases.push({
      index: n + 1,
      phaseContRad,
      phaseModRad,
      phaseQuantRad,
      phaseContDeg: (phaseContRad * 180) / Math.PI,
      phaseModDeg: (phaseModRad * 180) / Math.PI,
      phaseQuantDeg: (phaseQuantRad * 180) / Math.PI,
    });
  }

  // Calculate Array Factor (AF)
  const thetaPoints = [];
  for (let t = -90; t <= 90; t += 0.25) {
    thetaPoints.push(t);
  }

  const pattern: PatternPoint[] = [];
  let maxIdealAbs = 0;
  let maxQuantAbs = 0;

  // First pass to find normalization factors
  const tempIdeal: number[] = [];
  const tempQuant: number[] = [];

  for (const theta of thetaPoints) {
    const thetaRad = (theta * Math.PI) / 180;
    
    // Sum for Ideal AF
    let sumIdealReal = 0;
    let sumIdealImag = 0;
    for (let n = 0; n < numElements; n++) {
      const angle = k * d * n * Math.sin(thetaRad) + phases[n].phaseContRad;
      sumIdealReal += Math.cos(angle);
      sumIdealImag += Math.sin(angle);
    }
    const magIdeal = Math.sqrt(sumIdealReal ** 2 + sumIdealImag ** 2);
    tempIdeal.push(magIdeal);
    if (magIdeal > maxIdealAbs) maxIdealAbs = magIdeal;

    // Sum for Quantized AF
    let sumQuantReal = 0;
    let sumQuantImag = 0;
    for (let n = 0; n < numElements; n++) {
      const angle = k * d * n * Math.sin(thetaRad) + phases[n].phaseQuantRad;
      sumQuantReal += Math.cos(angle);
      sumQuantImag += Math.sin(angle);
    }
    const magQuant = Math.sqrt(sumQuantReal ** 2 + sumQuantImag ** 2);
    tempQuant.push(magQuant);
    if (magQuant > maxQuantAbs) maxQuantAbs = magQuant;
  }

  // Convert to dB and construct pattern points
  for (let i = 0; i < thetaPoints.length; i++) {
    pattern.push({
      theta: thetaPoints[i],
      idealGainDb: 20 * Math.log10(tempIdeal[i] / maxIdealAbs || 1e-10),
      quantizedGainDb: 20 * Math.log10(tempQuant[i] / maxQuantAbs || 1e-10),
    });
  }

  // Sidelobe & Main Beam Analysis
  const beamwidth = 2 * (Math.asin(0.886 / (numElements * d / lambda)) * 180 / Math.PI);

  // Analyze Ideal
  let idxMaxIdeal = 0;
  let valMaxIdeal = -Infinity;
  pattern.forEach((p, i) => {
    if (p.idealGainDb > valMaxIdeal) {
      valMaxIdeal = p.idealGainDb;
      idxMaxIdeal = i;
    }
  });
  const mainIdeal = pattern[idxMaxIdeal].theta;
  
  let sllIdeal = -Infinity;
  pattern.forEach((p) => {
    if (Math.abs(p.theta - mainIdeal) >= beamwidth) {
      if (p.idealGainDb > sllIdeal) sllIdeal = p.idealGainDb;
    }
  });

  // Analyze Quantized
  let idxMaxQuant = 0;
  let valMaxQuant = -Infinity;
  pattern.forEach((p, i) => {
    if (p.quantizedGainDb > valMaxQuant) {
      valMaxQuant = p.quantizedGainDb;
      idxMaxQuant = i;
    }
  });
  const mainQuant = pattern[idxMaxQuant].theta;

  let sllQuant = -Infinity;
  pattern.forEach((p) => {
    if (Math.abs(p.theta - mainQuant) >= beamwidth) {
      if (p.quantizedGainDb > sllQuant) sllQuant = p.quantizedGainDb;
    }
  });

  return {
    pattern,
    phases,
    mainIdeal,
    sllIdeal: sllIdeal === -Infinity ? -40 : sllIdeal,
    mainQuant,
    sllQuant: sllQuant === -Infinity ? -40 : sllQuant,
    beamOffset: mainQuant - mainIdeal,
    lambda,
    dOverLambda: d / lambda
  };
};
