import React, { useState } from 'react'
import { zip, zipObject, map, flatten, flattenDeep, pick, values, max, forEach } from 'lodash'
import { scaleLinear, extent } from 'd3'
import AutoSizer from 'react-virtualized-auto-sizer'
import ScenarioGraphPath from 'pages/components/simulator/ScenarioGraphPath'
import ScenarioGraphActivePoint from 'pages/components/simulator/ScenarioGraphActivePoint'
import ScenarioGraphInfoPoints from 'pages/components/simulator/ScenarioGraphInfoPoints'
import ScenarioGraphGrid from 'pages/components/simulator/ScenarioGraphGrid'

import {
  Typography,
} from '@material-ui/core'

let fadeOutTimeout = null



function ScenarioGraphLF({
  data,
  width = 600,
  height = 400,
  metrics = ['Ms', 'Ws', 'Ls'],
  showAllResults,
  inputs,
  classes,
  simInProgress,
  simNeedsRerun,
  graphTypeSimple,
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
    /*let historicReferenceUpper = null
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
      
    }*/
    
    // future path

    const color = main ? '#D86422' : '#eee'
    const hcolor = main ? '#ABB2B8' : '#eee'

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

    /*  for debugging
        {historicReferencUpperLine && <path d={historicReferencUpperLine} stroke="#64BADE" fill="none" strokeWidth="1" />}
        {historicReferencLowerLine && <path d={historicReferencLowerLine} stroke="#64BADE" fill="none" strokeWidth="1" />}
        {historicReferncePrevalenceLine && <path d={historicReferncePrevalenceLine} stroke="#1998CE" fill="none" strokeWidth="1" />}
    */


    return (
      <>
        
        {metrics.map((m, i) => (
          <g key={`${i}-l`}>
            <ScenarioGraphPath
              key={`${i}-l-h`}
              data={historicSeries}
              prop={m}
              x={x}
              y={y}
              color={hcolor}
            />
            <ScenarioGraphPath
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
              <ScenarioGraphInfoPoints
                handleEnter={(id)=>handleEnter(id)}
                handleLeave={()=>handleLeave()}
                key={`${i}-ps-h`}
                data={historicSeries}
                prop={m}
                x={x}
                y={y}
                color={hcolor}
                mode="h"
              />
              <ScenarioGraphInfoPoints
                handleEnter={(id)=>handleEnter(id)}
                handleLeave={()=>handleLeave()}
                key={`${i}-ps-f`}
                data={futureSeries}
                prop={m}
                x={x}
                y={y}
                color={color}
                mode="f"
              />
              {activeInfo &&
                <ScenarioGraphActivePoint  active={activeInfo} coord={[x(activeCoords.ts), y(activeCoords[m]), activeCoords[m]]} mode={activeMode} />
              }
            </g>
          ))}

      </>
    )
  }
  const renderRange = (d,dMax,dts, main) => {
    //console.log('renderRange',d)

    if (simInProgress) return


    //seriesObj.splice(0,IndexToStartForOutput)
    // historic path
    const tsSeries = dts.slice(IndexToStartForOutput)
    const ftsSeries = dts.slice(IndexForPrediction)
    const historicSeries = d.slice(IndexToStartForOutput, IndexForPrediction + 1)
    const futureSeries = d.slice(IndexForPrediction)
    const historicSeriesMax = dMax.slice(IndexToStartForOutput, IndexForPrediction + 1)
    const futureSeriesMax = dMax.slice(IndexForPrediction)

    const points = historicSeriesMax.map((value,index)=>{
      return `${x(tsSeries[index])},${y(value)} `
    })
    let pointsMax = historicSeries.map((value,index)=>{
      return `${x(tsSeries[index])},${y(value)} `
    })
    pointsMax.reverse()
    const bgColor = '#959FA6'
    const fpoints = futureSeriesMax.map((value,index)=>{
      return `${x(ftsSeries[index])},${y(value)} `
    })
    let fpointsMax = futureSeries.map((value,index)=>{
      return `${x(ftsSeries[index])},${y(value)} `
    })
    fpointsMax.reverse()

    return (

      <>
          <polygon points={points+' '+pointsMax} fill={bgColor} opacity={.1} />
          <polygon points={fpoints+' '+fpointsMax} fill={bgColor} opacity={.15} />
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
          <ScenarioGraphGrid ticksX={ticksX} ticksY={ticksY} x={x} y={y} zeroYear={2000} startYear={startYear} futureYear={futureYear} svgHeight={svgHeight} height={height} tPad={tPad} yPad={yPad} lPad={lPad} rPad={rPad} width={width} />
          {graphTypeSimple && data.results &&
            <g key={`results1-stats`}>{renderRange( data.stats[metrics+'Min'],  data.stats[metrics+'Max'], data.stats['ts'], false, x, y)}</g>
          }
          <line
            key={`WHO target`}
            x1={0}
            x2={width - lPad - rPad}
            y1={y(1)}
            y2={y(1)}
            stroke="#03D386"
            strokeDasharray='10 2'
          ></line>
          {!graphTypeSimple && data.results &&
            data.results.map((result, i) => (
              <g key={`results1-${i}`}>{renderResult(result, false, x, y)}</g>
            ))}
          
          {data.stats &&
            [data.stats].map((result, i) => (
              <g key={`results-${i}`}>{renderResult(result, true, x, y)}</g>
            ))}
            {simNeedsRerun && <rect x={0} width={svgWidth} height={svgHeight} fill="rgba(233,241,247,.4)" />}
            {simInProgress && <rect x={0} width={svgWidth} height={svgHeight} fill="rgba(220,233,240,.4)" />}
        </g>
      </svg>
    </React.Fragment>
  )
}

export default (props) => (
  <AutoSizer disableHeight>
    {({ width }) => <ScenarioGraphLF {...props} width={width} />}
  </AutoSizer>
)
