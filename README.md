Blob-animated
=====
Blobify images, videos, colors and gradients and HTML content. Easy to customize and create your own shapes and forms.

# Demo
🔥Live demo: http://www.blob-animated.surge.sh

# Using this module

## Install
```text
yarn add blob-animated
```

## Documentation

### Simple example:
📚Props can be updated realtime by updating its prop via get/set. Simplest example below:
```js
import DrawBlob, { BlobType } from '../src';
```
```html
<canvas id="canvasExample" />
```
```ts
// Example using Typescript code. Ignore :BlobType for regular JS.
const Blob:BlobType = new DrawBlob({
  canvas: document.getElementById('canvasExample'),
  speed: 400,
  scramble: 0.1,
  color: '#ff66cc',
});
```

### Image or video example:
📚Using the maskedElement prop we can render a masked image or video inside the blob. Sizing is automatically handled based on the canvas size.
```js
import DrawBlob, { BlobType } from '../src';
```
```html
<img id="imgExample" src="example.jpg" style="display: none;" />
<canvas id="canvasExample" />
```
```ts
// Example using Typescript code. Ignore :BlobType for regular JS.
const Blob:BlobType = new DrawBlob({
  canvas: document.getElementById('canvasExample'),
  maskedElement: document.getElementById('imgExample'),
  speed: 400,
  scramble: 0.1,
});
```

### Modifiy the blob shape and number of points.
📚You can generate vector points for your Blob using the generatePoints({ sides: n }) function. Sides param must be an integer larger than 2.
```js
import DrawBlob, { BlobType, generatePoints } from '../src';
```
```html
<img id="imgExample" src="example.jpg" style="display: none;" />
<canvas id="canvasExample" />
```
```ts
// Example using Typescript code. Ignore :BlobType for regular JS.
const Blob:BlobType = new DrawBlob({
  vectors: generatePoints({ sides: 12 }),
  canvas: document.getElementById('canvasExample'),
  maskedElement: document.getElementById('imgExample'),
  speed: 400,
  scramble: 0.1,
});
```

### Edit with click and drag for custom shape and save shapes for later use
📚Using debug (boolean) combined with changedVectorsCallback prop function we can modify and easily get the vectors for its shape. You can also use Blob.vectors to get or set vectors at anytime.
```js
import DrawBlob, { BlobType } from '../src';
```
```html
<img id="imgExample" src="example.jpg" style="display: none;" />
<canvas id="canvasExample" />
```
```ts
// Example using Typescript code. Ignore :BlobType for regular JS.
const Blob:BlobType = new DrawBlob({
  canvas: document.getElementById('canvasExample'),
  maskedElement: document.getElementById('imgExample'),
  speed: 400,
  scramble: 0.1,
  changedVectorsCallback: (newVectors) => {
    setVectors(newVectors);
  }
});

// Or later using;
const blobsVectors = Blob.vectors;
```

### Mask any HTML element with inverted masking
📚By inverting the mask you can let the canvas be positioned over the HTML content and give the impression that the HTML content has been masked.
```js
import DrawBlob, { BlobType } from '../src';
```
```html
<img id="imgExample" src="example.jpg" style="display: none;" />
<canvas id="canvasExample" style="position: absolute; z-index: 999;" />
<div>
  <h1>Any content that we want to appear to be masked.</h1>
  <p>Tips, align the content and keep it the same size as the canvas and let its color be the same as the background.</p>
</div>
```
```ts
// Example using Typescript code. Ignore :BlobType for regular JS.
const Blob:BlobType = new DrawBlob({
  canvas: document.getElementById('canvasExample'),
  speed: 400,
  scramble: 0.1,
  inverted: true,
  color: '#fff',
});

// Or later using;
const blobsVectors = Blob.vectors;
```

# Props
`canvas`: HTMLCanvasElement *(required)*

`speed`: number (points movement in ms) *(required)*

`scramble`: number 0-1, freedom of movement for blob vectors during animation

`maskedElement`: HTMLImageElement || HTMLVideoElement

`color`: string

`colorFunction`: (ctx) => () returning a ctx.gradient colorFill

`inverted`: boolean (inverted masking for HTML content)

`vectors`: array of Vectors [{ x: n, y: n }, ...{}] where n is number from 0-1

`autoPlay`: boolean, inital play/pause state

`debug`: boolean, makes it possible to click and drag vector points for easy shape customization

`changedVectorsCallback`: function callback when draging vectors in debug-mode.

All options has read/write functionality, i.e. double speed could be achieved with: `Blob.speed = Blob.speed / 2;`


# Author
Written by Ivar Borthen (IvarBorthen). Frontend developer and UX-designer.

# License
This package is MIT licensed.