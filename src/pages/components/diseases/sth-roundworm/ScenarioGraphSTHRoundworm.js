import React, { useState } from 'react'
import { zip, zipObject, map, flatten, max, forEach } from 'lodash'
import { scaleLinear } from 'd3'
import AutoSizer from 'react-virtualized-auto-sizer'
import ScenarioGraphPath from 'pages/components/simulator/ScenarioGraphPath'
import ScenarioGraphAtivePoint from 'pages/components/simulator/ScenarioGraphActivePoint'
import ScenarioGraphInfoPoints from 'pages/components/simulator/ScenarioGraphInfoPoints'
import ScenarioGraphGrid from 'pages/components/simulator/ScenarioGraphGrid'
import ScenarioGraphInfoLine from 'pages/components/simulator/ScenarioGraphInfoLine'

import {
  Typography,
} from '@material-ui/core'

let fadeOutTimeout = null


function ScenarioGraphSTHRoundworm({
  data,
  width = 600,
  height = 400,
  metrics = ['KK','MHI'],
  showAllResults,
  inputs,
  classes,
  simInProgress,
  simNeedsRerun,
  graphTypeSimple,
  IU,
  IUData
}) {

  const [activeInfo, setActiveInfo] = useState(null)

  const startYear = 15
  const futureYear = 18
  const lPad = 50
  const rPad = 32
  const tPad = 20
  const yPad = 32 + 20
  const svgHeight = height + yPad * 2
  const svgWidth = width
  

  const dataSelection = data.results


  const isStartYear = (element) => element >= startYear;
  const isPrediction = (element) => element >= futureYear;
  const IndexToStartForOutput = (flatten(map(dataSelection[metrics], 'ts')).findIndex(isStartYear))
  const IndexForPrediction = (flatten(map(dataSelection[metrics], 'ts')).findIndex(isPrediction))
  const domainX = [startYear, max(flatten(map(dataSelection[metrics], 'ts'))) ]
  
  let dataToOutput = [];
  forEach(data.results[metrics],(r)=>{
    dataToOutput.push({
      p: r.p.slice(IndexToStartForOutput),
      ts: r.ts.slice(IndexToStartForOutput)
    })
  })


  const domainY = [ 0, max(flatten(map(dataSelection[metrics], 'p'))) ]


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


  const x = scaleLinear().domain(domainX).range([0, width - rPad - lPad])

  const y = scaleLinear().domain(domainY).range([height, 0]).nice()

  const ticksX = x.ticks(15)
  const ticksY = y.ticks()

  const renderResult = (d, main) => {
    if (simInProgress) return

    let { ts, p } = d
    if ( p === undefined ) {
      p = d['median']
    }

    const series = zip(ts, p)
    let seriesObj = map(series, (x) => zipObject(['ts', 'p'], x))
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
        
        
          <g key={`0-l`}>
            <ScenarioGraphPath
              key={`0-l-h`}
              data={historicSeries}
              prop={'p'}
              x={x}
              y={y}
              color={hcolor}
            />
            <ScenarioGraphPath
              key={`0-l-f`}
              data={futureSeries}
              prop={'p'}
              x={x}
              y={y}
              color={color}
            />
          </g>
        

        {main &&
          
            <g key={`0-ps`}>
              <ScenarioGraphInfoPoints
                handleEnter={(id)=>handleEnter(id)}
                handleLeave={()=>handleLeave()}
                key={`0-ps-h`}
                data={historicSeries}
                prop={'p'}
                x={x}
                y={y}
                color={hcolor}
                mode="h"
              />
              <ScenarioGraphInfoPoints
                handleEnter={(id)=>handleEnter(id)}
                handleLeave={()=>handleLeave()}
                key={`0-ps-f`}
                data={futureSeries}
                prop={'p'}
                x={x}
                y={y}
                color={color}
                mode="f"
              />
              {activeInfo &&
                <ScenarioGraphAtivePoint 
                  active={activeInfo} 
                  coord={[x(activeCoords.ts), y(activeCoords.p), activeCoords.p]} 
                  mode={activeMode} 
                  low={1}
                  med={6}
                  high={10}
                />
              }
            </g>
        }

      </>
    )
  }
  const renderRange = (d,dMax,dts, main) => {

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
        <Typography className={classes.scenarioGraphLegendHistoric} style={{ width: x(ticksX[futureYear - startYear]) }} variant="h6" component="h6">
          Historic
        </Typography>
        <Typography className={`${classes.scenarioGraphLegendPrediction}`} variant="h6" component="h6">
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
          {graphTypeSimple && data.results[metrics] &&
            <g key={`results1-stats`}>{renderRange( data.summary[metrics]['min'],  data.summary[metrics]['max'], data.summary[metrics]['ts'], false, x, y)}</g>
          }
          {!graphTypeSimple && data.results &&
            data.results[metrics].map((result, i) => (
              <g key={`results1-${i}`}>{renderResult(result, false, x, y)}</g>
            ))}
          
          {data.summary &&
            [data.summary[metrics]].map((result, i) => (
              <g key={`results-${i}`}>{renderResult(result, true, x, y)}</g>
            ))}
          <ScenarioGraphInfoLine 
            legend={`WHO target`}
            line={[0,width - lPad - rPad,y(2),y(2)]}
            stroke="#03D386"
            strokeDasharray='10 2'
            percentage={2}
            color={'#03D386'}
            textColor={'#252525'}
            legendColor={'#252525'}
            otherActive={activeInfo}
          />
            {simNeedsRerun && <rect x={0} width={svgWidth} height={svgHeight} fill="rgba(233,241,247,.4)" />}
            {simInProgress && <rect x={0} width={svgWidth} height={svgHeight} fill="rgba(220,233,240,.4)" />}
        </g>
      </svg>
    </React.Fragment>
  )
}

export default (props) => (
  <AutoSizer disableHeight>
    {({ width }) => <ScenarioGraphSTHRoundworm {...props} width={width} />}
  </AutoSizer>
)
