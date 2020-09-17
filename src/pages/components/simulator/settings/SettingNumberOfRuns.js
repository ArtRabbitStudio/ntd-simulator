import React from 'react';
import useStyles from "pages/components/simulator/styles";

import { useSimulatorStore } from "store/simulatorStore";

import {
  FormControl,
  Slider,
  FormLabel,
} from "@material-ui/core";

const SettingNumberOfRuns = ({ inModal, label, classAdd }) => {

  const classes = useStyles();
  const { simState, dispatchSimState } = useSimulatorStore();

  return (
    <FormControl fullWidth className={`${classes.formControl} ${classAdd}`}>
      <FormLabel
        component="legend"
        htmlFor="runs"
        className={inModal ? '' : classes.withSlider}
      >
        {label}
      </FormLabel>
      <Slider
        value={simState.runs}
        min={1}
        step={1}
        max={100}
        onChange={(event, newValue) => {
          dispatchSimState({ type: "runs", payload: newValue });
        }}
        aria-labelledby="slider"
        marks={[
          { value: 0, label: "0" },
          { value: 100, label: "100" },
        ]}
        valueLabelDisplay={inModal ? "auto" : "on"}
      />
    </FormControl>
  )
}
export default SettingNumberOfRuns;
