import React from 'react'
import useStyles from '../styles'

import { useSimulatorStore } from '../../../../store/simulatorStore'
import { useScenarioStore, ScenarioStoreConstants } from "../../../../store/scenarioStore";

import { FormControl, Slider, FormLabel, Tooltip } from '@material-ui/core'

const SettingTargetCoverage = ({
  inModal,
  label,
  classAdd,
  value,
  onChange,
  scenarioId,
}) => {
  const classes = useStyles()
  const { dispatchSimState } = useSimulatorStore()
  const { scenarioState, dispatchScenarioStateUpdate } = useScenarioStore();

  const isPerIUSetting = value !== null && typeof value !== 'undefined';

  scenarioId = scenarioId ? scenarioId : scenarioState.currentScenarioId;

  /* TODO FIXME */
  const handleChange = (event, newValue) => {
    // this used to be a special occastion. If nothing changes we can use the handleSlerChanges handler instead.
    if ( isPerIUSetting ) {
      dispatchSimState({ type: 'coverage', payload: newValue })
    }
    else {
      dispatchScenarioStateUpdate( {
        type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_SETTING_BY_ID,
        id: scenarioId,
        key: 'coverage',
        value: newValue
      } );
    }
  }

  return (
    <FormControl fullWidth className={`${classes.formControl} ${classAdd}`}>
       <Tooltip
        title="Proportion of the eligible population that will be treated."
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
        value={ isPerIUSetting ? value : scenarioState.scenarioData[ scenarioId ].settings.coverage}
        min={0}
        step={1}
        max={100}
        onChange={onChange ? onChange : handleChange}
        aria-labelledby="slider"
        marks={[
          { value: 0, label: '0' },
          { value: 100, label: '100' },
        ]}
        valueLabelDisplay={inModal ? 'auto' : 'on'}
      />
    </FormControl>
  )
}
export default SettingTargetCoverage
