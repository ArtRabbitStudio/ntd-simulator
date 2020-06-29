import React from 'react';
import useStyles from "../styles";

import { useStore } from "../../../../store/simulatorStore";

import {
  FormControl,
  Select,
  FormLabel,
  MenuItem
} from "@material-ui/core";

const SettingFrequency = ({ inModal, label, classAdd }) => {

  const classes = useStyles();
  const { simParams, dispatchSimParams } = useStore();

  const handleChange = (event) => {
    dispatchSimParams({ type: "mdaSixMonths", payload: event.target.value });
  };

  return (
    <FormControl
      fullWidth
      variant="outlined"
      className={`${classes.formControl} ${classAdd}`}
    >
      <FormLabel component="legend">{label}</FormLabel>
      <Select
        /* MenuProps={{ disablePortal: true, classes: { paper: classes.selectPaper }, }} */
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        value={simParams.mdaSixMonths}
        onChange={handleChange}
      >
        <MenuItem value={12}>Annual</MenuItem>
        <MenuItem value={6}>Every 6 months</MenuItem>
      </Select>
    </FormControl>
  )
}
export default SettingFrequency;