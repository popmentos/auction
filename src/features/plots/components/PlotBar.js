import React, {Component} from "react";
import styled from 'styled-components';
import {getGemImage} from "../../../app/services/GemService";
import GemImage from "../../../components/GemImage";

class PlotBar extends Component {

    state = {};

    componentDidMount() {
        const {} = this.props;
        this.setState({windowWidth: window.innerWidth, windowHeight: window.innerHeight});
    }

    componentDidUpdate(prevProps) {
        const {} = this.props;
    }

    calculateEmptiedPercentage(plot, tier) {
        return Math.max(Math.min(plot.currentPercentage - (tier > 0 ? plot.layerEndPercentages[tier-1] : 0), plot.layerPercentages[tier]) , 0);
    }

    render() {
        const {plot} = this.props;
        const barHeight = (this.state.windowHeight && this.state.windowHeight < 730) ? 300 : 450;
        const inAntarctica = plot.countryId === 0;
        return (
          <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              height: barHeight,
              minHeight: barHeight,
              paddingTop: "20px",
              marginTop: "5px"
          }}>
              <Hat emptied={plot.currentPercentage > 0} inAntarctica={inAntarctica}/>
              <Layer tier={0}
                     inAntarctica={inAntarctica}
                     height={plot.layerPercentages["0"] * barHeight / 100}
                     heightEmptied={this.calculateEmptiedPercentage(plot, 0) * barHeight / 100}
              />
              <Layer tier={1} height={plot.layerPercentages["1"] * barHeight / 100}
                     inAntarctica={inAntarctica}
                     heightEmptied={this.calculateEmptiedPercentage(plot, 1) * barHeight / 100}/>
              <Layer tier={2} height={plot.layerPercentages["2"] * barHeight / 100}
                     heightEmptied={this.calculateEmptiedPercentage(plot, 2) * barHeight / 100}/>
              <Layer tier={3} height={plot.layerPercentages["3"] * barHeight / 100}
                     heightEmptied={this.calculateEmptiedPercentage(plot, 3) * barHeight / 100}/>
              <Layer tier={4} height={plot.layerPercentages["4"] * barHeight / 100}
                     heightEmptied={this.calculateEmptiedPercentage(plot, 4) * barHeight / 100}/>
              {plot.gemMines && <MaxDepthLevel topOffset={plot.layerEndPercentages[plot.gemMines.level-1] * barHeight / 100}/>}
              {plot.gemMines && <CurrentGemUsed topOffset={plot.currentPercentage*barHeight / 100} gem={plot.gemMines} onClick={this.props.onGemClick}/>}
          </div>

        );
    }
}

const CurrentGemUsed = ({topOffset, gem, onClick}) => {

    const calculateGemBackgroundColor = (grade) => {
        return "#7a7a7a";
    }

    const imageStyle = {
        width: "74px",
        height: "74px",
        position: "absolute",
        top: Math.max(topOffset - 60, 0) + "px",
        backgroundColor: calculateGemBackgroundColor(gem.gradeValue),
        border: "4px solid black",
        left: "-7px",
        zIndex: "10",
    }

    return (
      <div style={imageStyle} onClick={onClick}>
          <GemImage gem={gem}/>
      </div>
    )
}

const MaxDepthLevel = ({topOffset}) => {

    const arrowStyle = {
        width: "80px",
        height: "10px",
        position: "absolute",
        left: "-10px",
        top: topOffset + 20 + "px",
        zIndex: "10"
    }

    const faceRightStyle = {
        transform: "skew(0deg, -10deg)",
        width: "40px",
        height: "10px",
        backgroundColor: "#820906",
        float: "left"
    }

    const faceLeftStyle = {
        transform: "skew(0deg, 10deg)",
        width: "40px",
        height: "10px",
        backgroundColor: "#820906",
        float: "left"
    }

    return (
      <div className="prism" style={arrowStyle}>
          <div className="face-left" style={faceLeftStyle}/>
          <div className="face-right" style={faceRightStyle}/>
      </div>
    );
}


const Hat = styled.div`
    width: 44px;
    height: 44px;
    background-color: ${props => props.inAntarctica ? "#E3F8FD" : "#664330"};
    transform: rotateX(79deg) rotateZ(45deg);
    position: absolute;
    top: -5px;
    left: 8px;
    opacity: ${props => props.emptied ? "0.5" : "1"};
`;


