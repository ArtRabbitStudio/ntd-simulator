import React from 'react';
import useStyles from "pages/components/simulator/styles";

import { useSimulatorStore } from "store/simulatorStore";
import { useScenarioStore, ScenarioStoreConstants } from "store/scenarioStore";

import {
  FormControl,
  Slider,
  FormLabel,
  Fab
} from "@material-ui/core";

const SettingPrecision = ({ inModal, label, classAdd,showPrecisionSlider, setGraphTypeSimple,graphTypeSimple, scenarioId }) => {

  const classes = useStyles();
  const { dispatchSimState } = useSimulatorStore();
  const { scenarioState, dispatchScenarioStateUpdate } = useScenarioStore();

  const updateSimState = scenarioId ? false : true;
  scenarioId = scenarioId ? scenarioId : scenarioState.currentScenarioId;

  return (
    <FormControl className={`${classes.formControlPrecision} ${classAdd}`}>
      {showPrecisionSlider && <Slider
        className={classes.precisionSlider}
        value={ scenarioState.scenarioData[ scenarioId ].settings.runs }
        min={10}
        step={5}
        max={200}
        onChange={(event, newValue) => {

          dispatchScenarioStateUpdate( {
            type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_SETTING_BY_ID,
            id: scenarioId,
            key: 'runs',
            value: newValue
          } );

          dispatchScenarioStateUpdate( {
            type: ScenarioStoreConstants.ACTION_TYPES.MARK_SCENARIO_DIRTY_BY_ID,
            id: scenarioId
          } );

          if( updateSimState ) {
            // update overall simulator precision settings too
            dispatchSimState({ type: "runs", payload: newValue });
          }

        }}
        aria-labelledby="slider"
        valueLabelDisplay={inModal ? "auto" : "on"}
      />}
      <FormLabel component="legend" htmlFor="precision" className={classes.precisionLabel}>
        {showPrecisionSlider && label}
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
