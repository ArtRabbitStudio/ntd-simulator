import React from 'react';
import useStyles from "../styles";

import { useStore } from "../../../../store/simulatorStore";

import {
  FormControl,
  Select,
  FormLabel,
  MenuItem
} from "@material-ui/core";

const SettingDrugRegimen = ({ inModal, label }) => {

  const classes = useStyles();
  const { simParams, dispatchSimParams } = useStore();

  const handleChange = (event) => {
    dispatchSimParams({
      type: "mdaRegimen",
      payload: event.target.value,
    });
  };

  return (
    <FormControl
      fullWidth
      variant="outlined"
      className={classes.formControl}
    >
      <FormLabel
        component="legend"
        htmlFor="demo-simple-select-helper-label"
      >
        {label}
      </FormLabel>
      <Select
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        value={simParams.mdaRegimen}
        onChange={handleChange}
      >
        <MenuItem value={1}>albendazole + ivermectin</MenuItem>
        <MenuItem value={2}>
          albendazole + diethylcarbamazine
        </MenuItem>
        <MenuItem value={3}>ivermectin</MenuItem>
        <MenuItem value={4}>
          ivermectin + albendazole + diethylcarbamazine
        </MenuItem>
        <MenuItem value={5}>custom</MenuItem>
      </Select>
    </FormControl>
  )
}
export default SettingDrugRegimen;