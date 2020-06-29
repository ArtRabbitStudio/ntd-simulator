import React from 'react';
import useStyles from "../styles";

import { useStore } from "../../../../store/simulatorStore";

import {
  FormControl,
  Slider,
  FormLabel,
} from "@material-ui/core";

const SettingBedNetCoverage = ({ inModal, label, value, onChange, classAdd }) => {

  const classes = useStyles();
  const { simParams, dispatchSimParams } = useStore();

  const handleChange = (event, newValue) => {
    dispatchSimParams({ type: "covN", payload: newValue });
  };

  return (
    <FormControl fullWidth className={`${classes.formControl} ${classAdd}`}>
      <FormLabel
        component="legend"
        htmlFor="covN"
        className={inModal ? '' : classes.withSlider}
      >
        {label}
      </FormLabel>
      <Slider
        value={value ? value : simParams.covN}
        min={0}
        step={1}
        max={100}
        onChange={onChange ? onChange : handleChange}
        aria-labelledby="slider"
        id="covN"
        marks={[
          { value: 0, label: "0" },
          { value: 100, label: "100" },
        ]}
        valueLabelDisplay={inModal ? "auto" : "on"}
      />
      {/*             <p style={{ marginBottom: 0 }}>
              Bed nets are assumed to have been distributed at the start of
              intervention and are assumed to be effective for the entire
              lifetime of the intervention campaign.
            </p> */}
    </FormControl>
  )
}
export default SettingBedNetCoverage;