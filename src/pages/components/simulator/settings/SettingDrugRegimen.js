import React from 'react';
import useStyles from "../styles";

import { useStore } from "../../../../store/simulatorStore";

import {
  FormControl,
  Select,
  FormLabel,
  MenuItem
} from "@material-ui/core";

const SettingDrugRegimen = ({ inModal, label, value, onChange, classAdd }) => {

  const classes = useStyles();
  const { simParams, dispatchSimParams } = useStore();

  console.log('in drop down simParams.mdaRegimen', simParams.mdaRegimen)

  const handleChange = (event) => {
    dispatchSimParams({
      type: "mdaRegimen",
      payload: event.target.value,
    });
  };

  //TODO convert 
  //xIA IVM+ALB
  //xDA DEC+ALB
  //xxA ALB alone 
  //IDA tripple  drug


  return (
    <FormControl
      fullWidth
      variant="outlined"
      className={`${classes.formControl} ${classAdd}`}
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
        value={value ? value : simParams.mdaRegimen}
        onChange={onChange ? onChange : handleChange}
      >
        <MenuItem value={'xIA'}>albendazole + ivermectin</MenuItem>
        <MenuItem value={'xDA'}>
          albendazole + diethylcarbamazine
        </MenuItem>
        <MenuItem value={'xxI'}>ivermectin</MenuItem>
        <MenuItem value={'IDA'}>
          ivermectin + albendazole + diethylcarbamazine
        </MenuItem>
      </Select>
    </FormControl>
  )
}
export default SettingDrugRegimen;