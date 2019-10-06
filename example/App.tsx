import React, { useEffect, useState, useRef } from 'react';
import { hot } from 'react-hot-loader/root';
import styled from '@emotion/styled';
import DrawBlob, { generatePoints, BlobType } from '../src';
import Slider from './Slider';
import roadImage from './images/road.jpg';
import winterImage from './images/winter.jpg';
import exampleVideo from './video/example.mp4';

const StyledWrapper = styled.div`
  padding: 40px;
  display: flex;
  display: flex;
  flex-direction: column;
  background: #f3f3f3;
`;

const StyledCanvas = styled.canvas`
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
  max-width: 100%;
`;

const StyledCanvasContainer = styled.div`
  display: flex;
`;

type ImageButtonProps = {
  active: boolean;
}

const StyledImageButton = styled.button<ImageButtonProps>`
  height: 100px;
  border: 0;
  background: none;
  margin: 4px;
  padding: 0;
  outline: none;
  img {
    width: auto;
    height: 100px;
  }
  opacity: ${props => props.active ? 1 : 0.6};
  transition: 400ms ease;
  &:hover {
    transform: scale(1.05);
  }
  &:focus {
    opacity: 1;
  }
`;

const StyledButtonImagesWrapper = styled.div`
  margin: 16px -4px;
`;

let Blob: BlobType;

const App = () => {
  const images = [
    {
      name: 'winter',
      src: winterImage,
    },
    {
      name: 'road',
      src: roadImage,
    },
  ];
  const [scramble, setScramble] = useState(0.1);
  const [speed, setSpeed] = useState(400);
  const [vectors, setVectors] = useState(generatePoints({ sides: 8 }));
  const [withImage, setImage] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      Blob = new DrawBlob({
        canvas,
        speed,
        vectors,
        scramble,
        colorFunction: (ctx) => {
          const gradientExample = ctx.createLinearGradient(0, 0, 0, 1000);
          gradientExample.addColorStop(0, '#2580a2');
          gradientExample.addColorStop(1, '#072c3a');
          return gradientExample;
        },
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
      <p>Its alive!</p>
      <button onClick={() => {
        Blob.debug = !editMode;
        setEditMode(!editMode);
      }}>
        {editMode ? 'Close editor' : 'Edit blob'}
      </button>
      {editMode && (
        <>
          <Slider
            title="Scramble"
            name="scramble"
            min={0}
            max={1}
            step={0.01}
            value={Blob.scramble}
            onChange={(e) => { Blob.scramble = Number(e.target.value) }}
          />
          <Slider
            title="Speed"
            name="speed"
            min={50}
            max={2000}
            step={10}
            value={Blob.speed}
            onChange={(e) => { Blob.speed = Number(e.target.value) }}
          />
          <Slider
            title="Polygons"
            name="polygons"
            min={3}
            max={20}
            step={1}
            value={Object.keys(Blob.vectors || {}).length}
            onChange={(e) => {
              Blob.vectors = generatePoints({ sides: Number(e.target.value) })
            }}
          />
        </>
      )}
      <img src={images[withImage].src} ref={imageRef} style={{ display: 'none' }} />
      <video autoPlay ref={imageRef} muted loop>
        <source src={exampleVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <StyledCanvasContainer>
        <StyledCanvas ref={canvasRef} width="1000" height="1000" />
      </StyledCanvasContainer>
      <StyledButtonImagesWrapper>
        {images.map((image, index) => (
          <StyledImageButton active={withImage === index} key={image.name} onClick={() => setImage(index)}>
            <img src={image.src} />
          </StyledImageButton>
        ))}
      </StyledButtonImagesWrapper>
    </StyledWrapper>
  );
}

export default hot(App);