import React from 'react';
import useStyles from "../styles";

import { useStore } from "../../../../store/simulatorStore";

import {
  FormControl,
  Slider,
  FormLabel,
} from "@material-ui/core";

const SettingTargetCoverage = ({ inModal, label }) => {

  const classes = useStyles();
  const { simParams, dispatchSimParams } = useStore();

  const handleCoverageChange = (event, newValue) => {
    // this used to be a special occastion. If nothing changes we can use the handleSlerChanges handler instead.
    dispatchSimParams({ type: "coverage", payload: newValue });
  };

  return (
    <FormControl fullWidth className={classes.formControl}>
      <FormLabel component="legend" htmlFor="coverage">{label}</FormLabel>
      <Slider
        value={simParams.coverage}
        min={0}
        step={1}
        max={100}
        onChange={handleCoverageChange}
        aria-labelledby="slider"
        marks={[
          { value: 0, label: "0" },
          { value: 100, label: "100" },
        ]}
        valueLabelDisplay="auto"
      />
    </FormControl>
  )
}
export default SettingTargetCoverage;