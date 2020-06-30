import React, { useState } from 'react'
import { zip, zipObject, map, flatten, flattenDeep, pick, values,max,forEach } from 'lodash'
import { scaleLinear, extent, line } from 'd3'
import AutoSizer from 'react-virtualized-auto-sizer'

let fadeOutTimeout = null

function Path({ data, prop, x, y, color }) {
  const coords = data.map((d) => [x(d.ts), y(d[prop])])
  const l = line()(coords)

  return <path d={l} stroke={color} fill="none" strokeWidth="2" />
}

function ScenarioGraph({
  data,
  width = 600,
  height = 400,
  metrics = ['Ms', 'Ws', 'Ls'],
  showAllResults,
  inputs,
  simInProgress,
}) {
  //console.log('init',data);
  const startYear = 15
  const dataSelection = showAllResults ? data.results : [data.results[0]]

  const isStartYear = (element) => element >= startYear;

  const IndexToStartForOutput = (flatten(map(dataSelection, 'ts')).findIndex(isStartYear))
  const domainX = [ startYear, max(flatten(map(dataSelection, 'ts')))+1 ]

  const domainY = extent(
    flattenDeep(map( data.results , (x) => values(pick(x, metrics))))
  )
  const ShowActivePoint = ({ active, coord }) => {
    return (
      <g
        key={`active-${active}`}
        transform={`translate(${coord[0]},${coord[1]})`}
      >
        <circle
          fill={
            coord[2] <= 1
              ? '#008DC9'
              : coord[2] >= 6 && coord[2] <= 10
              ? '#D86422'
              : coord[2] > 10
              ? '#D86422'
              : '#D86422'
          }
          fillOpacity={1}
          r={20}
          cx={2}
          cy={-18}
        ></circle>
        <text
          fill="white"
          fontSize="12px"
          fontFamily="Roboto"
          pointerEvents="none"
          x={2}
          y={-18}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {`${coord[2].toFixed(1)}%`}
        </text>
      </g>
    )
  }
  const InfoPoints = ({ data, prop, x, y, color }) => {
    const coords = data.map((d) => [x(d.ts), y(d[prop]), d[prop]])
    //console.log(coords);
    let points = null

    points = coords.map((coord, i) => {
      return (
        <g key={`info-${i}`} transform={`translate(${coord[0]},${coord[1]})`}>
          <circle
            key={`${i}`}
            fill={'#D86422'}
            fillOpacity={0.8}
            r={3}
            cx={0}
            cy={0}
          ></circle>
        </g>
      )
    })
    if (activeInfo != null) {
      points.push(
        <ShowActivePoint active={activeInfo} coord={coords[activeInfo]} />
      )
    }
    let hoverPoints = coords.map((coord, i) => {
      return (
        <g key={`hover-${i}`} transform={`translate(${coord[0]},${coord[1]})`}>
          <circle
            key={`${i}-h`}
            fill={'#D86422'}
            fillOpacity={0}
            r={6}
            cx={0}
            cy={0}
            cursor="crosshair"
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={handleLeave}
          ></circle>
        </g>
      )
    })
    const allPoints = points.concat(hoverPoints)

    return allPoints
  }

  const [activeInfo, setActiveInfo] = useState(null)

  const handleEnter = (id) => {
    if (fadeOutTimeout != null) {
      clearTimeout(fadeOutTimeout)
    }
    setActiveInfo(id)
  }
  const handleLeave = () => {
    fadeOutTimeout = setTimeout(() => {
      setActiveInfo(null)
    }, 50)
  }

  const lPad = 50
  const rPad = 32
  const tPad = 20
  const yPad = 32
  const svgHeight = height + yPad * 2
  const svgWidth = width


  const x = scaleLinear().domain(domainX).range([0, width-rPad])

  const y = scaleLinear().domain(domainY).range([height, 0]).nice()

  const ticksX = x.ticks(22)
  const ticksY = y.ticks()

  const renderResult = (d, main) => {
    if (simInProgress) return
    const { ts, Ms, Ws, Ls } = d
    const series = zip(ts, Ms, Ws, Ls)
    let seriesObj = map(series, (x) => zipObject(['ts', 'Ms', 'Ws', 'Ls'], x))
    seriesObj.splice(0,IndexToStartForOutput)

    const color = main ? '#D86422' : '#eeee'
    return (
      <>
        {metrics.map((m,i) => (
          <Path
            key={`${i}-l`}
            data={seriesObj}
            prop={m}
            x={x}
            y={y}
            color={color}
          />
        ))}

        {main &&
          metrics.map((m,i) => (
            <InfoPoints
              key={`${i}-ps`}
              data={seriesObj}
              prop={m}
              x={x}
              y={y}
              color={color}
            />
          ))}
      </>
    )
  }

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    >
      <g transform={`translate(${lPad},${yPad})`}>
        {ticksX.map((t, i) => {
          const xt = x(t)
          const yearLabel = 2000 + t
          const yearOutput = '‘' + yearLabel.toString().substr(-2)
          //console.log(yearLabel)

          return (
            <g key={xt}>
              <line
                key={t}
                x1={xt}
                x2={xt}
                y1={-5}
                y2={height}
                stroke="#D8D8D8"
                {...(i === 0 || i === ticksX.length - 1
                  ? {}
                  : { strokeDasharray: '4 3' })}
              ></line>
              <text x={xt} y={height + yPad} fontSize={12} textAnchor="middle">
                {yearLabel}
              </text>
            </g>
          )
        })}
        {ticksY.map((t, i) => {
          const yt = y(t)
          return (
            <g key={yt}>
              <line
                key={t}
                x1={0}
                x2={width - lPad}
                y1={yt}
                y2={yt}
                stroke="#D8D8D8"
                {...(i === 0 || i === ticksY.length - 1
                  ? {}
                  : { strokeDasharray: '4 3' })}
              ></line>
              <text x={-rPad} y={yt + 4} fontSize={12} textAnchor="middle">
                {`${t}%`}
              </text>
            </g>
          )
        })}
        {data.results &&
          data.results.map((result, i) => (
              <g key={`results1-${i}`}>{renderResult(result, false)}</g>
          ))}
        {data.stats &&
          [data.stats].map((result, i) => (
            <g key={`results-${i}`}>{renderResult(result, true)}</g>
          ))}
      </g>
    </svg>
  )
}

export default (props) => (
  <AutoSizer disableHeight>
    {({ width }) => <ScenarioGraph {...props} width={width} />}
  </AutoSizer>
)
