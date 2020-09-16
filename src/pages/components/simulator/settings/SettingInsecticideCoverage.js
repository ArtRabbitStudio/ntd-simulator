import React from 'react';
import useStyles from "../styles";

import { useSimulatorStore } from "../../../../store/simulatorStore";
import { useScenarioStore, ScenarioStoreConstants } from "../../../../store/scenarioStore";

import {
  FormControl,
  Slider,
  FormLabel,
  Tooltip
} from "@material-ui/core";

const SettingInsecticideCoverage = ({ inModal, label, value, classAdd, scenarioId }) => {

  const classes = useStyles();
  const { dispatchSimState } = useSimulatorStore();
  const { scenarioState, dispatchScenarioStateUpdate } = useScenarioStore();

  const isPerIUSetting = value !== null && typeof value !== 'undefined';

  scenarioId = scenarioId ? scenarioId : scenarioState.currentScenarioId;

  return (
    <FormControl fullWidth className={`${classes.formControl} ${classAdd}`}>
      <Tooltip
        title="What proportion of the popiulation are covered by regular indoor residual spraying."
        aria-label="info"
      >
      <FormLabel
        component="legend"
        htmlFor="v_to_hR"
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
        value={ isPerIUSetting ? value : scenarioState.scenarioData[ scenarioId ].settings.v_to_hR }
        id="v_to_hR"
        min={0}
        step={1}
        max={100}
        onChange={(event, newValue) => {

          if( isPerIUSetting ) {
            dispatchSimState({ type: "v_to_hR", payload: newValue });
          }

          else {
            dispatchScenarioStateUpdate( {
              type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_SETTING_BY_ID,
              id: scenarioId,
              key: 'v_to_hR',
              value: newValue
            } );
          }

        }}
        aria-labelledby="slider"
        marks={[
          { value: 0, label: "0" },
          { value: 100, label: "100" },
        ]}
        valueLabelDisplay={inModal ? "auto" : "on"}
      />
      {/*             <p style={{ marginBottom: 0 }}>
              Insecticide is assumed to reduce the vector to host ratio only.
            </p> */}
    </FormControl>
  )
}
export default SettingInsecticideCoverage;
