export type VectorType = {
  x: number;
  y: number;
};

export type BlobType = {
  speed: number;
  debug: boolean;
  scramble: number;
  size: number;
  vectors?: VectorType[];
  play: boolean;
}

export type BlobParamTypes = {
  canvas: HTMLCanvasElement;
  vectors?: VectorType[];
  speed?: number;
  scramble?: number;
  color?: string;
  autoPlay?: boolean;
  size?: number;
  debug?: boolean;
  cover?: boolean;
  changedVectorsCallback?: (newVectors: VectorType[]) => void;
  maskedElement?: HTMLImageElement | HTMLVideoElement;
};

export type PointsType = {
  initialX: number;
  initialY: number;
  x: number;
  y: number;
  xFrom: number;
  yFrom: number;
  xTarget: number;
  yTarget: number;
  bornX: number;
  willDieX: number;
  bornY: number;
  willDieY: number;
};

export type DebugDotType = {
  cp1x: number;
  cp1y: number;
  cp2x: number;
  cp2y: number;
  x: number;
  y: number;
  initialX: number;
  initialY: number;
}

export type GeneratePointsType = {
  sides: number;
  scramblePercentage?: number;
  ratio?: number;
};