
export interface AntennaParams {
  frequencyGhz: number;
  spacingMm: number;
  scanAngleDeg: number;
  numElements: number;
  bits: number;
}

export interface PhaseData {
  index: number;
  phaseContRad: number;
  phaseModRad: number;
  phaseQuantRad: number;
  phaseContDeg: number;
  phaseModDeg: number;
  phaseQuantDeg: number;
}

export interface PatternPoint {
  theta: number;
  idealGainDb: number;
  quantizedGainDb: number;
}

export interface CalculationResults {
  pattern: PatternPoint[];
  phases: PhaseData[];
  mainIdeal: number;
  sllIdeal: number;
  mainQuant: number;
  sllQuant: number;
  beamOffset: number;
  lambda: number;
  dOverLambda: number;
}
