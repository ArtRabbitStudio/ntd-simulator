import React from 'react';
import useStyles from "../styles";

import { useSimulatorStore } from "../../../../store/simulatorStore";

import {
  FormControl,
  Slider,
  FormLabel,
} from "@material-ui/core";

const SettingBasePrevalence = ({ inModal, label, classAdd }) => {

  const classes = useStyles();
  const { simState, dispatchSimState } = useSimulatorStore();

  return (
    <FormControl fullWidth className={`${classes.formControl} ${classAdd}`}>
      <FormLabel
        component="legend"
        htmlFor="endemicity"
        className={inModal ? '' : classes.withSlider}
      >
        {label}
      </FormLabel>
      <Slider
        value={simState.endemicity}
        id="endemicity"
        min={5}
        step={0.5}
        max={18}
        onChange={(event, newValue) => {
          dispatchSimState({ type: "endemicity", payload: newValue });
        }}
        aria-labelledby="slider"
        marks={[
          { value: 5, label: "5%" },
          { value: 18, label: "18%" },
        ]}
        valueLabelDisplay={inModal ? "auto" : "on"}
      />
      {/*             <p style={{ marginBottom: 0 }}>
              The mf prevalence in the population before intervention occurs.
              Due to the stochastic nature of the model this is a prevalence
              averaged over many independent runs and so should be treated as an
              approximation only.{' '}
            </p> */}
    </FormControl>
  )
}
export default SettingBasePrevalence;
