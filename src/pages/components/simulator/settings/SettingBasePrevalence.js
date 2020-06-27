import React from 'react';
import useStyles from "../styles";

import { useStore } from "../../../../store/simulatorStore";

import {
  FormControl,
  Slider,
  FormLabel,
} from "@material-ui/core";

const SettingBasePrevalence = ({ inModal, label }) => {

  const classes = useStyles();
  const { simParams, dispatchSimParams } = useStore();

  return (
    <FormControl fullWidth className={classes.formControl}>
      <FormLabel
        component="legend"
        htmlFor="endemicity"
        className={classes.withSlider}
      >
        {label}
      </FormLabel>
      <Slider
        value={simParams.endemicity}
        id="endemicity"
        min={5}
        step={0.5}
        max={18}
        onChange={(event, newValue) => {
          dispatchSimParams({ type: "endemicity", payload: newValue });
        }}
        aria-labelledby="slider"
        marks={[
          { value: 5, label: "5%" },
          { value: 18, label: "18%" },
        ]}
        valueLabelDisplay="auto"
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