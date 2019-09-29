"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "VectorType", {
  enumerable: true,
  get: function get() {
    return _types.VectorType;
  }
});
Object.defineProperty(exports, "BlobType", {
  enumerable: true,
  get: function get() {
    return _types.BlobType;
  }
});
exports["default"] = exports.generatePoints = void 0;

var _types = require("./types");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var generatePoints = function generatePoints(_ref) {
  var sides = _ref.sides,
      _ref$ratio = _ref.ratio,
      ratio = _ref$ratio === void 0 ? 1 : _ref$ratio,
      _ref$scramblePercenta = _ref.scramblePercentage,
      scramblePercentage = _ref$scramblePercenta === void 0 ? 0.1 : _ref$scramblePercenta;

  if (Math.floor(sides) !== sides || sides < 2) {
    console.warn('Error: GeneratePoints() sides param must be a integer larger than 2');
    return [];
  } // @ts-ignore


  return _toConsumableArray(Array(sides)).map(function (empty, index) {
    var x = scramblePercentage + (0.5 + 0.5 * Math.cos(index * 2 * Math.PI / sides)) * (ratio > 1 ? 1 : ratio) * (1 - scramblePercentage * 2);
    var y = scramblePercentage + (0.5 + 0.5 * Math.sin(index * 2 * Math.PI / sides)) / (ratio > 1 ? ratio : 1) * (1 - scramblePercentage * 2);
    return {
      x: x,
      y: y
    };
  });
};

exports.generatePoints = generatePoints;

