import React,{useState,useEffect} from 'react';
import ScenarioGraphInfoBubble from 'pages/components/simulator/ScenarioGraphInfoBubble'

function ScenarioGraphInfoLine({  
    line,
    stroke,
    strokeDasharray,
    color, 
    textColor,
    legend,
    legendColor,
    percentage,
    otherActive
  }) {
  const coord = [line[1],line[2],line[3]]

  const [showInfo,setShowInfo] = useState(false)
  const handleEnter = () => {
    setShowInfo(true)
  }
  const handleLeave = () => {
    setShowInfo(false)
  }
  useEffect(()=>{
    if ( otherActive !== null ) {
      setShowInfo(false)
    }
  },[otherActive])
  return (
    <g
      key={`info-${legend}`}
    >
      {<line
        x1={line[0]}
        x2={line[1]}
        y1={line[2]}
        y2={line[3]}
        stroke={stroke}
        strokeDasharray={strokeDasharray}
      />}
      {showInfo && <ScenarioGraphInfoBubble 
        coord={coord}
        color={color}
        textColor={textColor}
        legendColor={legendColor}
        percentage={percentage}
        legend={legend}
      />
      }<line 
        x1={line[0]}
        x2={line[1]}
        y1={line[2]-3}
        y2={line[3]-3}
        strokeWidth={6}
        stroke={'rgba(0,0,0,0)'}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      />
    </g>
  )
}


export default ScenarioGraphInfoLine;

// TODO add hover target that's two pixels either side of the line
/*

*/