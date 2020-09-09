import React from 'react';
import useStyles from "../styles";

import { useSimulatorStore } from "../../../../store/simulatorStore";
import { useScenarioStore, ScenarioStoreConstants } from "../../../../store/scenarioStore";

import {
  FormControl,
  Slider,
  FormLabel,
} from "@material-ui/core";

const SettingPrecision = ({ inModal, label, classAdd }) => {

  const classes = useStyles();
  const { dispatchSimState } = useSimulatorStore();
  const { scenarioState, dispatchScenarioStateUpdate } = useScenarioStore();

  return (
    <FormControl className={`${classes.formControlPrecision} ${classAdd}`}>
      <Slider
        className={classes.precisionSlider}
        value={ scenarioState.scenarioData[ scenarioState.currentScenarioId ].settings.runs }
        min={1}
        step={1}
        max={200}
        onChange={(event, newValue) => {

          dispatchScenarioStateUpdate( {
            type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_SETTING_BY_ID,
            id: scenarioState.currentScenarioId,
            key: 'runs',
            value: newValue
          } );

          dispatchScenarioStateUpdate( {
            type: ScenarioStoreConstants.ACTION_TYPES.MARK_SCENARIO_DIRTY_BY_ID,
            id: scenarioState.currentScenarioId
          } );

          dispatchSimState({ type: "needsRerun", payload: true });
        }}
        aria-labelledby="slider"
        valueLabelDisplay={inModal ? "auto" : "on"}
      />
      <FormLabel component="legend" htmlFor="precision" className={classes.precisionLabel}>
        {label}
      </FormLabel>
    </FormControl>

  )
}
export default SettingPrecision;
