import React, { useEffect, forwardRef, useImperativeHandle } from 'react'
import ReactMapGL, { Source, Layer, Popup, HTMLOverlay } from 'react-map-gl'
import { useHistory, useRouteMatch, Link as RouterLink } from 'react-router-dom'
import centroid from '@turf/centroid'
import { Typography, Slider, Box, Link, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { format } from 'd3'
import Tooltip from './Tooltip'
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

      if (focus) {
        // new zooming
        const center = centroid({ type: 'FeatureCollection', features: [focus] });
        const latLong = center.geometry.coordinates
        dispatch({ type: 'FOCUSANIMATED', payload: { focus, latLong } })

        //dispatch({ type: 'FOCUS', payload: focus })
      }
    }
  }, [countryFeatures, country, dispatch, ready])



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
        history.push(`/setup/${country}/${feature.properties.IU_ID}`)
        //console.log('iu click',feature.properties.IU_ID)
      }
    }

    //if (feature) {
    //    dispatch({ type: 'SELECT', payload: { feature, event } })
    //}

    //TODO: select IU and go there
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
        dragPan={false}
        boxZoom={false}
        dragRotate={false}
        touchZoomRotate={false}
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
                'fill-color': 'rgba(0,0,0,.2)',


              }}
            />
            <Layer
              id="hover-countries"
              type="line"
              filter={['has', colorProp]}
              layout={{ 'line-join': 'bevel' }}
              paint={{
                'line-color': 'rgba(145, 145, 145, 1)',
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

        {/* Tooltip */}
        {featureHover && !feature && (
          <Tooltip feature={featureHover} year={year} position={tooltip} />
        )}


      </ReactMapGL>
    </div>
  )
}

export default forwardRef((props, ref) => (
  <Map {...props} forwardRef={ref}></Map>
))