const Layer = ({tier, height, heightEmptied, inAntarctica}) => {

    //console.log("Height:", height);

    let backgroundColorLeft, backgroundColorRight;
    switch (tier) {
        case 0:
            backgroundColorLeft = inAntarctica ? "#AAE1F2" : "#492F1D";
            backgroundColorRight = inAntarctica ? "#C2EBF7" : "#563621";
            break;
        case 1:
            backgroundColorLeft = inAntarctica ? "#4C88C3" : "#492518";
            backgroundColorRight = inAntarctica ? "#78A7D5" : "#592E21";
            break;
        case 2:
            backgroundColorLeft = "#49484F";
            backgroundColorRight = "#525256";
            break;
        case 3:
            backgroundColorLeft = "#CEC9BE";
            backgroundColorRight = "#E2DED3";
            break;
        case 4:
            backgroundColorLeft = "#191515";
            backgroundColorRight = "#281E1E";
            break;
    }


    const faceLeftTopEdgeStyle = {
        position: "absolute",
        width: "100%",
        height: "10px",
        backgroundColor: backgroundColorLeft,
        top: "-9px",
        clipPath: "polygon(0% 79%, 21% 18%, 28% 66%, 38% 34%, 58% 48%, 53% 64%, 69% 52%, 77% 26%, 99% 57%, 100% 97%, 0% 100%)",
        WebkitClipPath: "polygon(0% 79%, 21% 18%, 28% 66%, 38% 34%, 58% 48%, 53% 64%, 69% 52%, 77% 26%, 99% 57%, 100% 97%, 0% 100%)"
    }

    const faceRightEdgeStyle = {
        position: "absolute",
        width: "100%",
        height: "10px",
        backgroundColor: backgroundColorRight,
        top: "-9px",
        clipPath: "polygon(0% 79%, 21% 18%, 28% 66%, 38% 34%, 58% 48%, 53% 64%, 69% 52%, 77% 26%, 99% 57%, 100% 97%, 0% 100%)",
        WebkitClipPath: "polygon(0% 79%, 21% 18%, 28% 66%, 38% 34%, 58% 48%, 53% 64%, 69% 52%, 77% 26%, 99% 57%, 100% 97%, 0% 100%)"
    }

    const faceLeftSideEdgeStyle = {
        position: "absolute",
        width: "6px",
        height: "100%",
        backgroundColor: backgroundColorLeft,
        right: "-3px",
        top: "-1px",
        clipPath: "polygon(1% 0%, 78% 12%, 45% 22%, 84% 27%, 68% 33%, 85% 38%, 100% 49%, 84% 55%, 62% 63%, 37% 76%, 71% 83%, 1% 92%, 67% 100%, 0% 100%)",
        WebkitClipPath: "polygon(1% 0%, 78% 12%, 45% 22%, 84% 27%, 68% 33%, 85% 38%, 100% 49%, 84% 55%, 62% 63%, 37% 76%, 71% 83%, 1% 92%, 67% 100%, 0% 100%)"
    }

    const Prism = styled.div`   
    `;

    const FaceLeft = styled.div`
        transform: skew(0deg, 10deg);
        width: 30px;
        height: ${props => Math.ceil(props.height || 0)}px;
        background-color: ${backgroundColorLeft};
        float: left;
        position: relative;
        z-index: 5;
        opacity: ${props => props.emptied ? "0.5" : "1"};
    `;

    const FaceRight = styled.div`
        transform: skew(0deg, -10deg);
        width: 30px;
        height: ${props => Math.ceil(props.height || 0)}px;
        background-color: ${backgroundColorRight};
        float: left;
        position: relative;
        opacity: ${props => props.emptied ? "0.5" : "1"};
    `;

    return (
      <>
          {heightEmptied > 0 &&
          <Prism>
              <FaceLeft height={heightEmptied} emptied>

              </FaceLeft>
              <FaceRight height={heightEmptied} emptied>

              </FaceRight>
          </Prism>
          }
          {(height > heightEmptied) &&
          <Prism>
              <FaceLeft height={height - heightEmptied}>
                  {/*{tier !== 0 ? <div style={faceLeftTopEdgeStyle}></div> : ""}*/}
                  {/*<div style={faceLeftSideEdgeStyle}></div>*/}
              </FaceLeft>
              <FaceRight height={height - heightEmptied}>
                  {/*{tier !== 0 ? <div style={faceRightEdgeStyle}></div> : ""}*/}
              </FaceRight>
          </Prism>
          }
      </>
    );
}


export default PlotBar;
