import React from 'react';
import useStyles from "../styles";

import { useSimulatorStore } from "../../../../store/simulatorStore";
import { useScenarioStore, ScenarioStoreConstants } from "../../../../store/scenarioStore";

import {
  FormControl,
  Select,
  FormLabel,
  MenuItem,
  Tooltip
} from "@material-ui/core";

const SettingFrequency = ({ inModal, label, value, classAdd }) => {

  const classes = useStyles();
  const { dispatchSimState } = useSimulatorStore();
  const { scenarioState, dispatchScenarioStateUpdate } = useScenarioStore();

  const isPerIUSetting = value !== null && typeof value !== 'undefined';

  /* TODO FIXME */
  const handleChange = (event) => {
    if ( isPerIUSetting ) {
      dispatchSimState({ type: "mdaSixMonths", payload: event.target.value });
    }
    else {
      dispatchScenarioStateUpdate( {
        type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_SETTING_BY_ID,
        id: scenarioState.currentScenarioId,
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
        title="Will the MDAs be every 6 months or every year?"
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
        value={ isPerIUSetting ? value : scenarioState.scenarioData[ scenarioState.currentScenarioId ].settings.mdaSixMonths }
        onChange={handleChange}
      >
        <MenuItem value={12}>Annual</MenuItem>
        <MenuItem value={6}>Every 6 months</MenuItem>
      </Select>
    </FormControl>
  )
}
export default SettingFrequency;
