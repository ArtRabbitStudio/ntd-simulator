import React from 'react'
import { Tooltip as MuiTooltip } from '@material-ui/core'
import { NO_DATA } from 'AppConstants'

export default function Tooltip({ feature, year, position, hideTrend }) {
  console.log('hideTrend', hideTrend)
  const { endemicity, name, performance, [`prev-${year}`]: prevalence } = feature.properties
  const [x, y] = position

  let trend = performance <= 0 ? ' | Trend: ⬇' + -1 * performance + '% ' : ' | Trend: ⬆' + performance + '%'
  if (performance === 0) {
    trend = '';
  }

  let title =
    prevalence !== 'null'
      ? `${name}: ${prevalence}% ${trend}`
      : `${name} ${NO_DATA}`

  if (endemicity === 'Non-endemic') {
    title = `${name} ${prevalence}% [${endemicity}]`
    if (hideTrend) {
      title = `${name}`
    }
  }

  if (feature.source === 'africa-countries' && prevalence === 'null') {
    title = name
  }

  return (
    <MuiTooltip
      title={title}
      open
      id="map-tooltip"
      placement="top">
      <span
        style={{
          position: 'absoulte',
          display: 'inline-block',
          transform: `translate(${x}px,${y - 16}px)`,
        }}
      ></span>
    </MuiTooltip>
  )
}
