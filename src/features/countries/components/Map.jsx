import React from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  // Markers,
  // Marker,
} from 'react-simple-maps';
import chroma from 'chroma-js';
import PropTypes from 'prop-types';
// import { Tooltip, actions } from 'redux-tooltip';
// import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';

const wrapperStyles = {
  width: '100%',
  maxWidth: 980,
  margin: '0 auto',
};

const colorScale = chroma
  .scale(['#FF6E40', 'red', '#FFD740', 'green', '#00B8D4', 'blue'])
  .mode('lch')
  .colors(9);

const Continents = [
  'Africa',
  'Antarctica',
  'Asia',
  'Europe',
  'North America',
  'Oceania',
  'Seven seas (open ocean)',
  'South America',
];

const Map = ({
  data,
  setSelection,
  addToCart,
  // handleCityClick,
  zoom,
  handleReset,
  coordinates,
}) => (
  <div style={wrapperStyles} data-testid="mapComponent">
    {/* <button type="button" onClick={handleZoomIn()}>
        Zoom in
      </button>
      <button type="button" onClick={handleZoomOut()}>
        Zoom out
      </button> */}
    <button type="button" onClick={handleReset()} className="black">
      Reset
    </button>
    <Motion
      defaultStyle={{
        zoom: 1,
        x: 0,
        y: 20,
      }}
      style={{
        zoom: spring(zoom, { stiffness: 210, damping: 20 }),
        x: spring(coordinates[0], { stiffness: 210, damping: 20 }),
        y: spring(coordinates[1], { stiffness: 210, damping: 20 }),
      }}
    >
      {/* eslint-disable-next-line */
      ({ zoom, x, y }) => (
        <ComposableMap
          projectionConfig={{
            scale: 205,
            rotation: [-11, 0, 0],
          }}
          width={980}
          height={520}
          style={{
            width: '100%',
            height: 'auto',
            backgroundColor: '#24292f',
          }}
        >
          <ZoomableGroup center={[x, y]} zoom={zoom}>
            <Geographies geography={data} disableOptimization>
              {(geographies, projection) => geographies.map((geography) => {
                console.log('geography.properties.sold', geography.properties.sold);
                return (
                  <Geography
                    key={geography.properties.name}
                    geography={geography}
                    onMouseEnter={() => setSelection({
                      name: geography.properties.name,
                      plots: geography.properties.totalPlots,
                      price: geography.properties.price,
                      roi: geography.properties.roi,
                      id: geography.properties.countryId,
                    })
                      }
                      // onMouseLeave={() => setSelection({})}
                    onClick={() => addToCart({
                      id: geography.properties.countryId,
                      countryId: geography.properties.countryId,
                      name: geography.properties.name,
                      price: geography.properties.price,
                      plots: geography.properties.totalPlots,
                      roi: geography.properties.roi,
                      sold: geography.properties.sold,
                      mapIndex: geography.properties.mapIndex,
                    })
                      }
                    projection={projection}
                    data-testid={geography.properties.name}
                    style={{
                      default: {
                        fill:
                            geography.properties.sold === true
                              ? colorScale[Continents.indexOf(geography.properties.continent)]
                              : 'black',
                        stroke: '#24292f',
                        strokeWidth: 0.75,
                        outline: 'none',
                      },
                      hover: {
                        fill: chroma(
                          colorScale[Continents.indexOf(geography.properties.continent)],
                        ).darken(0.5),
                        stroke: '#24292f',
                        strokeWidth: 0.75,
                        outline: 'none',
                      },
                      pressed: {
                        fill: chroma(
                          colorScale[Continents.indexOf(geography.properties.continent)],
                        ).brighten(0.5),
                        stroke: '#24292f',
                        strokeWidth: 0.75,
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      )}
    </Motion>
  </div>
);

Map.propTypes = {
  data: PropTypes.shape({}).isRequired,
  setSelection: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  zoom: PropTypes.number.isRequired,
  handleReset: PropTypes.func.isRequired,
  coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default Map;
