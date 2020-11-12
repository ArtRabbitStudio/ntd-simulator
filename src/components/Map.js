import React, { useEffect, forwardRef, useImperativeHandle } from 'react'
import ReactMapGL, { Source, Layer, HTMLOverlay } from 'react-map-gl'
import { useHistory } from 'react-router-dom'
import centroid from '@turf/centroid'
import { Typography, Box, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip from './Tooltip'
import Legend from './Legend'
import { DISEASE_CONFIG } from 'AppConstants';

import useMapReducer from 'hooks/useMapReducer'
import 'mapbox-gl/dist/mapbox-gl.css'

const useStyles = makeStyles({
})

function Map({
    country,
    disease,
    countryFeatures,
    stateFeatures,
    iuFeatures,
    populationFeatures,
    width,
    height,
    disableZoom,
    filter,
    trendMode,
    colorScale,
    forwardRef,
    showNotAvailable,
}) {
    const [
        { year, viewport, feature, featureHover, tooltip, ready },
        dispatch,
    ] = useMapReducer()

    useImperativeHandle(forwardRef, () => ({
        start() {
            dispatch({ type: 'START_PLAY' })
        },
    }))

    //if (countryFeatures) console.log('countryFeatures',countryFeatures)
    /*if (iuFeatures) console.log('iuFeatures',iuFeatures)
    if (countryFeatures) console.log('countryFeatures',countryFeatures)
    if (stateFeatures) console.log('stateFeatures',stateFeatures)
    */

    const classes = useStyles()
    const history = useHistory()

    const interactiveLayers = [
        ...(!!countryFeatures ? ['fill-countries'] : []),
        // the states layer is only active if a country is selected
        ...(!!stateFeatures && country ? ['fill-states'] : []),
        ...(!!iuFeatures && country ? ['fill-iu'] : []),
    ]

    const colorProp = trendMode ? 'color-perf' : `color-${year}`

    useEffect(() => {
        if (country && ready) {
            const focus = countryFeatures.features.find(
                f => f.properties.id === country
            )

            // Set right output year for disease
            dispatch({ type: 'CHANGE_YEAR', payload: DISEASE_CONFIG[ disease ].historicEndYear })
            
            if (focus) {
                // new zooming
                const center = centroid({ type: 'FeatureCollection', features: [focus] });
                const latLong = center.geometry.coordinates
                dispatch({ type: 'FOCUSANIMATED', payload: { focus, latLong } })

                //dispatch({ type: 'FOCUS', payload: focus })
            }
        }
    }, [countryFeatures, country, dispatch, ready, disease])



    const handleViewportChange = payload => {
        dispatch({ type: 'VIEWPORT', payload })
    }

    const handleClick = event => {
        const feature = event.features[0]
        if (feature && feature.properties) {
            if (feature.properties.ADMIN0ISO3) {
                //console.log('country click',feature.properties.ADMIN0ISO3)
                history.push(`/country/${feature.properties.ADMIN0ISO3}`)
            }

            if (feature.properties.IU_ID) {
                if ( feature.properties.endemicity === 'Non-endemic' ) {
                    showNotAvailable('Non-endemic')
                    dispatch({ type: 'HOVEROUT' })
                } else if ( feature.properties[`prev-${year}`] === "null"  ) {
                    showNotAvailable('Not enough data available')
                    dispatch({ type: 'HOVEROUT' })
                } else {
                    history.push(`/${disease}/${country}/${feature.properties.IU_ID}`)
                }

            }
        }

    }

 

    const handleHover = event => {
        if (event.features) {
            const feature = event.features[0]
            if (feature) {

                dispatch({ type: 'HOVER', payload: { feature, event } })

            } else {
                dispatch({ type: 'HOVEROUT' })
            }
        } else {
            dispatch({ type: 'HOVEROUT' })
        }
    }


    // old map style mapbox://styles/kpcarter100/ck7w5zz9l026d1imn43721owm

    return (
        <div className={classes.mapWrap}>
            <ReactMapGL
                {...viewport}
                width={width ? width : '100%'}
                height={height ? height : '100%'}
                attributionControl={false}
                scrollZoom={disableZoom ? false : true}
                doubleClickZoom={disableZoom ? false : true}
                dragPan={false}
                boxZoom={false}
                dragRotate={false}
                touchZoom={false}
                touchRotate={false}
                mapStyle="mapbox://styles/kpcarter100/ck80d7xh004tt1irt06j8jkme"
                interactiveLayerIds={interactiveLayers}
                onViewportChange={handleViewportChange}
                onClick={handleClick}
                onHover={handleHover}
            >

                {/* Country features */}
                {countryFeatures && (
                    <Source id="africa-countries" type="geojson" data={countryFeatures}>
                        <Layer
                            id="fill-countries"
                            beforeId="admin-0-boundary"
                            filter={['has', colorProp]}
                            type="fill"
                            paint={{
                                'fill-color': '#CCE8F4',


                            }}
                        />
                        <Layer
                            id="hover-countries"
                            type="line"
                            filter={['has', colorProp]}
                            layout={{ 'line-join': 'bevel' }}
                            paint={{
                                'line-color': 'rgba(0,0,0,0)',
                                'line-width': 1,
                            }}
                        />
                    </Source>
                )}

                {/* IU features */}
                {iuFeatures && (
                    <Source id="africa-iu" type="geojson" data={iuFeatures}>
                        <Layer
                            id="fill-iu"
                            beforeId="admin-0-boundary"
                            type="fill"
                            paint={{
                                'fill-color': [
                                    'coalesce',
                                    ['get', colorProp],
                                    // grey shapes if no data available
                                    '#fff',
                                ],
                                'fill-outline-color': [
                                    'case',
                                    ['==', ['get', 'id'], feature?.properties.id || null],
                                    '#dfdfdf',
                                    '#dfdfdf',
                                ],
                            }}
                        />
                        <Layer
                            id="hover-iu"
                            source="africa-iu"
                            type="line"
                            layout={{ 'line-join': 'bevel' }}
                            paint={{
                                'line-color': [
                                    'case',
                                    ['==', ['get', 'id'], featureHover?.properties.id || null],
                                    '#D86422',
                                    'rgba(0,0,0,0)',
                                ],
                                'line-width': 1,
                            }}
                        />
                    </Source>
                )}

                {/* Tooltip */}
                {featureHover && !feature && (
                    <Tooltip feature={featureHover} year={year} position={tooltip} />
                )}

                {/* Legend */}
                
                <HTMLOverlay
                    redraw={() => (
                    <div
                        style={{
                        right: 32,
                        bottom: 32,
                        position: 'absolute',
                        }}
                    >
                        <Paper>
                        <Box p={1} pb={2}>
                            <Typography variant="body2" className={classes.legendTitle}>
                            {trendMode ? `Prevalence ${year}` : `Prevalence ${year}`}
                            </Typography>

                            <Legend colorScale={colorScale} />
                        </Box>
                        </Paper>
                    </div>
                    )}
                />
                
            </ReactMapGL>
        </div>
    )
}

export default forwardRef((props, ref) => (
    <Map {...props} forwardRef={ref}></Map>
))
