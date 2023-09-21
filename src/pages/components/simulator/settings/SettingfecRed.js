import React from 'react'
import useStyles from 'pages/components/simulator/styles'

import { useSimulatorStore } from 'store/simulatorStore'
import { useScenarioStore, ScenarioStoreConstants } from "store/scenarioStore";

import { FormControl, Slider, FormLabel, Tooltip } from '@material-ui/core'
import { useTranslation } from 'react-i18next';

const SettingfecRed = ({
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
      dispatchSimState({ type: 'fecRed', payload: newValue })
    }
    else {
      dispatchScenarioStateUpdate( {
        type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_SETTING_BY_ID,
        id: scenarioId,
        key: 'fecRed',
        value: newValue
      } );
    }
  }


  return (
    <FormControl fullWidth className={`${classes.formControl} ${classAdd}`}>
      <Tooltip
        title={t('fecRedHelp')}
        aria-label="info"
      >
        <FormLabel
          component="legend"
          htmlFor="fecRed"
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
        value={ isPerIUSetting ? value : scenarioState.scenarioData[ scenarioId ].settings.fecRed}
        min={0}
        step={0.1}
        max={10}
        onChange={onChange ? onChange : handleChange}
        aria-labelledby="slider"
        valueLabelDisplay={inModal ? 'auto' : 'on'}
      />
     
    </FormControl>
  )
}
export default SettingfecRed
