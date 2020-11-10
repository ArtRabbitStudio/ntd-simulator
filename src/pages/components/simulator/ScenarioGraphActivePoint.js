import React from 'react';

function ScenarioGraphActivePoint({ active, coord, mode }) {
  const highColour = mode === 'f' ? '#D86422' : '#ABB2B8'
  const lowColour = mode === 'f' ? '#ffc914' : '#ffc914'
  const textHigh = mode === 'f' ? '#fff' : '#fff'
  const textLow = mode === 'f' ? '#2c3f4d' : '#2c3f4d'

  return (
    <g
      key={`active-${active}-${mode}`}
      transform={`translate(${coord[0]},${coord[1]-8})`}
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


export default ScenarioGraphActivePoint;
