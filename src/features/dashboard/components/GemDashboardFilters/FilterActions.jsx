import React, {Fragment} from "react"
import {CutEdgesButton} from "../../../../components/CutEdgesButton";
import styled from "styled-components";

const FilterActionsContainer = styled.div`
    display: flex;
    flex-direction: column; 
    justify-content: center;
    width: 110px;
    padding: 8px;
    background-color: #24292F;
    clip-path: polygon(10% 0, 90% 0, 100% 10%, 100% 90%,90% 100%, 10% 100%, 0 90%, 0% 10%);
    -webkit-clip-path: polygon(10% 0, 90% 0, 100% 10%, 100% 90%,90% 100%, 10% 100%, 0 90%, 0% 10%);
    font-size: 16px;
    
    @media(max-width: 800px) {
        width: 100px;
        font-size: 14px;
        margin: 0 10px;
    }
`;

const FilterActions = ({clearFilters, setDefaultFilters}) => {
    return (
        <FilterActionsContainer>
            <div style={{margin: "3px 3px", fontWeight: "normal"}}>
                <CutEdgesButton outlineColor={"orange"}
                                backgroundColor={"black"}
                                edgeSizes={[7, 20]}
                                outlineWidth={2}
                                height={32}
                                content={"Clear"}
                                onClick={() => clearFilters()}/>
            </div>
            <div style={{margin: "3px 3px", fontWeight: "normal"}}>
                <CutEdgesButton outlineColor={"aquamarine"}
                                backgroundColor={"black"}
                                edgeSizes={[7, 20]}
                                outlineWidth={2}
                                height={32}
                                content={"Default"}
                                onClick={() => setDefaultFilters()}/>
            </div>
        </FilterActionsContainer>
    );
};

export default FilterActions;