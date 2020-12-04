import React from 'react';

function ScenarioGraphInfoBubble({  coord, color, textColor, legend, legendColor, percentage }) {


  return (
    <g
      key={`info`}
      transform={`translate(${coord[0]},${coord[1]})`}
    >
      <rect
        fill={color}
        fillOpacity={1}
        x={-20}
        y={-10}
        rx={5}
        ry={5}
        width={40}
        height={20}
      />
      <text
        fontSize="12px"
        fontFamily="Roboto"
        pointerEvents="none"
        x={0}
        y={1}
        textAnchor="middle"
        dominantBaseline="central"
        fill={textColor}
      >
        {`${percentage.toFixed(1)}%`}
      </text>
      <text
        fontSize="12px"
        fontFamily="Roboto"
        pointerEvents="none"
        x={0}
        y={-20}
        textAnchor="middle"
        dominantBaseline="central"
        fill={legendColor}
      >
        {legend}
      </text>
    </g>
  )
}


export default ScenarioGraphInfoBubble;
