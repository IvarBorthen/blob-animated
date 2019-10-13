import React, { useEffect, useState, useRef } from 'react';
import { hot } from 'react-hot-loader/root';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import DrawBlob, { generatePoints, BlobType } from '../src';
import roadImage from './images/road.jpg';
import CarouselExample from './CarouselExample';
import EditorExample from './EditorExample';

const StyledWrapper = styled.div`
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  display: flex;
  flex-direction: column;
  select {
    margin-bottom: 10px;
  }
`;

type StyledCanvasContainerProps = {
  withHTMLBackground?: boolean;
  editMode: boolean;
}
const StyledCanvasContainer = styled.div<StyledCanvasContainerProps>`
  display: flex;
  ${props => props.withHTMLBackground && css`
    position: relative;
    canvas {
      position: absolute;
      z-index: 9999;
    }
  `}
  canvas {
    width: 100%;
    max-width: 800px;
    ${props => props.editMode && css`
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);
    `}
  }
`;

const StyledEditBlobButton = styled.button`
  margin: 10px 0;
`;

type ImageButtonProps = {
  active?: boolean;
}

let Blob: BlobType;

const App = () => {
  const [vectors, setVectors] = useState(generatePoints({ sides: 8 }));
  const [withHTMLBackground, setHTMLBackground] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedExample, setSelectedExample] = useState('image');

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const videoRef = useRef(null);

  const colorFunction = (ctx) => {
    const gradientExample = ctx.createLinearGradient(0, 0, 0, 1000);
    gradientExample.addColorStop(0, '#519bbf');
    gradientExample.addColorStop(1, '#0a1a23');
    return gradientExample;
  }
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      Blob = new DrawBlob({
        canvas,
        speed: 400,
        vectors,
        scramble: 0.1,
        debug: editMode,
        maskedElement: imageRef.current,
        changedVectorsCallback: (newVectors) => {
          setVectors(newVectors);
        }
      });
    }
  }, []);
  return (
    <StyledWrapper>
      <h1>The Blob</h1>
      <p>Fully customizable, light weight and easy to use Blob. Auto scales images and videos to cover blob. Also takes any color and color gradients + Any HTML-content</p>
      <StyledEditBlobButton onClick={() => {
        Blob.debug = !editMode;
        setEditMode(!editMode);
      }}>
        {editMode ? 'Close editor' : 'Edit blob'}
      </StyledEditBlobButton>
      {editMode && (
        <EditorExample Blob={Blob} />
      )}
      <div>
        <select
          className="browser-default custom-select"
          value={selectedExample}
          onChange={(e) => {
            const value = e.target.value;
            videoRef.current.pause()
            if (value === 'image') {
              Blob.maskedElement = imageRef.current;
              Blob.inverted = false;
              Blob.color = '#fff';
            } else if (value === 'color') {
              Blob.maskedElement = undefined;
              Blob.inverted = false;
              Blob.color = '#519bbf';
            } else if (value === 'colorFunction') {
              Blob.maskedElement = undefined;
              Blob.inverted = false;
              Blob.color = colorFunction;
            } else if (value === 'html') {
              Blob.inverted = true;
              Blob.maskedElement = undefined;
              Blob.color = '#fff';
            } else if (value === 'video') {
              Blob.inverted = false;
              videoRef.current.play();
              Blob.maskedElement = videoRef.current;
              Blob.color = '#fff';
            }
            setHTMLBackground(value === 'html');
            setSelectedExample(e.target.value);
          }}
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="color">Color (string)</option>
          <option value="colorFunction">Gradient (colorfunction)</option>
          <option value="html">HTML (with inverted masking)</option>
        </select>
      </div>
      <img src={roadImage} ref={imageRef} style={{ display: 'none' }} />
      <video ref={videoRef} preload="auto" loop style={{ display: 'none' }}>
        <source src = "http://www.w3schools.com/html/mov_bbb.mp4" />
      </video>
      <StyledCanvasContainer editMode={editMode} withHTMLBackground={withHTMLBackground}>
        <canvas ref={canvasRef} />
      </StyledCanvasContainer>
      {withHTMLBackground && <CarouselExample />}
    </StyledWrapper>
  );
}

export default hot(App);