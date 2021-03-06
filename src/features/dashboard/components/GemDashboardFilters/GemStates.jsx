import {CutEdgesButton} from "../../../../components/CutEdgesButton";
import React from "react";
import styled from "styled-components";

const AdjustContainer = styled.div`
    display: flex;
    margin-right: .3vw;
    flex: 3 3;
    @media(min-width: 801px) and (max-width: 1494px) {
        flex: 0;
    }
`;

const GemStatesContainer = styled.div`
    display: flex;
    flex-wrap: wrap; 
    align-items: center;
    align-content: center;
    justify-content: space-evenly;
    
    
    padding: 8px;
    background-color: #24292F;
    clip-path: polygon(8% 0, 92% 0, 100% 10%, 100% 90%,92% 100%, 8% 100%, 0 90%, 0% 10%);
    -webkit-clip-path: polygon(8% 0, 92% 0, 100% 10%, 100% 90%,92% 100%, 8% 100%, 0 90%, 0% 10%);
    
    @media(min-width: 1520px) {
        font-size: .8vw;
    }
`;

const AdjustRowContainer = styled.div`
    display: flex;
    flex-wrap: wrap; 
    justify-content: space-evenly;
    align-items: stretch;
`;

const StateBox = styled.div`
    
    @media (max-width: 1499px) {
        font-size: 16px;
        width: 12em;    
    }
   
    
    @media (min-width: 1500px) and (max-width: 2700px) {
        font-size: 1em;
        width: 6em;    
    }
    
    @media (min-width: 2700px) {
        font-size: 1.2rem;
        width: 8rem;    
    }
    
  
    
    
    flex: 1;
    margin: 3px 3px; 
    font-weight: normal;
`;

const GemStates = ({unselectedFilters, toggleFilter}) => (
    <AdjustContainer>
        <GemStatesContainer>
            <AdjustRowContainer>
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
            </AdjustRowContainer>
            <AdjustRowContainer>
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
            </AdjustRowContainer>
        </GemStatesContainer>
    </AdjustContainer>
)


export default GemStates