import React, {Fragment} from 'react';

function ScenarioGraphGrid({ ticksX,ticksY, x, y, zeroYear, startYear, futureYear, height, tPad, yPad, lPad, rPad, width, svgHeight }) {

  return (
    <Fragment>
        <rect x={x(ticksX[0])} width={x(ticksX[futureYear - startYear])} height={svgHeight - yPad - 32 - tPad} fill="#f9f9f9" />
        {ticksX.map((t, i) => {
            const xt = x(t)
            const yearLabel = zeroYear + t
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
                  {...(15 + i === futureYear ? { stroke: "#ddd" } : { stroke: "#ddd" })}
                ></line>
                <text x={xt} y={height + yPad - 20} fontSize={12} textAnchor="middle" fill="#2c3f4d">
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
                <text x={-rPad} y={yt + 4} fontSize={12} fill="#2c3f4d" textAnchor="middle">
                  {`${t}%`}
                </text>
                {yearBar}
              </g>
            )
          })}
    </Fragment>
  )
}


export default ScenarioGraphGrid;
