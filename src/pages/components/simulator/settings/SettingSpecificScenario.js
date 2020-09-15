import React from 'react'
import useStyles from '../styles'

import { useSimulatorStore } from '../../../../store/simulatorStore'
import { useScenarioStore, ScenarioStoreConstants } from "../../../../store/scenarioStore";

import {
  FormControl,
  Select,
  FormLabel,
  MenuItem,
  Button,
} from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { specificScenarios } from '../helpers/specificScenarios'
import { useUIState } from '../../../../hooks/stateHooks'

const SettingSpecificScenario = ({ inModal, label, classAdd }) => {
  const classes = useStyles()
  const history = useHistory()
  const { dispatchSimState } = useSimulatorStore()
  const { scenarioState, dispatchScenarioStateUpdate } = useScenarioStore();
  const { country, implementationUnit } = useUIState()

  const handleChangeFromScenario = (event) => {

    const par = event.target.value;

    dispatchScenarioStateUpdate( {
      type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_SETTING_BY_ID,
      id: scenarioState.currentScenarioId,
      key: 'specificPredictionIndex',
      value: par
    } );

    if (par === -1) {

      dispatchScenarioStateUpdate( {
        type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_SETTING_BY_ID,
        id: scenarioState.currentScenarioId,
        key: 'specificPrediction',
        value: null
      } );

    }

    else if (specificScenarios.length > par) {

      dispatchScenarioStateUpdate( {
        type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_SETTING_BY_ID,
        id: scenarioState.currentScenarioId,
        key: 'specificPrediction',
        value: specificScenarios[par]
      } );

      dispatchScenarioStateUpdate( {
        type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_LABEL_BY_ID,
        id: scenarioState.currentScenarioId,
        label: specificScenarios[par].label
      } );


    }

  }

  const setSpecificScenarioFromSetup = (par) => {
    dispatchSimState({
      type: 'specificPredictionIndex',
      payload: par,
    })

    if (specificScenarios.length > par) {
      console.log('updating specificPrediction')
      dispatchSimState({
        type: 'specificPrediction',
        payload: specificScenarios[par],
      })
      history.push({ pathname: `/simulator/${country}/${implementationUnit}` })
    }
  }

  return inModal === false ? (
    <React.Fragment>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setSpecificScenarioFromSetup(0)
        }}
      >
        6 months COVID disruption
      </Button>{' '}
      &nbsp;
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setSpecificScenarioFromSetup(1)
        }}
      >
        1 year COVID disruption
      </Button>{' '}
      &nbsp;
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setSpecificScenarioFromSetup(2)
        }}
      >
        18 months COVID disruption
      </Button>{' '}
      &nbsp;
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setSpecificScenarioFromSetup(3)
        }}
      >
        2 year COVID disruption
      </Button>
    </React.Fragment>
  ) : (
    <FormControl fullWidth variant="outlined" className={classes.formControl}>
      <FormLabel component="legend">{label}</FormLabel>
      <Select
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        MenuProps={{ disablePortal: true }}
        value={scenarioState.scenarioData[ scenarioState.currentScenarioId ].settings.specificPredictionIndex}
        onChange={handleChangeFromScenario}
      >
        <MenuItem value={-1}>No</MenuItem>
        <MenuItem value={0}>6 months COVID disruption</MenuItem>
        <MenuItem value={1}>1 year COVID disruption</MenuItem>
        <MenuItem value={2}>18 months COVID disruption</MenuItem>
        <MenuItem value={3}>2 years COVID disruption</MenuItem>
      </Select>
    </FormControl>
  )
}
export default SettingSpecificScenario
