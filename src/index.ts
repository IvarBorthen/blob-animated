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

type BlobParamTypes = {
  canvas: HTMLCanvasElement;
  vectors?: VectorType[];
  speed?: number;
  scramble?: number;
  color?: string;
  colorFunction?: (arg: CanvasRenderingContext2D) => any; 
  autoPlay?: boolean;
  size?: number;
  debug?: boolean;
  changedVectorsCallback?: (newVectors: VectorType[]) => void;
  maskedElement?: HTMLImageElement | HTMLVideoElement | null;
};

type PointsType = {
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

type DebugDotType = {
  cp1x: number;
  cp1y: number;
  cp2x: number;
  cp2y: number;
  x: number;
  y: number;
  initialX: number;
  initialY: number;
}

type GeneratePointsType = {
  sides: number;
  scramblePercentage?: number;
  ratio?: number;
};

export const generatePoints = ({ sides, ratio = 1, scramblePercentage = 0.1 }: GeneratePointsType): VectorType[] => {
  if (Math.floor(sides) !== sides || sides < 2) {
    console.warn('Error: GeneratePoints() sides param must be a integer larger than 2');
    return [];
  }
  // @ts-ignore
  return [...Array(sides)].map((empty, index) => {
    const x = scramblePercentage + ((0.5 + (0.5) * Math.cos(index * 2 * Math.PI / sides)) * (ratio > 1 ? 1 : ratio)) * (1 - scramblePercentage * 2);
    const y = scramblePercentage + ((0.5 + (0.5) * Math.sin(index * 2 * Math.PI / sides)) / (ratio > 1 ? ratio : 1)) * (1 - scramblePercentage * 2);
    return {
      x,
      y,
    }
  });
}

class Blob {
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
  _mousePositions?: VectorType;
  _createPoints: (points: VectorType[], scramble: number, size: number, speed: number) => PointsType[];
  _easeInOutQuad: (n: number) => number;
  _getCurvedPathPoints: (obj: { x: number, y: number, i: number, invert: -1 | 1 }) => { x: number; y: number };
  _updatePositions: (point: PointsType) => void;
  _getAngleRadians: (obj: {  x1: number, y1: number, x2: number, y2: number }) => number;
  _getDistance: (vector1: VectorType, vector2: VectorType) => number;
  _draw: () => void;
  _debugModeChanged: (debugMode: boolean) => void;
  _debugMouseMove: (e: MouseEvent) => void;
  _debugMouseDown: () => void;
  constructor({
    canvas,
    color,
    colorFunction,
    vectors,
    speed = 200,
    scramble = 0.1,
    autoPlay = true,
    size = 1000,
    maskedElement,
    debug = false,
    changedVectorsCallback,
  }: BlobParamTypes) {
    canvas.setAttribute('width', `${size}px`);
    canvas.setAttribute('height', `${size}px`);
    // Function for initiate points from vectors
    this._createPoints = (vectors, scramble, size, speed) => (
      vectors.map(({ x, y }) => ({
        initialX: x,
        initialY: y,
        x: (x + (Math.random() * scramble) - (scramble / 2)) * size,
        y: (y + (Math.random() * scramble) - (scramble / 2)) * size,
        xFrom: x * size,
        yFrom: y * size,
        xTarget: (x + (Math.random() * scramble) - (scramble / 2)) * size,
        yTarget: (y + (Math.random() * scramble) - (scramble / 2)) * size,
        bornX: 0,
        willDieX: Math.ceil(speed * Math.random() + speed / 2),
        bornY: 0,
        willDieY: Math.ceil(speed * Math.random() + speed / 2),
      }))
    );
    // Create points
    this._points = this._createPoints(vectors || generatePoints({ sides: 8, scramblePercentage: scramble }), scramble, size, speed);
    this._numberOfPoints = this._points.length;
    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');
    this._size = size;
    this._color = color || '#222';
    this._colorFunction = colorFunction;
    this._scramble = scramble;
    this._speed = speed;
    this._frame = 1;
    this._maskedElement = maskedElement;
    this._isPlaying = autoPlay;
    // For editing vector arrays
    this._isDragging = false;
    this._changedVectorsCallback = changedVectorsCallback;
    this._dragIndex = -1;

    this._easeInOutQuad = (t) => (
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    );

    this._updatePositions = (point) => {
      let livedPercentageX = (this._frame - point.bornX) / (point.willDieX - point.bornX);
      let livedPercentageY = (this._frame - point.bornY) / (point.willDieY - point.bornY);
      if (livedPercentageX >= 1) {
        // Update life for X
        point.bornX = this._frame;
        point.willDieX = this._frame + Math.ceil(this._speed * Math.random() + this._speed / 2),
        livedPercentageX = 0;
        const x = point.initialX;
        point.xFrom = point.xTarget;
        point.xTarget = (x + ((Math.random() * this._scramble * 2) - (this._scramble))) * size;
      }
      if (livedPercentageY >= 1) {
        // Update life for Y
        point.bornY = this._frame;
        point.willDieY = this._frame + Math.ceil(this._speed * Math.random() + this._speed / 2),
        livedPercentageY = 0;
        const y = point.initialY;
        point.yFrom = point.yTarget;
        point.yTarget = (y + ((Math.random() * this._scramble * 2) - (this._scramble))) * size;
      }
      const easingX = this._easeInOutQuad(livedPercentageX);
      const easingY = this._easeInOutQuad(livedPercentageY);
      point.x = point.xFrom * (1 - easingX) + point.xTarget * easingX;
      point.y = point.yFrom * (1 - easingY) + point.yTarget * easingY;
    }
    // Functions for drawing
    this._getAngleRadians = ({  x1, y1, x2, y2  }) => (
      Math.atan2(y1 - y2, x1 - x2)
    );
    this._getDistance = (vector1, vector2) => {
      const a = vector1.x - vector2.x;
      const b = vector1.y - vector2.y;
      return Math.sqrt( a * a + b * b );
    };
    // Calculate vectors for bezierCurve points.
    this._getCurvedPathPoints = ({ x, y, i, invert }) => {
      const { _points, _numberOfPoints, _getAngleRadians } = this;
      const i1 = i > 0 ? i - 1 : _numberOfPoints - 1;
      const i2 = i < _numberOfPoints - 1 ? i + 1 : (1 + i) - _numberOfPoints;
      const radian = _getAngleRadians({
        x1: _points[i1].x,
        y1: _points[i1].y,
        x2: _points[i2].x,
        y2: _points[i2].y,
      });
      let radius = 100;
      if (invert === -1) {
        radius = this._getDistance(_points[i1], _points[Math.min(i, _numberOfPoints - 1)]) / 3;
      } else {
        radius = this._getDistance(_points[i2], _points[Math.min(i, _numberOfPoints - 1)]) / 3;
      }

      return {
        x: x + (Math.cos(radian) * radius * -invert),
        y: y + (Math.sin(radian) * radius * -invert),
      };
    }
    this._draw = () => {
      
      if (this._ctx) {
        const {
          _ctx, _points, _numberOfPoints, _getCurvedPathPoints, _updatePositions,
        } = this;
        _ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (_points.length > 2) {
          this._frame += 1;
          _points.forEach(point => _updatePositions(point));
          
          const dots: DebugDotType[] = [];
          // const xPos = -canvas.width / 2;
          // const yPos = -canvas.height / 2;
          let x = _points[0].x;
          let y = _points[0].y;
          
          _ctx.beginPath();
          _ctx.moveTo(x, y);
          // loop
          _points.forEach(({ x, y }, i) => {
            const cp1 = _getCurvedPathPoints({ x, y, i, invert: 1 });
            const nextI = i < _numberOfPoints - 1 ? i + 1 : (1 + i) - _numberOfPoints;
            const nextX = _points[nextI].x;
            const nextY = _points[nextI].y;

            const cp2 = _getCurvedPathPoints({ x: nextX, y: nextY, i: i === _numberOfPoints - 1 ? 0 : i + 1, invert: -1 });

            dots[i] = {
              cp1x: cp1.x,
              cp1y: cp1.y,
              cp2x: cp2.x,
              cp2y: cp2.y,
              x: nextX,
              y: nextY,
              initialX: _points[i].initialX,
              initialY: _points[i].initialY,
            };

            _ctx.bezierCurveTo(
              cp1.x,
              cp1.y,
              cp2.x,
              cp2.y,
              nextX,
              nextY,
            );
          });

          if (this._colorFunction) {
            _ctx.fillStyle = this._colorFunction(_ctx);
          } else if (this._color) {
            _ctx.fillStyle = this._color;
          }
          _ctx.fill();

          if (this._maskedElement) {
            // @ts-ignore
            const width = this._maskedElement.width || this._maskedElement.videoWidth;
            // @ts-ignore
            const height = this._maskedElement.height || this._maskedElement.videoHeight;

            const sizeMultipler = this._size / width;
            this._ctx.globalCompositeOperation = 'source-in';
            if (width > height) {
              const x = height > width ? (width - height) / 2 : 0;
              const y = height < width ? (height - width) / 2 : 0;
              try {
                this._ctx.drawImage(
                  this._maskedElement,
                  x < 0 ? 0 : x * sizeMultipler,
                  y < 0 ? 0 : y * sizeMultipler,
                  sizeMultipler * (width - x * 2),
                  sizeMultipler * (height - y * 2),
                );
              } catch(err) {
                console.log('maskedElement (image/video) not ready');
              }
            } else {
              try {
                this._ctx.drawImage(
                  this._maskedElement,
                  0,
                  (this._size - (sizeMultipler * height)) / 2,
                  this._size,
                  sizeMultipler * height,
                );
              } catch(err) {
                console.log('maskedElement (image/video) not ready');
              }
            }
            this._ctx.globalCompositeOperation = 'source-over';
          }

          if (this._debug) {
            dots.map((dotData) => {
              _ctx.beginPath();
              _ctx.fillStyle = 'red';
              _ctx.arc(dotData.x, dotData.y, 10, 0, Math.PI * 2);
              _ctx.fill();

              _ctx.beginPath();
              _ctx.arc(dotData.cp1x, dotData.cp1y, 4, 0, Math.PI * 2);
              _ctx.fill();
              
              _ctx.beginPath();
              _ctx.arc(dotData.cp2x, dotData.cp2y, 4, 0, Math.PI * 2);
              _ctx.fill();

              const hovered = this._mousePositions && this._getDistance(this._mousePositions, { x: dotData.initialX, y: dotData.initialY }) < this._scramble;
              
              _ctx.beginPath();
              _ctx.fillStyle = `rgba(255, 0, 0, ${hovered ? 0.8 : 0.4})`;
              _ctx.arc(dotData.initialX * this._size, dotData.initialY * this._size, this._size * this._scramble, 0, Math.PI * 2);
              _ctx.fill();
            });
          }
          
          if (this._isPlaying) {
            window.requestAnimationFrame(() => {
              this._draw();
            });
          }
        }
      }
    }
    this._debugMouseMove = (e) => {
      const rect = this._canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      if (this._isDragging) {
        // Move points
        const x = mouseX / rect.width;
        const y = mouseY / rect.height;
        this._points[this._dragIndex].initialX = x;
        this._points[this._dragIndex].initialY = y;
        this._points[this._dragIndex].x = (x + (0.5 * scramble) - (scramble / 2)) * size;
        this._points[this._dragIndex].y = (y + (0.5 * scramble) - (scramble / 2)) * size;
        this._points[this._dragIndex].xFrom = x * size;
        this._points[this._dragIndex].yFrom = y * size;
        this._points[this._dragIndex].xTarget = (x + (0.5 * scramble) - (scramble / 2)) * size;
        this._points[this._dragIndex].yTarget = (y + (0.5 * scramble) - (scramble / 2)) * size;
      } else {
        const multipler = this._size / rect.width;
        this._mousePositions = {
          x: (mouseX * multipler) / this._size,
          y: (mouseY * multipler) / this._size,
        };
      }
    }
    this._debugMouseDown = () => {
      if (this._mousePositions) {  
        const dragIndex = this._points.findIndex(point => (
          this._mousePositions && this._getDistance(this._mousePositions, { x: point.initialX, y: point.initialY }) < this._scramble
        ));
        if (dragIndex > -1) {
          this._isDragging = true;
          this._dragIndex = dragIndex;
          const mouseUpListener = () => {
            if (this._isDragging && this._changedVectorsCallback) {
              const newVectors: VectorType[] = this._points.map(({ initialX, initialY }) => ({ x: initialX, y: initialY }));
              this._changedVectorsCallback(newVectors);
            }
            this._isDragging = false;
            window.removeEventListener('mouseup', mouseUpListener);
          }
          window.addEventListener('mouseup', mouseUpListener);
        }
      }
    };
    this._debugModeChanged = (debugBlob) => {
      if (debugBlob) {
        window.addEventListener('mousemove', this._debugMouseMove);
        this._canvas.addEventListener('mousedown', this._debugMouseDown);
      } else {
        window.removeEventListener('mousemove', this._debugMouseMove);
      }
      this._debug = debugBlob;
    }
    this._debugModeChanged(debug);
    if (autoPlay) {
      this._draw();
    }
  }
  // getter functions
  get play() {
    return this._isPlaying;
  }
  get speed() {
    return this._speed;
  }
  get debug() {
    return this._debug || false;
  }
  get vectors() {
    return this._points.map(({ initialX, initialY }) => ({ x: initialX, y: initialY }));
  }
  get scramble() {
    return this._scramble;
  }
  get size() {
    return this._size;
  }
  // setter functions
  set play(playState: boolean) {
    const startPlay = playState && playState !== this._isPlaying;
    this._isPlaying = playState;
    if (startPlay) {
      this._draw();
    }
  }
  set debug(debugState: boolean) {
    this._debug = debugState;
    this._debugModeChanged(debugState);
  }
  set maskedElement(updateElement: HTMLImageElement | HTMLVideoElement | undefined) {
    this._maskedElement = updateElement;
  }
  set speed(speed: number) {
    this._speed = speed;
  }
  set vectors(vectors: VectorType[]) {
    this._points = this._createPoints(vectors, this._scramble, this._size, this._speed);
    this._numberOfPoints = vectors.length;
  }
  set scramble(scramble: number) {
    this._scramble = scramble;
    this._points = this._createPoints(this._points.map(({ initialX, initialY }) => ({ x: initialX, y: initialY })), scramble, this._size, this._speed);
  }
  set size(size: number) {
    this._size = size;
    this._points = this._createPoints(this._points.map(({ initialX, initialY }) => ({ x: initialX, y: initialY })), this._scramble, size, this._speed);
    this._canvas.setAttribute('width', `${size}px`);
    this._canvas.setAttribute('height', `${size}px`);
  }
}

export default Blob;