var Blob =
/*#__PURE__*/
function () {
  function Blob(_ref2) {
    var _this = this;

    var canvas = _ref2.canvas,
        color = _ref2.color,
        vectors = _ref2.vectors,
        _ref2$speed = _ref2.speed,
        speed = _ref2$speed === void 0 ? 200 : _ref2$speed,
        _ref2$scramble = _ref2.scramble,
        scramble = _ref2$scramble === void 0 ? 0.1 : _ref2$scramble,
        _ref2$autoPlay = _ref2.autoPlay,
        autoPlay = _ref2$autoPlay === void 0 ? true : _ref2$autoPlay,
        _ref2$cover = _ref2.cover,
        cover = _ref2$cover === void 0 ? true : _ref2$cover,
        _ref2$size = _ref2.size,
        size = _ref2$size === void 0 ? 1000 : _ref2$size,
        maskedElement = _ref2.maskedElement,
        _ref2$debug = _ref2.debug,
        debug = _ref2$debug === void 0 ? false : _ref2$debug,
        changedVectorsCallback = _ref2.changedVectorsCallback;

    _classCallCheck(this, Blob);

    canvas.setAttribute('width', "".concat(size, "px"));
    canvas.setAttribute('height', "".concat(size, "px")); // Function for initiate points from vectors

    this._createPoints = function (vectors, scramble, size, speed) {
      return vectors.map(function (_ref3) {
        var x = _ref3.x,
            y = _ref3.y;
        return {
          initialX: x,
          initialY: y,
          x: (x + Math.random() * scramble - scramble / 2) * size,
          y: (y + Math.random() * scramble - scramble / 2) * size,
          xFrom: x * size,
          yFrom: y * size,
          xTarget: (x + Math.random() * scramble - scramble / 2) * size,
          yTarget: (y + Math.random() * scramble - scramble / 2) * size,
          bornX: 0,
          willDieX: Math.ceil(speed * Math.random() + speed / 2),
          bornY: 0,
          willDieY: Math.ceil(speed * Math.random() + speed / 2)
        };
      });
    }; // Create points


    this._points = this._createPoints(vectors || generatePoints({
      sides: 8,
      scramblePercentage: scramble
    }), scramble, size, speed);
    this._numberOfPoints = this._points.length;
    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');
    this._size = size;
    this._color = color;
    this._scramble = scramble;
    this._speed = speed;
    this._frame = 1;
    this._maskedElement = maskedElement;
    this._isPlaying = autoPlay;
    this._cover = cover; // For editing vector arrays

    this._isDragging = false;
    this._changedVectorsCallback = changedVectorsCallback;
    this._dragIndex = -1;

    this._easeInOutQuad = function (t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    this._updatePositions = function (point) {
      var livedPercentageX = (_this._frame - point.bornX) / (point.willDieX - point.bornX);
      var livedPercentageY = (_this._frame - point.bornY) / (point.willDieY - point.bornY);

      if (livedPercentageX >= 1) {
        // Update life for X
        point.bornX = _this._frame;
        point.willDieX = _this._frame + Math.ceil(_this._speed * Math.random() + _this._speed / 2), livedPercentageX = 0;
        var x = point.initialX;
        point.xFrom = point.xTarget;
        point.xTarget = (x + (Math.random() * _this._scramble * 2 - _this._scramble)) * size;
      }

      if (livedPercentageY >= 1) {
        // Update life for Y
        point.bornY = _this._frame;
        point.willDieY = _this._frame + Math.ceil(_this._speed * Math.random() + _this._speed / 2), livedPercentageY = 0;
        var y = point.initialY;
        point.yFrom = point.yTarget;
        point.yTarget = (y + (Math.random() * _this._scramble * 2 - _this._scramble)) * size;
      }

      var easingX = _this._easeInOutQuad(livedPercentageX);

      var easingY = _this._easeInOutQuad(livedPercentageY);

      point.x = point.xFrom * (1 - easingX) + point.xTarget * easingX;
      point.y = point.yFrom * (1 - easingY) + point.yTarget * easingY;
    }; // Functions for drawing


    this._getAngleRadians = function (_ref4) {
      var x1 = _ref4.x1,
          y1 = _ref4.y1,
          x2 = _ref4.x2,
          y2 = _ref4.y2;
      return Math.atan2(y1 - y2, x1 - x2);
    };

    this._getDistance = function (vector1, vector2) {
      var a = vector1.x - vector2.x;
      var b = vector1.y - vector2.y;
      return Math.sqrt(a * a + b * b);
    }; // Calculate vectors for bezierCurve points.


    this._getCurvedPathPoints = function (_ref5) {
      var x = _ref5.x,
          y = _ref5.y,
          i = _ref5.i,
          invert = _ref5.invert;
      var _points = _this._points,
          _numberOfPoints = _this._numberOfPoints,
          _getAngleRadians = _this._getAngleRadians;
      var i1 = i > 0 ? i - 1 : _numberOfPoints - 1;
      var i2 = i < _numberOfPoints - 1 ? i + 1 : 1 + i - _numberOfPoints;

      var radian = _getAngleRadians({
        x1: _points[i1].x,
        y1: _points[i1].y,
        x2: _points[i2].x,
        y2: _points[i2].y
      });

      var radius = 100;

      if (invert === -1) {
        radius = _this._getDistance(_points[i1], _points[Math.min(i, _numberOfPoints - 1)]) / 3;
      } else {
        radius = _this._getDistance(_points[i2], _points[Math.min(i, _numberOfPoints - 1)]) / 3;
      }

      return {
        x: x + Math.cos(radian) * radius * -invert,
        y: y + Math.sin(radian) * radius * -invert
      };
    };

    this._draw = function () {
      if (_this._ctx) {
        var _ctx = _this._ctx,
            _points = _this._points,
            _numberOfPoints = _this._numberOfPoints,
            _getCurvedPathPoints = _this._getCurvedPathPoints,
            _updatePositions = _this._updatePositions;

        _ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (_points.length > 2) {
          _this._frame += 1;

          _points.forEach(function (point) {
            return _updatePositions(point);
          });

          var dots = []; // const xPos = -canvas.width / 2;
          // const yPos = -canvas.height / 2;

          var x = _points[0].x;
          var y = _points[0].y;

          _ctx.beginPath();

          _ctx.moveTo(x, y); // loop


          _points.forEach(function (_ref6, i) {
            var x = _ref6.x,
                y = _ref6.y;

            var cp1 = _getCurvedPathPoints({
              x: x,
              y: y,
              i: i,
              invert: 1
            });

            var nextI = i < _numberOfPoints - 1 ? i + 1 : 1 + i - _numberOfPoints;
            var nextX = _points[nextI].x;
            var nextY = _points[nextI].y;

            var cp2 = _getCurvedPathPoints({
              x: nextX,
              y: nextY,
              i: i === _numberOfPoints - 1 ? 0 : i + 1,
              invert: -1
            });

            dots[i] = {
              cp1x: cp1.x,
              cp1y: cp1.y,
              cp2x: cp2.x,
              cp2y: cp2.y,
              x: nextX,
              y: nextY,
              initialX: _points[i].initialX,
              initialY: _points[i].initialY
            };

            _ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, nextX, nextY);
          });

          _ctx.fillStyle = _this._color || '#333';

          _ctx.fill();

          if (_this._maskedElement) {
            // @ts-ignore
            var width = _this._maskedElement.width || _this._maskedElement.videoWidth; // @ts-ignore

            var height = _this._maskedElement.height || _this._maskedElement.videoHeight;
            var sizeMultipler = _this._size / width;
            _this._ctx.globalCompositeOperation = 'source-in';

            if (_this._cover) {
              // Fix cover calculations!!!
              _this._ctx.drawImage(_this._maskedElement, 0, (_this._size - sizeMultipler * height) / 2, _this._size, sizeMultipler * height);
            } else {
              _this._ctx.drawImage(_this._maskedElement, 0, (_this._size - sizeMultipler * height) / 2, _this._size, sizeMultipler * height);
            }

            _this._ctx.globalCompositeOperation = 'source-over';
          }

          if (_this._debug) {
            dots.map(function (dotData) {
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

              var hovered = _this._mousePositions && _this._getDistance(_this._mousePositions, {
                x: dotData.initialX,
                y: dotData.initialY
              }) < _this._scramble;

              _ctx.beginPath();

              _ctx.fillStyle = "rgba(255, 0, 0, ".concat(hovered ? 0.8 : 0.4, ")");

              _ctx.arc(dotData.initialX * _this._size, dotData.initialY * _this._size, _this._size * _this._scramble, 0, Math.PI * 2);

              _ctx.fill();
            });
          }

          if (_this._isPlaying) {
            window.requestAnimationFrame(function () {
              _this._draw();
            });
          }
        }
      }
    };

    this._debugModeChanged = function (debugBlob) {
      if (debugBlob) {
        window.addEventListener('mousemove', function (e) {
          var rect = _this._canvas.getBoundingClientRect();

          var mouseX = e.clientX - rect.left;
          var mouseY = e.clientY - rect.top;

          if (_this._isDragging) {
            // Move points
            var x = mouseX / rect.width;
            var y = mouseY / rect.height;
            _this._points[_this._dragIndex].initialX = x;
            _this._points[_this._dragIndex].initialY = y;
            _this._points[_this._dragIndex].x = (x + 0.5 * scramble - scramble / 2) * size;
            _this._points[_this._dragIndex].y = (y + 0.5 * scramble - scramble / 2) * size;
            _this._points[_this._dragIndex].xFrom = x * size;
            _this._points[_this._dragIndex].yFrom = y * size;
            _this._points[_this._dragIndex].xTarget = (x + 0.5 * scramble - scramble / 2) * size;
            _this._points[_this._dragIndex].yTarget = (y + 0.5 * scramble - scramble / 2) * size;
          } else {
            var multipler = _this._size / rect.width;
            _this._mousePositions = {
              x: mouseX * multipler / _this._size,
              y: mouseY * multipler / _this._size
            };
          }
        });

        _this._canvas.addEventListener('mousedown', function () {
          if (_this._mousePositions) {
            var dragIndex = _this._points.findIndex(function (point) {
              return _this._mousePositions && _this._getDistance(_this._mousePositions, {
                x: point.initialX,
                y: point.initialY
              }) < _this._scramble;
            });

            if (dragIndex > -1) {
              _this._isDragging = true;
              _this._dragIndex = dragIndex;

              var mouseUpListener = function mouseUpListener() {
                if (_this._isDragging && _this._changedVectorsCallback) {
                  var _newVectors = _this._points.map(function (_ref7) {
                    var initialX = _ref7.initialX,
                        initialY = _ref7.initialY;
                    return {
                      x: initialX,
                      y: initialY
                    };
                  });

                  _this._changedVectorsCallback(_newVectors);
                }

                _this._isDragging = false;
                window.removeEventListener('mouseup', mouseUpListener);
              };

              window.addEventListener('mouseup', mouseUpListener);
            }
          }
        });
      }

      _this._debug = debugBlob;
    };

    this._debugModeChanged(debug);

    if (autoPlay) {
      this._draw();
    }
  } // getter functions


  _createClass(Blob, [{
    key: "play",
    get: function get() {
      return this._isPlaying;
    },
    // setter functions
    set: function set(playState) {
      var startPlay = playState && playState !== this._isPlaying;
      this._isPlaying = playState;

      if (startPlay) {
        this._draw();
      }
    }
  }, {
    key: "speed",
    get: function get() {
      return this._speed;
    },
    set: function set(speed) {
      this._speed = speed;
    }
  }, {
    key: "debug",
    get: function get() {
      return this._debug || false;
    },
    set: function set(debugState) {
      this._debug = debugState;
    }
  }, {
    key: "vectors",
    get: function get() {
      return this._points.map(function (_ref8) {
        var initialX = _ref8.initialX,
            initialY = _ref8.initialY;
        return {
          x: initialX,
          y: initialY
        };
      });
    },
    set: function set(vectors) {
      this._points = this._createPoints(vectors, this._scramble, this._size, this._speed);
    }
  }, {
    key: "scramble",
    get: function get() {
      return this._scramble;
    },
    set: function set(scramble) {
      this._scramble = scramble;
      this._points = this._createPoints(this._points.map(function (_ref9) {
        var initialX = _ref9.initialX,
            initialY = _ref9.initialY;
        return {
          x: initialX,
          y: initialY
        };
      }), scramble, this._size, this._speed);
    }
  }, {
    key: "size",
    get: function get() {
      return this._size;
    },
    set: function set(size) {
      this._size = size;
      this._points = this._createPoints(this._points.map(function (_ref10) {
        var initialX = _ref10.initialX,
            initialY = _ref10.initialY;
        return {
          x: initialX,
          y: initialY
        };
      }), this._scramble, size, this._speed);

      this._canvas.setAttribute('width', "".concat(size, "px"));

      this._canvas.setAttribute('height', "".concat(size, "px"));
    }
  }, {
    key: "maskedElement",
    set: function set(updateElement) {
      this._maskedElement = updateElement;
    }
  }]);

  return Blob;
}();

var _default = Blob;
exports["default"] = _default;
