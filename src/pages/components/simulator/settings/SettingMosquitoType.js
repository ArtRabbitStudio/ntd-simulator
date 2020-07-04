import React from 'react';
import useStyles from "../styles";

import { useStore } from "../../../../store/simulatorStore";

import {
  FormControl,
  RadioGroup,
  Radio,
  FormLabel,
  FormControlLabel,
  Tooltip
} from "@material-ui/core";

const SettingMosquitoType = ({ inModal, label }) => {

  const classes = useStyles();
  const { simParams, dispatchSimParams } = useStore();



  return (
    <FormControl fullWidth className={classes.formControlSelect}>
       <Tooltip
        title="Which mosquito is the primary transmitter of lymphatic filariasis in this area."
        aria-label="info"
      >
      <FormLabel 
      component="legend"
      className={
        inModal
          ? classes.withHelp
          : `${classes.centered} ${classes.withHelp}`
      }
      >{label}
      </FormLabel>
      </Tooltip>
      <RadioGroup
        className={inModal ? '' : classes.imageOptions}
        row
        aria-label="Species"
        name="species"
        value={simParams.species}
        onChange={(event) => {
          dispatchSimParams({
            type: "species",
            payload: Number(event.target.value),
          });
        }}
      >
        <FormControlLabel
          className={`${inModal ? '' : classes.imageOption} anopheles`}
          value={0}
          control={<Radio color="primary" />}
          label="Anopheles"
        />
        <FormControlLabel
          className={`${inModal ? '' : classes.imageOption} culex`}
          value={1}
          control={<Radio color="primary" />}
          label="Culex"
        />
      </RadioGroup>
    </FormControl>
  )
}
export default SettingMosquitoType;