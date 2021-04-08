import React, { useState } from 'react'
import { map, max, filter } from 'lodash'
import { scaleLinear, line } from 'd3'
import AutoSizer from 'react-virtualized-auto-sizer'
import { DISEASE_CONFIG } from 'AppConstants';
import ScenarioGraphInfoBubble from 'pages/components/simulator/ScenarioGraphInfoBubble'
import { useTranslation } from "react-i18next";

function Path({ data, x, y, color, start }) {
  const coords = data.map((d,index) => [x(start+index), y(d)])
  const l = line()(coords)
  return <path d={l} stroke={color} fill="none" strokeWidth="2" />
}

function PrevalenceMiniGraph({
  data,
  width = 600,
  height = 150,
  disease = 'lf'
}) {
  const { t } = useTranslation();

  const [uncertaintyInfo, setUncertaintyInfo] = useState(false)
  const handleUncertaintyHover = () => {
    setUncertaintyInfo(true)
  }
  const handleUncertaintyLeave = () => {
    setUncertaintyInfo(false)
  }
  if ( data === undefined ) return null

  const lPad = 30
  const rPad = 10
  const tPad = 0
  const yPad = 32
  const svgHeight = height + yPad * 2
  const svgWidth = width
  let start = DISEASE_CONFIG[ disease ] ? DISEASE_CONFIG[ disease ].historicStartYear : 2010
  let end = DISEASE_CONFIG[ disease ] ? DISEASE_CONFIG[ disease ].historicEndYear :2019
  
  const cleanedPrevalence = map(data.prevalence,(x)=>{
    x = x === null ? 0 : x
    return x
  })
  let domainRange = cleanedPrevalence
  let cleanedLower = null
  let cleanedUpper = null
  let upperPoints = null
  let lowerPoints = null
  if ( data.lower ) {
    cleanedUpper = map(data.upper,(x)=>{
      x = x === null ? 0 : x*100
      return x
    })
    cleanedLower = map(data.lower,(x)=>{
      x = x === null ? 0 : x*100
      return x
    })
    domainRange = domainRange.concat(cleanedUpper).concat(cleanedLower)
  }



  const domain = max(map(domainRange))*1.05
  const xScale = scaleLinear()
  .domain([start, end])
  .range([0, width - (rPad + lPad)])
  
  const yScale = scaleLinear()
    .domain([0, domain])
    .range([height-tPad, 0])

  const xTicks = xScale.ticks(end-start)
  const yTicks = yScale.ticks(4)
  const yearWidth = xScale(start + 1) - xScale(start)
  const seriesObj = filter(cleanedPrevalence,(value,index)=>{
      return ( (2000 + index) >= start && (2000+index) <= end )
  })

  if ( data.lower && cleanedUpper && cleanedLower ) {
    const seriesObjUpper = filter(cleanedUpper,(value,index)=>{
      return ( (2000 + index) >= start && (2000+index) <= end )
    })
    upperPoints = seriesObjUpper.map((value,index)=>{
      return `${xScale(start+index)},${yScale(value)} `
    })
    const seriesObjLower = filter(cleanedLower,(value,index)=>{
      return ( (2000 + index) >= start && (2000+index) <= end )
    })


    lowerPoints = seriesObjLower.map((value,index)=>{
      return `${xScale(start+index)},${yScale(value)} `
    })
    lowerPoints.reverse()
  }
  const bgColor = '#959FA6'

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    >
      <g transform={`translate(${lPad},${yPad})`}>

      <rect width={width-lPad-rPad} height={height} fill={'#ffffff'} />

        {/* lable start and end years */}
        {xTicks.map(year => {
            const yearOutput = '‘' + year.toString().substr(-2)
            return (
              <g key={year}>
                <text
                  x={xScale(year)}
                  y={height + 25}
                  textAnchor="middle"
                  fontSize="12"
                >
                  {yearOutput}
                </text>
              </g>
            )
        })}

        {xScale.ticks().map(year => {
          if (year === start) {
            return (
              <line
                key={year}
                x1={xScale(year)}
                x2={xScale(year)}
                y1={-5}
                y2={height}
                stroke="#D8D8D8"
              ></line>
            )
          } else if (year === end) {
            return (
              <line
                key={year}
                x1={xScale(year)}
                x2={xScale(year)}
                y1={-5}
                y2={height}
                stroke="#D8D8D8"
              ></line>
            )
          }
          return (
            <line
              key={year}
              x1={xScale(year)}
              x2={xScale(year)}
              y1={-5}
              y2={height}
              stroke="#D8D8D8"
              strokeDasharray="4 3"
            ></line>
          )
        })}

        {/* y-axis labels */}
        {yTicks.map(t => {
          const y = yScale(t)
          return (
            <g key={t}>
              <text
                x={-lPad}
                y={y}
                textAnchor="central"
                dominantBaseline="central"
                fontSize="12"
              >
                {t}%
              </text>
              <line
                x1={0}
                x2={(end - start) * yearWidth}
                y1={y}
                y2={y}
                stroke="#cfcfcf"
                strokeDasharray="4 3"
              ></line>
            </g>
          )
        })}
        {data.lower && <polygon points={upperPoints + ' ' + lowerPoints} fill={bgColor} opacity={.15} onMouseEnter={handleUncertaintyHover} onMouseLeave={handleUncertaintyLeave} />}
        <Path key={`main`} data={seriesObj} x={xScale} y={yScale} color={'#D86422'} start={start} />
        {(uncertaintyInfo) &&
            <ScenarioGraphInfoBubble
              coord={[ ((width-lPad-rPad) / 2), 20 ]}
              color={'#E1E4E6'}
              textColor={'#252525'}
              smallText={true}
              legendColor={'#E1E4E6'}
              bubbleText={t('ModelUncertainty')}
            />}
      </g>
    </svg>
  )

 
}

export default props => (
  <AutoSizer disableHeight>
    {({ width }) => <PrevalenceMiniGraph {...props} width={width} />}
  </AutoSizer>
)
