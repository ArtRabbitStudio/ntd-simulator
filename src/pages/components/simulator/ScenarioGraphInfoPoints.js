import React from 'react';

function ScenarioGraphInfoPoints({ data, prop, x, y, color, mode, handleEnter,handleLeave }) {
  
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


export default ScenarioGraphInfoPoints;
