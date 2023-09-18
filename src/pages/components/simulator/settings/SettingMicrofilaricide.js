import React from 'react'
import useStyles from 'pages/components/simulator/styles'

import { useSimulatorStore } from 'store/simulatorStore'
import { useScenarioStore, ScenarioStoreConstants } from "store/scenarioStore";

import { FormControl, Slider, FormLabel, Tooltip } from '@material-ui/core'
import { useTranslation } from 'react-i18next';

const SettingMicrofilaricide = ({
  inModal,
  label,
  classAdd,
  value,
  onChange,
  scenarioId,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { dispatchSimState } = useSimulatorStore();
  const { scenarioState, dispatchScenarioStateUpdate } = useScenarioStore();

  const isPerIUSetting = value !== null && typeof value !== 'undefined';

  scenarioId = scenarioId ? scenarioId : scenarioState.currentScenarioId;

  /* TODO FIXME */
  const handleChange = (event, newValue) => {
    if ( isPerIUSetting ) {
      // this used to be a special occastion. If nothing changes we can use the handleSlerChanges handler instead.
      dispatchSimState({ type: 'microfilaricide', payload: newValue })
    }
    else {
      dispatchScenarioStateUpdate( {
        type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_SETTING_BY_ID,
        id: scenarioId,
        key: 'microfilaricide',
        value: newValue
      } );
    }
  }

  return (
    <FormControl fullWidth className={`${classes.formControl} ${classAdd}`}>
  
        <FormLabel
          component="legend"
          htmlFor="microfilaricide"
          className={
            inModal
              ? ``
              : `${classes.withSlider} ${classes.centered}`
          }
        >
          {label}
        </FormLabel>
      <Slider
        value={ isPerIUSetting ? value : scenarioState.scenarioData[ scenarioId ].settings.microfilaricide}
        min={0}
        step={1}
        max={100}
        onChange={onChange ? onChange : handleChange}
        aria-labelledby="slider"
        valueLabelDisplay={inModal ? 'auto' : 'on'}
      />
     
    </FormControl>
  )
}
export default SettingMicrofilaricide
