import React from 'react'
import useStyles from 'pages/components/simulator/styles'

import { useSimulatorStore } from 'store/simulatorStore'
import { useScenarioStore, ScenarioStoreConstants } from "store/scenarioStore";

import { FormControl, Slider, FormLabel, Tooltip } from '@material-ui/core'
import { useTranslation } from 'react-i18next';

const SettingMacrofilaricide = ({
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
      dispatchSimState({ type: 'macrofilaricide', payload: newValue })
    }
    else {
      dispatchScenarioStateUpdate( {
        type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_SETTING_BY_ID,
        id: scenarioId,
        key: 'macrofilaricide',
        value: newValue
      } );
    }
  }
  return (
    <FormControl fullWidth className={`${classes.formControl} ${classAdd}`}>
      <Tooltip
        title={t('macrofilaricideHelp')}
        aria-label="info"
      >
        <FormLabel
          component="legend"
          htmlFor="macrofilaricide"
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
        value={ isPerIUSetting ? value : scenarioState.scenarioData[ scenarioId ].settings.macrofilaricide}
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
export default SettingMacrofilaricide
