export declare type VectorType = {
    x: number;
    y: number;
};
export declare type BlobType = {
    speed: number;
    debug: boolean;
    scramble: number;
    size: number;
    vectors?: VectorType[];
    play: boolean;
    inverted: boolean;
    maskedElement: HTMLImageElement | HTMLVideoElement | null;
    color: any;
};
declare type BlobParamTypes = {
    canvas: HTMLCanvasElement;
    vectors?: VectorType[];
    speed?: number;
    scramble?: number;
    color?: string;
    colorFunction?: (arg: CanvasRenderingContext2D) => any;
    autoPlay?: boolean;
    size?: number;
    debug?: boolean;
    inverted?: boolean;
    changedVectorsCallback?: (newVectors: VectorType[]) => void;
    maskedElement?: HTMLImageElement | HTMLVideoElement | null;
};
declare type PointsType = {
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
declare type GeneratePointsType = {
    sides: number;
    scramblePercentage?: number;
    ratio?: number;
};
export declare const generatePoints: ({ sides, ratio, scramblePercentage }: GeneratePointsType) => VectorType[];
declare class Blob {
    _canvas: HTMLCanvasElement;
    _ctx: CanvasRenderingContext2D | null;
    _speed: number;
    _size: number;
    _scramble: number;
    _color?: string;
    _colorFunction?: (arg: CanvasRenderingContext2D) => any;
    _numberOfPoints: number;
    _isPlaying: boolean;
    _frame: number;
    _points: PointsType[];
    _debug?: boolean;
    _isDragging: boolean;
    _changedVectorsCallback?: (newVectors: VectorType[]) => void;
    _dragIndex: number;
    _maskedElement?: HTMLImageElement | HTMLVideoElement | null;
    _inverted: boolean;
    _mousePositions?: VectorType;
    _createPoints: (points: VectorType[], scramble: number, size: number, speed: number) => PointsType[];
    _easeInOutQuad: (n: number) => number;
    _getCurvedPathPoints: (obj: {
        x: number;
        y: number;
        i: number;
        invert: -1 | 1;
    }) => {
        x: number;
        y: number;
    };
    _updatePositions: (point: PointsType) => void;
    _getAngleRadians: (obj: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }) => number;
    _getDistance: (vector1: VectorType, vector2: VectorType) => number;
    _draw: () => void;
    _drawImage: () => void;
    _colorize: () => void;
    _debugModeChanged: (debugMode: boolean) => void;
    _debugMouseMove: (e: MouseEvent) => void;
    _debugMouseDown: () => void;
    constructor({ canvas, color, colorFunction, vectors, speed, scramble, autoPlay, size, maskedElement, debug, inverted, changedVectorsCallback, }: BlobParamTypes);
    play: boolean;
    speed: number;
    debug: boolean;
    vectors: VectorType[];
    scramble: number;
    size: number;
    inverted: boolean;
    color: (arg: CanvasRenderingContext2D) => any | string | null | undefined;
    maskedElement: HTMLImageElement | HTMLVideoElement | undefined;
}
export default Blob;
