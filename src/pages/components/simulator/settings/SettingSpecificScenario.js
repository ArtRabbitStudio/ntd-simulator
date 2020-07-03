import React, { useState } from 'react'
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
    const par = event.target.value
    console.log(par)
    dispatchSimParams({
      type: 'specificPredictionIndex',
      payload: par,
    })
    if (par > -1 && specificScenarios.length > par) {
      console.log('updating specificPrediction')
      dispatchSimParams({
        type: 'specificPrediction',
        payload: specificScenarios[par],
      })
    }
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
        value={simParams.specificPredictionIndex}
        onChange={handleChange}
      >
        <MenuItem value={-1}>No</MenuItem>
        <MenuItem value={0}>6 months COVID Interruption</MenuItem>
        <MenuItem value={1}>1 year COVID Interruption</MenuItem>
        <MenuItem value={2}>18 months COVID Interruption</MenuItem>
        <MenuItem value={3}>2 years COVID Interruption</MenuItem>
      </Select>
    </FormControl>
  )
}
export default SettingSpecificScenario
