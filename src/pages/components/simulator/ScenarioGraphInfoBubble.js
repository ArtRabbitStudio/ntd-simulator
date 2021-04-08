import React from 'react';

function ScenarioGraphInfoBubble({  
    coord, 
    color, 
    textColor, 
    legend, 
    legendColor, 
    percentage,
    bubbleText,
    smallText
  }) {

  let rectWidth = bubbleText ? 120 : 40
  let rectX = bubbleText ? -60 : -20
  const rectY = smallText ? -10 : -15
  if ( !smallText ) {
    rectWidth = bubbleText ? 180 : 60
    rectX = bubbleText ? -90 : -30
  }

  return (
    <g
      key={`info`}
      transform={`translate(${coord[0]},${coord[1]})`}
    >
      <rect
        fill={color}
        fillOpacity={1}
        x={rectX}
        y={rectY}
        rx={5}
        ry={5}
        width={rectWidth}
        height={smallText ? 20 : 30}
      />
      {percentage && <text
        fontSize={smallText ? `12px` : `18px`}
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
        fontSize={smallText ? `12px` : `18px`}
        fontFamily="Roboto"
        pointerEvents="none"
        x={0}
        y={1}
        textAnchor="middle"
        dominantBaseline="central"
        fill={textColor}
      >{bubbleText}</text>}
      {legend && <text
        fontSize={smallText ? `12px` : `18px`}
        fontFamily="Roboto"
        pointerEvents="none"
        x={0}
        y={-30}
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
