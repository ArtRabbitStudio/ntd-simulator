import React from 'react';
import useStyles from "../styles";

import { useStore } from "../../../../store/simulatorStore";

import {
  FormControl,
  TextField,
} from "@material-ui/core";

const SettingName = ({ inModal, label }) => {

  const classes = useStyles();
  const { simParams, dispatchSimParams } = useStore();

  return (
    <FormControl
      fullWidth
      variant="outlined"
      className={classes.formControlText}
    >
      <TextField id="scenario-name" label={label} />
    </FormControl>
  )
}
export default SettingName;