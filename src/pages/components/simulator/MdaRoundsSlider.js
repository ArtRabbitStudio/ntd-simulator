
import React, { useState,useEffect } from 'react'
import { Slider } from '@material-ui/core'

const MdaRoundsSlider = (props) => {
//[future.time[future.active.indexOf(true)],future.time[future.active.lastIndexOf(true)]]
const startValue =  props.intialMonthValues[0] ? ( ( props.intialMonthValues[0] - 246 ) / 6 ) + 1  : 1
const endValue =  props.intialMonthValues[1] ? ( ( props.intialMonthValues[1] - 246 ) / 6 ) + 1 : props.numberOfFutreTimeBars
const [value, setValue] = useState([startValue,endValue]);
const handleChange = (event, newValue) => {
    //console.log('newValue',newValue)
    setValue(newValue);

    // 240 is 2019 last month
    // we're going in steps of 6 month
    const start = 246 + (newValue[0]-1) * 6
    const end = 246 + (newValue[1]-1) * 6

    props.onChange(start,end)

}
const valueLabelFormat = (value) => {
    const startYear = 2019
    const selectedYear = startYear + (value/2) - 2000 
    return value === 1 ? `'20` : `'${Math.floor(selectedYear)}`
}

useEffect(() => {
    const newStartValue =  ( ( props.intialMonthValues[0] - 246 ) / 6 ) + 1 
    const newEndValue =  ( ( props.intialMonthValues[1] - 246 ) / 6 ) + 1
    setValue([newStartValue,newEndValue])
}, [props.intialMonthValues])

return (
    <div className={`future-slider ${props.disease}`} style={{position:'relative',zIndex:99}}>
          <div style={{
            top: '5px',
            left: `calc( ${props.areaOffset}px + ${props.barWidth/2}% + ${((props.numberOfHistoryBars*props.barWidth)-props.barWidth*2)}%)`,
            width: `calc( ${props.numberOfFutreTimeBars*props.barWidth}% - ${props.barWidth}% )`,
            position: 'absolute'
          }}
            >
            <Slider 
                value={value} 
                onChange={handleChange}
                valueLabelDisplay="auto"
                min={1}
                stepo={1}
                max={props.numberOfFutreTimeBars}
                getAriaValueText={valueLabelFormat}
                valueLabelFormat={valueLabelFormat}
                valueLabelDisplay="auto"
                aria-labelledby="interventions-label"
            />
          </div> 
        </div>
)

}

export default MdaRoundsSlider