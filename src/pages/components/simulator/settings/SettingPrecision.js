import React from 'react';
import useStyles from "../styles";

import { useStore } from "../../../../store/simulatorStore";

import {
  FormControl,
  Slider,
  FormLabel,
} from "@material-ui/core";

const SettingPrecision = ({ inModal, label }) => {

  const classes = useStyles();
  const { simParams, dispatchSimParams } = useStore();

  return (
    <FormControl className={classes.formControlChart}>
      <FormLabel component="legend" htmlFor="precision">
        {label}
      </FormLabel>
      <Slider
        value={5}
        min={1}
        step={1}
        max={10}
        onChange={(event, newValue) => {
          dispatchSimParams({ type: "precision", payload: newValue });
        }}
        aria-labelledby="slider"
        valueLabelDisplay="auto"
      />
    </FormControl>

  )
}
export default SettingPrecision;