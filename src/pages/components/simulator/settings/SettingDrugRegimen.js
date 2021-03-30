import React from 'react'
import useStyles from 'pages/components/simulator/styles'

import { useSimulatorStore } from 'store/simulatorStore'
import { useScenarioStore, ScenarioStoreConstants } from "store/scenarioStore";

import { FormControl, Select, FormLabel, MenuItem,Tooltip } from '@material-ui/core'
import { useTranslation } from "react-i18next";

const SettingDrugRegimen = ({ inModal, label, value, onChange, classAdd, scenarioId }) => {
  const { t } = useTranslation();
  const classes = useStyles()
  const { dispatchSimState } = useSimulatorStore()
  const { scenarioState, dispatchScenarioStateUpdate } = useScenarioStore();

  // console.log('in drop down simState.mdaRegimen', simState.mdaRegimen)

  const isPerIUSetting = value !== null && typeof value !== 'undefined';

  scenarioId = scenarioId ? scenarioId : scenarioState.currentScenarioId;

  /* TODO FIXME */
  const handleChange = (event) => {

    if ( isPerIUSetting ) {
      dispatchSimState({
        type: 'mdaRegimen',
        payload: event.target.value,
      })
    }

    else {
      dispatchScenarioStateUpdate( {
        type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_SETTING_BY_ID,
        id: scenarioId,
        key: 'mdaRegimen',
        value: event.target.value
      } );
    }
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
        title={t('chooseDrugRegimen')}
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
        value={ isPerIUSetting ? value : scenarioState.scenarioData[ scenarioId ].settings.mdaRegimen }
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
