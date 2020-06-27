import React, { useState } from 'react'
import { map, flatten, flattenDeep, pick, values,max,filter } from 'lodash'
import { scaleLinear, extent, line } from 'd3'
import AutoSizer from 'react-virtualized-auto-sizer'


let fadeOutTimeout = null;

function Path({ data, x, y, color, start }) {
  console.log(data);
  const coords = data.map((d,index) => [x(start+index), y(d)])
  console.log(coords);
  const l = line()(coords)
  return <path d={l} stroke={color} fill="none" strokeWidth="2" />
}



function PrevalenceMiniGraph({
  data,
  width = 600,
  height = 150

}) {
  if ( data == undefined ) return
  const lPad = 30
  const rPad = 10
  const tPad = 0
  const yPad = 32
  const svgHeight = height + yPad * 2
  const svgWidth = width
  const start = 2010
  const end = 2019
  const domain = max(map(data.prevalence))
  const xScale = scaleLinear()
  .domain([start, end])
  .range([0, width - (rPad + lPad)])

  
  const yScale = scaleLinear()
    .domain([0, domain])
    .range([height-tPad, 0])

  const yTicks = yScale.ticks(4)
  const xTicks = xScale.ticks(12)
  const yearWidth = xScale(start + 1) - xScale(start)
  const halfYearWidth = Math.round(yearWidth / 2)
  const startX = xScale(start)
  const endX = xScale(end)
  const seriesObj = filter(data.prevalence,(value,index)=>{
      return ( index >= start && index <= end )
  })

  
  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    >
      <g transform={`translate(${lPad},${yPad})`}>

      <rect width={width-lPad-rPad} height={height} fill={'#ffffff'} />

        {/* lable start and end years */}
        {xScale.ticks().map(year => {
          
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

        <Path key={`main`} data={seriesObj} x={xScale} y={yScale} color={'#D86422'} start={start} />

      </g>
    </svg>
  )

 
}

export default props => (
  <AutoSizer disableHeight>
    {({ width }) => <PrevalenceMiniGraph {...props} width={width} />}
  </AutoSizer>
)
