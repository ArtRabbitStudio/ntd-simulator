import React from 'react'
import useStyles from '../styles'

import { useSimulatorStore } from '../../../../store/simulatorStore'
import { useScenarioStore, ScenarioStoreConstants } from '../../../../store/scenarioStore'
import { FormControl, TextField } from '@material-ui/core'

const SettingName = ({ inModal, label, scenarioId, scenarioLabel }) => {
  const classes = useStyles()
  const { dispatchSimState } = useSimulatorStore()
  const { dispatchScenarioStateUpdate } = useScenarioStore()

  const handleChange = (event) => {
    dispatchScenarioStateUpdate( {
      type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_LABEL_BY_ID,
      id: scenarioId,
      label: event.target.value
    } );
    // this used to be a special occastion. If nothing changes we can use the handleSlerChanges handler instead.
    dispatchSimState( {
      type: 'scenarioLabel',
      scenarioId: scenarioId,
      payload: event.target.value
    } );
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
