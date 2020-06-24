import React, { useEffect, forwardRef, useImperativeHandle } from 'react'
import ReactMapGL, { Source, Layer, Popup, HTMLOverlay } from 'react-map-gl'
import { useHistory, useRouteMatch, Link as RouterLink } from 'react-router-dom'
import { Typography, Slider, Box, Link, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { format } from 'd3'
import useMapReducer from '../hooks/useMapReducer'
import { NO_DATA } from '../constants'
import 'mapbox-gl/dist/mapbox-gl.css'

const useStyles = makeStyles({
})

function Map({
    country,
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
}) {
    const [
        { year, viewport, feature, featureHover, popup, tooltip, playing, ready },
        dispatch,
    ] = useMapReducer()

    useImperativeHandle(forwardRef, () => ({
        start() {
            dispatch({ type: 'START_PLAY' })
        },
    }))

    if (iuFeatures) console.log(iuFeatures)

    const classes = useStyles()

    const interactiveLayers = [
        ...(!!countryFeatures ? ['fill-countries'] : []),
        // the states layer is only active if a country is selected
        ...(!!stateFeatures && country ? ['fill-states'] : []),
        ...(!!iuFeatures && country ? ['fill-iu'] : []),
    ]

    const colorProp = trendMode ? 'color-perf' : `color-${year}`
    /*
    useEffect(() => {
        if (country && ready) {
            const focus = countryFeatures.features.find(
                f => f.properties.id === country
            )
            if (focus) {
                dispatch({ type: 'FOCUS', payload: focus })
            }
        }
    }, [countryFeatures, country, dispatch, ready])
    */


    const handleViewportChange = payload => {
        dispatch({ type: 'VIEWPORT', payload })
    }

    const handleClick = event => {
        const feature = event.features[0]
        if (feature) {
            dispatch({ type: 'SELECT', payload: { feature, event } })
        }
    }

    //   const selectCountryClickHotspots = countryId => {
    //     if (match) {
    //       if (match.params.section != 'trends') {
    //         match.params.section = 'hotspots'
    //       }

    //       history.push(`/${match.params.section}/${countryId}`)
    //     } else {
    //       history.push(`/hotspots/${countryId}`)
    //     }
    //   }

    //   const selectCountryClickTrends = countryId => {
    //     if (match) {
    //       if (match.params.section != 'trends') {
    //         match.params.section = 'trends'
    //       }

    //       history.push(`/${match.params.section}/${countryId}`)
    //     } else {
    //       history.push(`/trends/${countryId}`)
    //     }
    //   }

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
                mapStyle="mapbox://styles/kpcarter100/ck80d7xh004tt1irt06j8jkme"
                interactiveLayerIds={interactiveLayers}
                onViewportChange={handleViewportChange}
                onClick={handleClick}
                onHover={handleHover}
            >

                {/* IU features */}
                {iuFeatures && (
                    <Source id="africa-iu" type="geojson" data={iuFeatures}>
                        <Layer
                            id="fill-iu"
                            beforeId="admin-0-boundary"
                            filter={['has', colorProp]}
                            type="fill"
                            paint={{
                                'fill-color': [
                                    'coalesce',
                                    ['get', colorProp],
                                    // grey shapes if no data available
                                    '#F2F1F1',
                                ],
                                'fill-outline-color': [
                                    'case',
                                    ['==', ['get', 'id'], feature?.properties.id || null],
                                    'rgba(145, 145, 145, 1)',
                                    'rgba(145, 145, 145, 0.3)',
                                ],
                            }}
                        />
                        <Layer
                            id="hover-iu"
                            source="africa-iu"
                            type="line"
                            filter={['has', colorProp]}
                            layout={{ 'line-join': 'bevel' }}
                            paint={{
                                'line-color': [
                                    'case',
                                    ['==', ['get', 'id'], featureHover?.properties.id || null],
                                    '#616161',
                                    'rgba(0,0,0,0)',
                                ],
                                'line-width': 1,
                            }}
                        />
                    </Source>
                )}

                {/* Population circles */}
                {populationFeatures && (
                    <Source
                        id="africa-countries-population"
                        type="geojson"
                        data={populationFeatures}
                    >
                        <Layer
                            id="population-countries"
                            type="circle"
                            paint={{
                                'circle-radius': [
                                    'interpolate',
                                    ['linear'],
                                    ['zoom'],
                                    3,
                                    ['/', ['sqrt', ['get', 'population']], 200],
                                    10,
                                    ['/', ['sqrt', ['get', 'population']], 40],
                                ],
                                'circle-color': 'rgba(255,0,0,0)',
                                'circle-stroke-color': 'rgba(0,0,0,1)',
                                'circle-stroke-width': 1,
                            }}
                        />
                    </Source>
                )}


            </ReactMapGL>
        </div>
    )
}

export default forwardRef((props, ref) => (
    <Map {...props} forwardRef={ref}></Map>
))
