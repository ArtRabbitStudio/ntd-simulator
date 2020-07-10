import React from 'react'
import useStyles from '../styles'

import { useStore } from '../../../../store/simulatorStore'

import { FormControl, Select, FormLabel, MenuItem,Tooltip } from '@material-ui/core'

const SettingDrugRegimen = ({ inModal, label, value, onChange, classAdd }) => {
  const classes = useStyles()
  const { simParams, dispatchSimParams } = useStore()

  // console.log('in drop down simParams.mdaRegimen', simParams.mdaRegimen)

  const handleChange = (event) => {
    dispatchSimParams({
      type: 'mdaRegimen',
      payload: event.target.value,
    })
  }

  //TODO convert
  //xIA IVM+ALB
  //xDA DEC+ALB
  //xxA ALB alone
  //IDA tripple  drug

  return (
    <FormControl
      fullWidth
      variant="outlined"
      className={`${classes.formControl} ${classAdd}`}
    >
      <Tooltip
        title="Choose the appropriate drug regimen."
        aria-label="info"
      >
      <FormLabel 
        component="legend" 
        htmlFor="demo-simple-select-helper-label"
        className={
          inModal
            ? classes.withHelp
            : `${classes.centered} ${classes.withHelp}`
        }
      >
        {label}
      </FormLabel>
      </Tooltip>
      <Select
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        value={value ? value : simParams.mdaRegimen}
        onChange={onChange ? onChange : handleChange}
        MenuProps={{ disablePortal: true }}
      >
        <MenuItem value={'xIA'}>albendazole + ivermectin</MenuItem>
        <MenuItem value={'xDA'}>albendazole + diethylcarbamazine</MenuItem>
        <MenuItem value={'xxA'}>albendazole</MenuItem>
        <MenuItem value={'IDA'}>
          ivermectin + albendazole + diethylcarbamazine
        </MenuItem>
      </Select>
    </FormControl>
  )
}
export default SettingDrugRegimen
