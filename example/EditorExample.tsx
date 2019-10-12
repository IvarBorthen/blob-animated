import React from 'react';
import { MDBBtn } from 'mdbreact';
import styled from '@emotion/styled';
import Slider from './Slider';
import { generatePoints, BlobType } from '../src';

const StyledWrapper = styled.div`
  margin: 20px;
`;

type Props = {
  Blob: BlobType;
}

const EditorExample: React.FunctionComponent<Props> = ({ Blob }) => (
  <StyledWrapper>
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
    <MDBBtn color="primary" onClick={() => {
      const copyText = document.createElement('textarea');
      document.body.appendChild(copyText);
      copyText.value = `{
        vectors: [${Blob.vectors.map((vector, index) => `{ x: ${vector.x}, y: ${vector.x} }`)}],
        speed: ${Blob.speed},
        scramble: ${Blob.scramble},
      }`;
      
      copyText.select();
      copyText.setSelectionRange(0, 999); // mobile devices
      document.execCommand('copy');
      document.body.removeChild(copyText);
      alert('Copied blob vectors to clipBoard.');
    }}>Copy state</MDBBtn>
  </StyledWrapper>
);

export default EditorExample;