import React from 'react';
import useStyles from "../styles";

import { useStore } from "../../../../store/simulatorStore";

import {
  FormControl,
  Slider,
  FormLabel,
} from "@material-ui/core";

const SettingTargetCoverage = ({ inModal, label, classAdd, value, onChange }) => {

  const classes = useStyles();
  const { simParams, dispatchSimParams } = useStore();

  const handleChange = (event, newValue) => {
    // this used to be a special occastion. If nothing changes we can use the handleSlerChanges handler instead.
    dispatchSimParams({ type: "coverage", payload: newValue });
  };

  return (
    <FormControl fullWidth className={`${classes.formControl} ${classAdd}`}>
      <FormLabel
        component="legend"
        htmlFor="coverage"
        className={inModal ? '' : classes.withSlider}
      >{label}</FormLabel>
      <Slider
        value={value ? value : simParams.coverage}
        min={0}
        step={1}
        max={100}
        onChange={onChange ? onChange : handleChange}
        aria-labelledby="slider"
        marks={[
          { value: 10, label: "0" },
          { value: 200, label: "100" },
        ]}
        valueLabelDisplay={inModal ? "auto" : "on"}
      />
    </FormControl>
  )
}
export default SettingTargetCoverage;