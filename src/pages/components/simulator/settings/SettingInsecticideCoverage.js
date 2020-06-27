import React from 'react';
import useStyles from "../styles";

import { useStore } from "../../../../store/simulatorStore";

import {
  FormControl,
  Slider,
  FormLabel,
} from "@material-ui/core";

const SettingInsecticideCoverage = ({ inModal, label }) => {

  const classes = useStyles();
  const { simParams, dispatchSimParams } = useStore();

  return (
    <FormControl fullWidth>
      <FormLabel
        component="legend"
        htmlFor="v_to_hR"
        className={inModal ? '' : classes.withSlider}
      >
        {label}
      </FormLabel>
      <Slider
        value={simParams.v_to_hR}
        id="v_to_hR"
        min={1}
        step={1}
        max={100}
        onChange={(event, newValue) => {
          dispatchSimParams({ type: "v_to_hR", payload: newValue });
        }}
        aria-labelledby="slider"
        marks={[
          { value: 0, label: "0" },
          { value: 100, label: "100" },
        ]}
        valueLabelDisplay={inModal ? "auto" : "on"}
      />
      {/*             <p style={{ marginBottom: 0 }}>
              Insecticide is assumed to reduce the vector to host ratio only.
            </p> */}
    </FormControl>
  )
}
export default SettingInsecticideCoverage;