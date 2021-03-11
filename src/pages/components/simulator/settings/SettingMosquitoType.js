import React from 'react';
import useStyles from "pages/components/simulator/styles";

import { useSimulatorStore } from "store/simulatorStore";
import { useScenarioStore, ScenarioStoreConstants } from "store/scenarioStore";
import { useTranslation } from 'react-i18next';

import {
  FormControl,
  RadioGroup,
  Radio,
  FormLabel,
  FormControlLabel,
  Tooltip
} from "@material-ui/core";

const SettingMosquitoType = ({ inModal, value, label, scenarioId }) => {
const { t, i18n } = useTranslation();
  const classes = useStyles();
  const { dispatchSimState } = useSimulatorStore();
  const { scenarioState, dispatchScenarioStateUpdate } = useScenarioStore();

  const isPerIUSetting = value !== null && typeof value !== 'undefined';

  scenarioId = scenarioId ? scenarioId : scenarioState.currentScenarioId;

  /* TODO FIXME */

  return (
    <FormControl fullWidth className={classes.formControlSelect}>
       <Tooltip
        title={t('whichMosquito')}
        aria-label="info"
      >
      <FormLabel 
      component="legend"
      className={
        inModal
          ? classes.withHelp
          : `${classes.centered} ${classes.withHelp}`
      }
      >{label}
      </FormLabel>
      </Tooltip>
      <RadioGroup
        className={inModal ? '' : classes.imageOptions}
        row
        aria-label="Species"
        name="species"
        value={ isPerIUSetting ? value : scenarioState.scenarioData[ scenarioId ].settings.species}
        onChange={(event) => {
          if ( isPerIUSetting ) {
            dispatchSimState({
              type: "species",
              payload: Number(event.target.value),
            });
          }
          else {
            dispatchScenarioStateUpdate( {
              type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_SETTING_BY_ID,
              id: scenarioId,
              key: 'species',
              value: Number(event.target.value),
            } );
          }
        }}
      >
        <FormControlLabel
          className={`${inModal ? '' : classes.imageOption} anopheles`}
          value={0}
          control={<Radio color="primary" />}
          label="Anopheles"
        />
        <FormControlLabel
          className={`${inModal ? '' : classes.imageOption} culex`}
          value={1}
          control={<Radio color="primary" />}
          label="Culex"
        />
      </RadioGroup>
    </FormControl>
  )
}
export default SettingMosquitoType;
