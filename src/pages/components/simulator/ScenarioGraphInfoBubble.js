import React from 'react';

function ScenarioGraphInfoBubble({  
    coord, 
    color, 
    textColor, 
    legend, 
    legendColor, 
    percentage,
    bubbleText
  }) {


  return (
    <g
      key={`info`}
      transform={`translate(${coord[0]},${coord[1]})`}
    >
      <rect
        fill={color}
        fillOpacity={1}
        x={bubbleText ? -60 : -20}
        y={-10}
        rx={5}
        ry={5}
        width={bubbleText ? 120 : 40}
        height={20}
      />
      {percentage && <text
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
      </text>}
      {bubbleText && <text
        fontSize="12px"
        fontFamily="Roboto"
        pointerEvents="none"
        x={0}
        y={1}
        textAnchor="middle"
        dominantBaseline="central"
        fill={textColor}
      >{bubbleText}</text>}
      {legend && <text
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
      </text>}
    </g>
  )
}


export default ScenarioGraphInfoBubble;
