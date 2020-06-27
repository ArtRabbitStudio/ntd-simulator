import React from 'react';
import useStyles from "../styles";

import { useStore } from "../../../../store/simulatorStore";

import {
  FormControl,
  Slider,
  FormLabel,
  Tooltip
} from "@material-ui/core";

const SettingSystematicAdherence = ({ inModal, label, value, onChange }) => {

  const classes = useStyles();
  const { simParams, dispatchSimParams } = useStore();

  return (
    <FormControl fullWidth className={classes.formControl}>
      <Tooltip
        title="Controls how randomly coverage is applied. For 0, coverage is completely random. For 1, the same individuals are always treated."
        aria-label="info"
      >
        <FormLabel
          component="legend"
          htmlFor="rho"
          className={`${classes.withSlider} ${classes.withHelp}`}
        >
          {label}
        </FormLabel>
      </Tooltip>
      <Slider
        value={value}
        min={0}
        step={0.1}
        max={1}
        onChange={onChange}
        aria-labelledby="slider"
        valueLabelDisplay="auto"
      />
      {inModal === false && <div className={classes.adherence}></div>}
      {/*             <p style={{ marginBottom: 0 }}>
        Controls how randomly coverage is applied. For 0, coverage is
        completely random. For 1, the same individuals are always treated.
        </p> */}
    </FormControl>
  )
}
export default SettingSystematicAdherence;