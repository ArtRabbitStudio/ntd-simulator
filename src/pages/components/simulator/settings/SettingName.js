import React from 'react'
import useStyles from '../styles'

import { useScenarioStore, ScenarioStoreConstants } from '../../../../store/scenarioStore'
import { FormControl, TextField } from '@material-ui/core'

const SettingName = ({ inModal, label, scenarioId, scenarioLabel }) => {
  const classes = useStyles()
  const { dispatchScenarioStateUpdate } = useScenarioStore()

  const handleChange = (event) => {
    dispatchScenarioStateUpdate( {
      type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_LABEL_BY_ID,
      id: scenarioId,
      label: event.target.value
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
