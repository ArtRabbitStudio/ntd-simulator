import React from 'react';
import useStyles from "../styles";
import { observer } from 'mobx-react'



import { useScenarioStore, ScenarioStoreConstants } from "../../../../store/scenarioStore";

import {
  FormControl,
  Slider,
  FormLabel,
  Fab
} from "@material-ui/core";

const SettingPrecision = ({ inModal, label, classAdd, setGraphTypeSimple,graphTypeSimple }) => {

  const classes = useStyles();
  const { scenarioState, dispatchScenarioStateUpdate } = useScenarioStore();


  return (
    <FormControl className={`${classes.formControlPrecision} ${classAdd}`}>
      <Slider
        className={classes.precisionSlider}
        value={ scenarioState.scenarioData[ scenarioState.currentScenarioId ].settings.runs }
        min={1}
        step={1}
        max={200}
        onChange={(event, newValue) => {

          dispatchScenarioStateUpdate( {
            type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_SETTING_BY_ID,
            id: scenarioState.currentScenarioId,
            key: 'runs',
            value: newValue
          } );

          dispatchScenarioStateUpdate( {
            type: ScenarioStoreConstants.ACTION_TYPES.MARK_SCENARIO_DIRTY_BY_ID,
            id: scenarioState.currentScenarioId
          } );

        }}
        aria-labelledby="slider"
        valueLabelDisplay={inModal ? "auto" : "on"}
      />
      <FormLabel component="legend" htmlFor="precision" className={classes.precisionLabel}>
        {label}
        <Fab
          color="inherit"
          aria-label="SET GRAPH TYPE"
          disabled={false}
          className={graphTypeSimple ? classes.graphTypeIconSimple : classes.graphTypeIconComplex}
          onClick={setGraphTypeSimple}
        >
          &nbsp;
        </Fab>
      </FormLabel>
      
    </FormControl>

  )
}
export default SettingPrecision;
