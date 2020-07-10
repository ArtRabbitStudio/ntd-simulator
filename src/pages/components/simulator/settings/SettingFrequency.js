import React from 'react';
import useStyles from "../styles";

import { useStore } from "../../../../store/simulatorStore";

import {
  FormControl,
  Select,
  FormLabel,
  MenuItem,
  Tooltip
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
      <Tooltip
        title="Will the MDAs be every 6 months or every year?"
        aria-label="info"
      >
      <FormLabel 
      component="legend" 
      className={
          inModal
            ? classes.withHelp
            : `${classes.centered} ${classes.withHelp}`
        }>{label}</FormLabel>
      </Tooltip>
      <Select

        /* MenuProps={{ disablePortal: true, classes: { paper: classes.selectPaper }, }} */
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        MenuProps={{ disablePortal: true }}
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