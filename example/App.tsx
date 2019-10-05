import React, { useEffect, useState, useRef } from 'react';
import { hot } from 'react-hot-loader/root';
import DrawBlob, { generatePoints } from '../lib';
import roadImage from './images/road.jpg';
import winterImage from './images/winter.jpg';
import styled from '@emotion/styled';

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

let Blob;

const App = () => {
  const images = [
    {
      name: 'winter',
      image: winterImage,
    },
    {
      name: 'road',
      image: roadImage,
    }
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
    Blob = new DrawBlob({
      canvas,
      speed,
      vectors,
      scramble,
      debug: editMode,
      maskedElement: imageRef.current,
      changedVectorsCallback: (newVectors) => {
        setVectors(newVectors);
      }
    });
  }, []);
  return (
    <StyledWrapper>
      <h1>The Blob</h1>
      <p>Its alive!</p>
      <button onClick={() => {
        Blob.debug = !editMode;
        setEditMode(!editMode);
      }}>
        {editMode ? 'Edit blob' : 'Close editor'}
      </button>
      <img src={images[withImage].image} ref={imageRef} style={{ display: 'none' }} />
      <StyledCanvasContainer>
        <StyledCanvas ref={canvasRef} width="1000" height="1000" />
      </StyledCanvasContainer>
      <StyledButtonImagesWrapper>
        {images.map((image, index) => (
          <StyledImageButton active={withImage === index} key={image.name} onClick={() => setImage(index)}>
            <img src={image.image} />
          </StyledImageButton>
        ))}
      </StyledButtonImagesWrapper>
    </StyledWrapper>
  );
}

export default hot(App);