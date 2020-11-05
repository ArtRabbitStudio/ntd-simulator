import React from 'react'
import useStyles from 'pages/components/simulator/styles'

import { useSimulatorStore } from 'store/simulatorStore'
import { useScenarioStore, ScenarioStoreConstants } from "store/scenarioStore";

import { FormControl, Slider, FormLabel, Tooltip } from '@material-ui/core'

const SettingTargetCoverage = ({
  inModal,
  label,
  classAdd,
  value,
  onChange,
  scenarioId,
  min,
  max,
  step,
  title,
  valueKey
}) => {
  const classes = useStyles()
  const { dispatchSimState } = useSimulatorStore()
  const { scenarioState, dispatchScenarioStateUpdate } = useScenarioStore();

  const minVal = min ? min : 0
  const maxVal = max ? max : 100
  const stepVal = step ? step : 1
  const isPerIUSetting = value !== null && typeof value !== 'undefined';

  // make title and key a parameter to pass in so we can utilise this slider instead of making new ones
  const titleVal = title ? title : "Proportion of the eligible population that will be treated."
  const keyVal = valueKey ? valueKey : 'coverage'

  scenarioId = scenarioId ? scenarioId : scenarioState.currentScenarioId;

  /* TODO FIXME */
  const handleChange = (event, newValue) => {
    // this used to be a special occastion. If nothing changes we can use the handleSlerChanges handler instead.
    if ( isPerIUSetting ) {
      dispatchSimState({ type: keyVal, payload: newValue })
    }
    else {
      dispatchScenarioStateUpdate( {
        type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_SETTING_BY_ID,
        id: scenarioId,
        key: keyVal,
        value: newValue
      } );
    }
  }

  return (
    <FormControl fullWidth className={`${classes.formControl} ${classAdd}`}>
       <Tooltip
        title={titleVal}
        aria-label="info"
      >
      <FormLabel
        component="legend"
        htmlFor="coverage"
        className={
          inModal
            ? classes.withHelp
            : `${classes.withSlider} ${classes.centered} ${classes.withHelp}`
        }
      >
        {label}
      </FormLabel>
      </Tooltip>
      <Slider
        value={ isPerIUSetting ? value : scenarioState.scenarioData[ scenarioId ].settings[ keyVal ]}
        min={minVal}
        step={stepVal}
        max={maxVal}
        onChange={onChange ? onChange : handleChange}
        aria-labelledby="slider"
        marks={[
          { value: minVal, label: `${minVal}` },
          { value: maxVal, label: `${maxVal}` },
        ]}
        valueLabelDisplay={inModal ? 'auto' : 'on'}
      />
    </FormControl>
  )
}
export default SettingTargetCoverage
