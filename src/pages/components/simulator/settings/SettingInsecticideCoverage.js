import React from 'react';
import useStyles from "../styles";

import { useStore } from "../../../../store/simulatorStore";

import {
  FormControl,
  Slider,
  FormLabel,
  Tooltip
} from "@material-ui/core";

const SettingInsecticideCoverage = ({ inModal, label, classAdd }) => {

  const classes = useStyles();
  const { simParams, dispatchSimParams } = useStore();

  return (
    <FormControl fullWidth className={`${classes.formControl} ${classAdd}`}>
      <Tooltip
        title="What proportion of the popiulation are covered by regular indoor residual spraying."
        aria-label="info"
      >
      <FormLabel
        component="legend"
        htmlFor="v_to_hR"
        className={
          inModal
            ? classes.withHelp
            : `${classes.withSlider} ${classes.centered} ${classes.withHelp}`
        }
      >
        {label}
      </FormLabel>
      </Tooltip>
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