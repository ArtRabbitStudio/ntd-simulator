import React from 'react'
import useStyles from '../styles'

import { useStore } from '../../../../store/simulatorStore'
import { FormControl, TextField } from '@material-ui/core'
import { simControler } from '../SimulatorEngine'
import SessionStorage from '../helpers/sessionStorage'

const SettingName = ({ inModal, label }) => {
  const classes = useStyles()
  const { simParams, dispatchSimParams } = useStore()

  const handleChange = (event) => {
    // this used to be a special occastion. If nothing changes we can use the handleSlerChanges handler instead.
    dispatchSimParams({ type: 'scenarioLabel', payload: event.target.value })
    simControler.scenarioLabel = event.target.value
  }
  return (
    <FormControl
      fullWidth
      variant="outlined"
      className={classes.formControlText}
    >
      <TextField
        id="scenario-name"
        value={
          simParams.scenarioLabels[
           // JSON.parse(window.localStorage.getItem('scenarioIndex')) || 0
            SessionStorage.currentScenarioIndex || 0
          ]
        }
        label={label}
        onChange={handleChange}
      />
    </FormControl>
  )
}
export default SettingName
