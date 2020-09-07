import React from 'react'
import useStyles from '../styles'

import { useStore } from '../../../../store/simulatorStore'
import { FormControl, TextField } from '@material-ui/core'
import { simControler } from '../SimulatorEngine'

const SettingName = ({ inModal, label, scenarioId, scenarioLabel }) => {
  const classes = useStyles()
  const { dispatchSimParams } = useStore()

  const handleChange = (event) => {
    // this used to be a special occastion. If nothing changes we can use the handleSlerChanges handler instead.
    dispatchSimParams( {
      type: 'scenarioLabel',
      scenarioId: scenarioId,
      payload: event.target.value
    } );
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
        value={scenarioLabel}
        label={label}
        onChange={handleChange}
      />
    </FormControl>
  )
}
export default SettingName
