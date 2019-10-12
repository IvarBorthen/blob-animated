import React from 'react';
import styled from '@emotion/styled';
import {
  MDBCarousel,
  MDBCarouselCaption,
  MDBCarouselInner,
  MDBCarouselItem,
  MDBView,
  MDBBtn,
} from 'mdbreact';
import campImage from './images/camp.jpg';
import birdImage from './images/bird.jpg';
import landscapeImage from './images/landscape.jpg';

const StyledWrapper = styled.div`
  max-width: 1000px;
  .carousel-indicators {
    z-index: 9999 !important;
  }
`;

type StyledImageContainerProps = {
  src: string;
}

const StyledImageContainer = styled.div<StyledImageContainerProps>`
  padding-top: 100%;
  background-size: cover;
  background-position: center center;
  background-image: url('${props => props.src}');
`;

const StyledMDBCarouselCaption = styled(MDBCarouselCaption)`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h3 {
    font-size: 36px;
    font-weight: bold;
    color: #fff;
    text-shadow: 1px 0 5px rgba(0,0,0,0.5);
    margin: 0 48px 12px;
  }
  p {
    font-size: 24px;
    color: #fff;
    text-shadow: 1px 0 5px rgba(0,0,0,0.5);
    margin: 0 48px 36px;
  }
`;

class CarouselPage extends React.Component {
   render() {
     return (
       <StyledWrapper>
        <MDBCarousel
          activeItem={1}
          length={3}
          showControls={false}
          showIndicators={true}
          interval={2000}
        >
        <MDBCarouselInner>
          <MDBCarouselItem itemId="1">
            <MDBView>
              <StyledImageContainer
                role="img"
                src={birdImage}
                aria-label="First slide"
              />
            </MDBView>
            <StyledMDBCarouselCaption>
              <h3>Light mask</h3>
              <p>First text</p>
              <MDBBtn color="primary">Primary</MDBBtn>
            </StyledMDBCarouselCaption>
          </MDBCarouselItem>
          <MDBCarouselItem itemId="2">
            <MDBView>
              <StyledImageContainer
                role="img"
                src={campImage}
                aria-label="Second slide"
              />
            </MDBView>
            <StyledMDBCarouselCaption>
              <h3>Strong mask</h3>
              <p>Second text</p>
              <MDBBtn color="primary">Primary</MDBBtn>
            </StyledMDBCarouselCaption>
          </MDBCarouselItem>
          <MDBCarouselItem itemId="3">
            <MDBView>
              <StyledImageContainer
                role="img"
                src={landscapeImage}
                aria-label="Third slide"
              />
            </MDBView>
            <StyledMDBCarouselCaption>
              <h3>Slight Mast</h3>
              <p>Third text</p>
              <MDBBtn color="primary">Primary</MDBBtn>
            </StyledMDBCarouselCaption>
          </MDBCarouselItem>
        </MDBCarouselInner>
      </MDBCarousel>
    </StyledWrapper>);
  };
}

export default CarouselPage;