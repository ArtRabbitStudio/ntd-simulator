import React, { useState } from 'react'
import { zip, zipObject, map, flatten, flattenDeep, pick, values, max, forEach,filter } from 'lodash'
import { scaleLinear, extent, line } from 'd3'
import AutoSizer from 'react-virtualized-auto-sizer'
import {
  Typography,
} from '@material-ui/core'

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
  classes,
  simInProgress,
  IU,
  IUData
}) {
  const startYear = 15
  const futureYear = 20
  const lPad = 50
  const rPad = 32
  const tPad = 20
  const yPad = 32 + 20
  const svgHeight = height + yPad * 2
  const svgWidth = width

  const dataSelection = showAllResults ? data.results : [data.results[0]]

  const isStartYear = (element) => element >= startYear;
  const isPrediction = (element) => element >= futureYear;

  const IndexToStartForOutput = (flatten(map(dataSelection, 'ts')).findIndex(isStartYear))
  const IndexForPrediction = (flatten(map(dataSelection, 'ts')).findIndex(isPrediction))
  const domainX = [startYear, max(flatten(map(dataSelection, 'ts'))) + 1]

  let dataToOutput = [];
  forEach(data.results,(r)=>{
    dataToOutput.push({
      Ls: r.Ls.slice(IndexToStartForOutput),
      Ms: r.Ms.slice(IndexToStartForOutput),
      Ws: r.Ws.slice(IndexToStartForOutput),
      nRounds: r.nRounds,
      ts: r.ts.slice(IndexToStartForOutput)
    })
  })

  let domainY = extent(
    flattenDeep(map(dataToOutput, (x) => values(pick(x, metrics))))
  )
  domainY[0] = 0;

  const ShowActivePoint = ({ active, coord, mode }) => {
    const highColour = mode === 'f' ? '#FAEAE1' : '#cccccc'
    const lowColour = mode === 'f' ? '#ffc914' : '#ffc914'
    const textHigh = mode === 'f' ? '#252525' : '#252525'
    const textLow = mode === 'f' ? '#252525' : '#252525'

    return (
      <g
        key={`active-${active}-${mode}`}
        transform={`translate(${coord[0]},${coord[1]})`}
      >
        <circle
          fill={
            coord[2] <= 1
              ? lowColour
              : coord[2] >= 6 && coord[2] <= 10
                ? highColour
                : coord[2] > 10
                  ? highColour
                  : highColour
          }
          fillOpacity={1}
          r={20}
          cx={2}
          cy={-18}
        ></circle>
        <text
          fontSize="12px"
          fontFamily="Roboto"
          pointerEvents="none"
          x={2}
          y={-18}
          textAnchor="middle"
          dominantBaseline="central"
          fill={
            coord[2] <= 1
              ? textLow
              : coord[2] >= 6 && coord[2] <= 10
                ? textHigh
                : coord[2] > 10
                  ? textHigh
                  : textHigh
          }
        >
          {`${coord[2].toFixed(1)}%`}
        </text>
      </g>
    )
  }
  const InfoPoints = ({ data, prop, x, y, color, mode }) => {
    const coords = data.map((d) => [x(d.ts), y(d[prop]), d[prop]])
    let points = null

    points = coords.map((coord, i) => {
      return (
        <g key={`info-${i}-${mode}`} transform={`translate(${coord[0]},${coord[1]})`}>
          <circle
            key={`${i}-${mode}`}
            fill={color}
            fillOpacity={0.8}
            r={3}
            cx={0}
            cy={0}
          ></circle>
        </g>
      )
    })

    let hoverPoints = coords.map((coord, i) => {
      return (
        <g key={`hover-${i}-${mode}`} transform={`translate(${coord[0]},${coord[1]})`}>
          <circle
            key={`${i}-${mode}-h`}
            fill={color}
            fillOpacity={0}
            r={6}
            cx={0}
            cy={0}
            cursor="crosshair"
            onMouseEnter={() => handleEnter(`${i}-${mode}`)}
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




  const x = scaleLinear().domain(domainX).range([0, width - rPad])

  const y = scaleLinear().domain(domainY).range([height, 0]).nice()

  const ticksX = x.ticks(22)
  const ticksY = y.ticks()

  const renderResult = (d, main) => {
    if (simInProgress) return
    const { ts, Ms, Ws, Ls } = d
    const series = zip(ts, Ms, Ws, Ls)
    let seriesObj = map(series, (x) => zipObject(['ts', 'Ms', 'Ws', 'Ls'], x))
    //seriesObj.splice(0,IndexToStartForOutput)
    // historic path
    const historicSeries = seriesObj.slice(IndexToStartForOutput, IndexForPrediction + 1)
    const futureSeries = seriesObj.slice(IndexForPrediction)
    let historicReferenceUpper = null
    let historicReferencUpperLine = null
    let historicReferenceLower = null
    let historicReferencLowerLine = null
    let historicReferncePrevalence = null
    let historicReferncePrevalenceLine = null
    if ( IUData[0] ) {
      historicReferncePrevalence = filter(map(IUData[0].prevalence,(value,i)=>{
        if ( i >= (2000 + startYear) && i <= (2000 + futureYear) ) {
          return [x((i-2000)), y(value)]
          //return {ts:(i-2000),Upper:}
        } 
        return null
      }),value => value != null)
      historicReferncePrevalenceLine = line()(historicReferncePrevalence)
      historicReferenceUpper = filter(map(IUData[0].upper,(value,i)=>{
        if ( i >= (2000 + startYear) && i <= (2000 + futureYear) ) {
          return [x((i-2000)), y(value*100)]
          //return {ts:(i-2000),Upper:}
        } 
        return null
      }),value => value != null)
      historicReferencUpperLine = line()(historicReferenceUpper)
      historicReferenceLower = filter(map(IUData[0].lower,(value,i)=>{
        if ( i >= (2000 + startYear) && i <= (2000 + futureYear) ) {
          return [x((i-2000)), y(value*100)]
          //return {ts:(i-2000),Upper:}
        } 
        return null
      }),value => value != null)
      historicReferencLowerLine = line()(historicReferenceLower)
      
    }
    
    // future path

    const color = main ? '#D86422' : '#eeee'
    const hcolor = main ? '#CCCCCC' : '#eeee'

    let activeCoords = []
    let activeMode = 'h'
    if (activeInfo != null) {
      const activeInfoParts = activeInfo.split('-');
      activeCoords = historicSeries[activeInfoParts[0]]//.map((d) => [x(d.ts), y(d[prop]), d[prop]]);
      if (activeInfoParts[1] === 'f') {
        activeMode = 'f'
        activeCoords = futureSeries[activeInfoParts[0]]//.map((d) => [x(d.ts), y(d[prop]), d[prop]]);
      }

    }



    return (
      <>
        {historicReferencUpperLine && <path d={historicReferencUpperLine} stroke="#64BADE" fill="none" strokeWidth="1" />}
        {historicReferencLowerLine && <path d={historicReferencLowerLine} stroke="#64BADE" fill="none" strokeWidth="1" />}
        {historicReferncePrevalenceLine && <path d={historicReferncePrevalenceLine} stroke="#1998CE" fill="none" strokeWidth="1" />}
        {metrics.map((m, i) => (
          <g key={`${i}-l`}>
            <Path
              key={`${i}-l-h`}
              data={historicSeries}
              prop={m}
              x={x}
              y={y}
              color={hcolor}
            />
            <Path
              key={`${i}-l-f`}
              data={futureSeries}
              prop={m}
              x={x}
              y={y}
              color={color}
            />
          </g>
        ))}

        {main &&
          metrics.map((m, i) => (
            <g key={`${i}-ps`}>
              <InfoPoints
                key={`${i}-ps-h`}
                data={historicSeries}
                prop={m}
                x={x}
                y={y}
                color={hcolor}
                mode="h"
              />
              <InfoPoints
                key={`${i}-ps-f`}
                data={futureSeries}
                prop={m}
                x={x}
                y={y}
                color={color}
                mode="f"
              />
              {activeInfo &&
                <ShowActivePoint active={activeInfo} coord={[x(activeCoords.ts), y(activeCoords[m]), activeCoords[m]]} mode={activeMode} />
              }
            </g>
          ))}

      </>
    )
  }

  return (
    <React.Fragment>
      <div className={classes.scenarioGraphLegend}>
        <Typography className={classes.scenarioGraphLegendHistoric} style={{ width: x(ticksX[futureYear - 15]) }} variant="h6" component="h6">
          Historic
        </Typography>
        <Typography className={classes.scenarioGraphLegendPrediction} variant="h6" component="h6">
          Prediction
        </Typography>
      </div>
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      >
        <g transform={`translate(${lPad},${yPad})`}>
          <rect x={x(ticksX[0])} width={x(ticksX[futureYear - 15])} height={svgHeight - yPad - 32 - tPad} fill="#f9f9f9" />
          {ticksX.map((t, i) => {
            const xt = x(t)
            const yearLabel = 2000 + t
            const yearOutput = '‘' + yearLabel.toString().substr(-2)
            return (
              <g key={xt}>
                <line
                  key={t}
                  x1={xt}
                  x2={xt}
                  y1={-5}
                  y2={height}
                  {...(i === 0 || i === ticksX.length - 1
                    ? {}
                    : { strokeDasharray: '10 2' })}
                  {...(15 + i === futureYear ? { strokeWidth: "2" } : {})}
                  {...(15 + i === futureYear ? { stroke: "#ccc" } : { stroke: "#ccc" })}
                ></line>
                <text x={xt} y={height + yPad - 20} fontSize={12} textAnchor="middle">
                  {yearLabel}
                </text>
                {(i < ticksX.length - 1) && <line
                  key={`${t}-year`}
                  x1={xt}
                  x2={x(t + 1) - 3}
                  y1={height + yPad}
                  y2={height + yPad}
                  stroke="#CCE8F4"
                  strokeWidth="10"
                ></line>}
              </g>
            )
          })}
          {ticksY.map((t, i) => {
            const yt = y(t)
            let yearBar = null
            return (
              <g key={yt}>
                <line
                  key={t}
                  x1={0}
                  x2={width - lPad - rPad}
                  y1={yt}
                  y2={yt}
                  stroke="#ccc"
                  {...(i === 0 || i === ticksY.length - 1
                    ? {}
                    : { strokeDasharray: '10 2' })}
                ></line>
                <text x={-rPad} y={yt + 4} fontSize={12} textAnchor="middle">
                  {`${t}%`}
                </text>
                {yearBar}
              </g>
            )
          })}
          <line
            key={`WHO target`}
            x1={0}
            x2={width - lPad - rPad}
            y1={y(1)}
            y2={y(1)}
            stroke="#ffc914"
            strokeDasharray='10 2'
          ></line>
          {data.results &&
            data.results.map((result, i) => (
              <g key={`results1-${i}`}>{renderResult(result, false, x, y)}</g>
            ))}
          {data.stats &&
            [data.stats].map((result, i) => (
              <g key={`results-${i}`}>{renderResult(result, true, x, y)}</g>
            ))}
            
        </g>
      </svg>
    </React.Fragment>
  )
}

export default (props) => (
  <AutoSizer disableHeight>
    {({ width }) => <ScenarioGraph {...props} width={width} />}
  </AutoSizer>
)
