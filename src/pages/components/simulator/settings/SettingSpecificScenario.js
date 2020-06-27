import React from 'react';
import useStyles from "../styles";

import { useStore } from "../../../../store/simulatorStore";

import {
  FormControl,
  Select,
  FormLabel,
  MenuItem,
  Button,
} from "@material-ui/core";

const SettingSpecificScenario = ({ inModal, label }) => {

  const classes = useStyles();
  const { simParams, dispatchSimParams } = useStore();

  const handleChange = (event) => {
    // todo
    alert('todo');
  };
  return (
    inModal === false ?
      <React.Fragment>
        <Button variant="contained" color="primary">
          2 year COVID Interruption
      </Button>
        <Button variant="contained">Scenario three</Button>
        <Button variant="contained">Treatment stop</Button>
      </React.Fragment>
      :
      <FormControl
        fullWidth
        variant="outlined"
        className={classes.formControl}
      >
        <FormLabel component="legend">{label}</FormLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={0}
          onChange={handleChange}
        >
          <MenuItem value={0}>No</MenuItem>
          <MenuItem value={2}>2 year COVID Interruption</MenuItem>
          <MenuItem value={3}>Scenario three</MenuItem>
          <MenuItem value={4}>Treatment stop</MenuItem>
        </Select>
      </FormControl>
  )
}
export default SettingSpecificScenario;