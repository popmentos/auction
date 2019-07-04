import {CutEdgesButton} from "../../../../components/CutEdgesButton";
import React from "react";
import styled from "styled-components";

const GemStatesContainer = styled.div`
    display: flex;
    flex-wrap: wrap; 
    max-width: 200px;
    align-items: center;
    align-content: center;
    padding: 8px;
    background-color: #24292F;
    clip-path: polygon(8% 0, 92% 0, 100% 10%, 100% 90%,92% 100%, 8% 100%, 0 90%, 0% 10%);
    -webkit-clip-path: polygon(8% 0, 92% 0, 100% 10%, 100% 90%,92% 100%, 8% 100%, 0 90%, 0% 10%);
    
    @media(max-width: 800px) {
        width: 175px;
        margin: 0 10px;
    }
    
    @media(min-width: 1520px) {
        font-size: .8vw;
    }
`;

const StateBox = styled.div`

    @media(max-width: 599px) {
        margin: 1px 3px;
        min-width: 50px;
        font-size: 12px;
    }
    
    @media(min-width: 1520px) {
        font-size: .8vw;
    }
    
    @media (min-width: 801px) and (max-width: 1100px) {
        font-size: 1.3vw;
    }
    
    min-width:210px;
    align-items: center;
    align-contents: center;   
    font-size: 16px;
    flex: 1;
    min-width: 70px; 
    margin: 3px 3px; 
    font-weight: normal
`;


const GemStates = ({unselectedFilters, toggleFilter}) => (
    <GemStatesContainer>
        <StateBox onClick={() => toggleFilter("idle", "states")}>
            <CutEdgesButton outlineColor={() => !unselectedFilters.states.includes("idle") ? "#79D7B9" : "black"}
                            backgroundColor={() => !unselectedFilters.states.includes("idle") ? "#204F3E" : "black"}
                            fontColor={"#79D7B9"}
                            edgeSizes={[10, 20]}
                            outlineWidth={2}
                            height={30}
                            content={"Idle"}/>
        </StateBox>
        <StateBox onClick={() => toggleFilter("mining", "states")}>
            <CutEdgesButton outlineColor={() => !unselectedFilters.states.includes("mining") ? "#98C7FF" : "black"}
                            backgroundColor={() => !unselectedFilters.states.includes("mining") ? "#004056" : "black"}
                            fontColor={"#98C7FF"}
                            edgeSizes={[10, 20]}
                            outlineWidth={2}
                            height={30}
                            content={"Mining"}/>
        </StateBox>
        <StateBox onClick={() => toggleFilter("auction", "states")}>
            <CutEdgesButton outlineColor={() => !unselectedFilters.states.includes("auction") ? "#F0D978" : "black"}
                            backgroundColor={() => !unselectedFilters.states.includes("auction") ? "#443807" : "black"}
                            fontColor={"#F0D978"}
                            edgeSizes={[10, 20]}
                            outlineWidth={2}
                            height={30}
                            content={"In Auction"}
                            otherStyles={"white-space: nowrap;"}/>
        </StateBox>
        <StateBox onClick={() => toggleFilter("stuck", "states")}>
            <CutEdgesButton outlineColor={() => !unselectedFilters.states.includes("stuck") ? "#EF6E7E" : "black"}
                            backgroundColor={() => !unselectedFilters.states.includes("stuck") ? "#700E23" : "black"}
                            fontColor={"#EF6E7E"}
                            edgeSizes={[10, 20]}
                            outlineWidth={2}
                            height={30}
                            content={"Stuck"}/>
        </StateBox>
    </GemStatesContainer>
)



export default GemStates