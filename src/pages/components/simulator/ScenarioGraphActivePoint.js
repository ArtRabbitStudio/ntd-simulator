import React from 'react';

function ScenarioGraphActivePoint({ active, coord, mode, low=1 , high=10, med=6 }) {
  let highColour = mode === 'f' ? '#D86422' : '#ABB2B8'
  let lowColour = mode === 'f' ? '#ffc914' : '#ffc914'
  let textHigh = mode === 'f' ? '#fff' : '#fff'
  let textLow = mode === 'f' ? '#2c3f4d' : '#2c3f4d'

  return (
    <g
      key={`active-${active}-${mode}`}
      transform={`translate(${coord[0]},${coord[1]-8})`}
    >
      <circle
        fill={
          coord[2] <= low
            ? lowColour
            : coord[2] >= med && coord[2] <= high
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
          coord[2] <= low
            ? textLow
            : coord[2] >= med && coord[2] <= high
              ? textHigh
              : coord[2] > high
                ? textHigh
                : textHigh
        }
      >
        {`${coord[2].toFixed(1)}%`}
      </text>
    </g>
  )
}


export default ScenarioGraphActivePoint;
