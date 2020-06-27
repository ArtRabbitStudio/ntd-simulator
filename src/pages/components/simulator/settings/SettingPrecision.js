import React from 'react';
import useStyles from "../styles";

import { useStore } from "../../../../store/simulatorStore";

import {
  FormControl,
  Slider,
  FormLabel,
} from "@material-ui/core";

const SettingPrecision = ({ inModal, label, classAdd }) => {

  const classes = useStyles();
  const { simParams, dispatchSimParams } = useStore();

  return (
    <FormControl className={`${classes.formControlPrecision} ${classAdd}`}>
      <Slider
        className={classes.precisionSlider}
        value={simParams.runs}
        min={1}
        step={1}
        max={200}
        onChange={(event, newValue) => {
          dispatchSimParams({ type: "runs", payload: newValue });
        }}
        aria-labelledby="slider"
        valueLabelDisplay="auto"
      />
      <FormLabel component="legend" htmlFor="precision" className={classes.precisionLabel}>
        {label}
      </FormLabel>
    </FormControl>

  )
}
export default SettingPrecision;