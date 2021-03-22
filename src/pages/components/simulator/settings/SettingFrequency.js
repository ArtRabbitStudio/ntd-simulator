import React from 'react';
import useStyles from "pages/components/simulator/styles";

import { useSimulatorStore } from "store/simulatorStore";
import { useScenarioStore, ScenarioStoreConstants } from "store/scenarioStore";
import { useTranslation } from 'react-i18next';
import AppConstants from 'AppConstants';

import {
  FormControl,
  Select,
  FormLabel,
  MenuItem,
  Tooltip
} from "@material-ui/core";

const SettingFrequency = ({ inModal, label, value, classAdd, scenarioId,disease }) => {
  console.log('Settings Frequency',disease)
const { t, i18n } = useTranslation();
  const classes = useStyles();
  const { dispatchSimState } = useSimulatorStore();
  const { scenarioState, dispatchScenarioStateUpdate } = useScenarioStore();

  const isPerIUSetting = value !== null && typeof value !== 'undefined';

  scenarioId = scenarioId ? scenarioId : scenarioState.currentScenarioId;

  /* TODO FIXME */
  const handleChange = (event) => {
    if ( isPerIUSetting ) {
      dispatchSimState({ type: "mdaSixMonths", payload: event.target.value });
    }
    else {
      dispatchScenarioStateUpdate( {
        type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_SETTING_BY_ID,
        id: scenarioId,
        key: 'mdaSixMonths',
        value: event.target.value
      } );
    }
  };

  return (
    <FormControl
      fullWidth
      variant="outlined"
      className={`${classes.formControl} ${classAdd}`}
    >
      <Tooltip
        title={t('everyYear')}
        aria-label="info"
      >
      <FormLabel 
      component="legend" 
      className={
          inModal
            ? classes.withHelp
            : `${classes.centered} ${classes.withHelp}`
        }>{label}</FormLabel>
      </Tooltip>
      <Select

        /* MenuProps={{ disablePortal: true, classes: { paper: classes.selectPaper }, }} */
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        MenuProps={{ disablePortal: true }}
        value={ isPerIUSetting ? value : scenarioState.scenarioData[ scenarioId ].settings.mdaSixMonths }
        onChange={handleChange}
      >
        {disease === AppConstants.DISEASE_SCH_MANSONI && <MenuItem value={36}>Every 3 years</MenuItem>}
        {disease === AppConstants.DISEASE_SCH_MANSONI && <MenuItem value={24}>Every 2 years</MenuItem>}
        <MenuItem value={12}>{t('annual')}</MenuItem>
        <MenuItem value={6}>{t('every6Months')}</MenuItem>
      </Select>
    </FormControl>
  )
}
export default SettingFrequency;
