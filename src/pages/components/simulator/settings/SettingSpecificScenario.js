import React from 'react'
import useStyles from '../styles'

import { useStore } from '../../../../store/simulatorStore'

import {
  FormControl,
  Select,
  FormLabel,
  MenuItem,
  Button,
} from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { specificScenarios } from '../helpers/specificScenarios'
import { useDataAPI, useUIState } from '../../../../hooks/stateHooks'

const SettingSpecificScenario = ({ inModal, label, classAdd }) => {
  const classes = useStyles()
  const history = useHistory()
  const { simParams, dispatchSimParams } = useStore()
  const { country, implementationUnit } = useUIState()
  const handleChange = (event) => {
    // todo
    alert('todo')
  }
  const setSpecScen = (par) => {
    if (specificScenarios.length > par) {
      console.log('updating specificPrediction')
      dispatchSimParams({
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
          setSpecScen(0)
        }}
      >
        6 months COVID Interruption
      </Button>{' '}
      &nbsp;
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setSpecScen(1)
        }}
      >
        1 year Interruption
      </Button>{' '}
      &nbsp;
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setSpecScen(2)
        }}
      >
        18 months Interruption
      </Button>{' '}
      &nbsp;
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setSpecScen(3)
        }}
      >
        2 year Interruption
      </Button>
    </React.Fragment>
  ) : (
    <FormControl fullWidth variant="outlined" className={classes.formControl}>
      <FormLabel component="legend">{label}</FormLabel>
      <Select
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        MenuProps={{ disablePortal: true }}
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
export default SettingSpecificScenario
