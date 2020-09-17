import React from 'react';
import useStyles from "pages/components/simulator/styles";

import { useSimulatorStore } from "store/simulatorStore";
import { useScenarioStore, ScenarioStoreConstants } from "store/scenarioStore";

import {
  FormControl,
  Slider,
  FormLabel,
  Tooltip
} from "@material-ui/core";

const SettingBedNetCoverage = ({ inModal, label, value, onChange, classAdd, scenarioId }) => {

  const classes = useStyles();
  const { dispatchSimState } = useSimulatorStore();
  const { scenarioState, dispatchScenarioStateUpdate } = useScenarioStore();

  const isPerIUSetting = value !== null && typeof value !== 'undefined';

  scenarioId = scenarioId ? scenarioId : scenarioState.currentScenarioId;

  /* TODO FIXME */
  const handleChange = (event, newValue) => {
    if ( isPerIUSetting ) {
      dispatchSimState({ type: "covN", payload: newValue });
    }
    else {
      dispatchScenarioStateUpdate( {
        type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_SETTING_BY_ID,
        id: scenarioId,
        key: 'covN',
        value: newValue
      } );
    }
  };

  return (
    <FormControl fullWidth className={`${classes.formControl} ${classAdd}`}>
      <Tooltip
        title="Proportion of the population covered by a bed net shared with one other person."
        aria-label="info"
      >
      <FormLabel
        component="legend"
        htmlFor="covN"
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
        value={ isPerIUSetting ? value : scenarioState.scenarioData[ scenarioId ].settings.covN }
        min={0}
        step={1}
        max={100}
        onChange={onChange ? onChange : handleChange}
        aria-labelledby="slider"
        id="covN"
        marks={[
          { value: 0, label: "0" },
          { value: 100, label: "100" },
        ]}
        valueLabelDisplay={inModal ? "auto" : "on"}
      />
      {/*             <p style={{ marginBottom: 0 }}>
              Bed nets are assumed to have been distributed at the start of
              intervention and are assumed to be effective for the entire
              lifetime of the intervention campaign.
            </p> */}
    </FormControl>
  )
}
export default SettingBedNetCoverage;
