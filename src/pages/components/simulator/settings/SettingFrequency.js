import React from 'react';
import useStyles from "../styles";

import { useStore } from "../../../../store/simulatorStore";

import {
  FormControl,
  Select,
  FormLabel,
  MenuItem
} from "@material-ui/core";

const SettingFrequency = ({ inModal, label }) => {

  const classes = useStyles();
  const { simParams, dispatchSimParams } = useStore();

  const handleFrequencyChange = (event) => {
    dispatchSimParams({ type: "mdaSixMonths", payload: event.target.value });
  };

  return (
    <FormControl
      fullWidth
      variant="outlined"
      className={classes.formControl}
    >
      <FormLabel component="legend">{label}</FormLabel>
      <Select
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        value={simParams.mdaSixMonths}
        onChange={handleFrequencyChange}
      >
        <MenuItem value={12}>Annual</MenuItem>
        <MenuItem value={6}>Every 6 months</MenuItem>
      </Select>
    </FormControl>
  )
}
export default SettingFrequency;