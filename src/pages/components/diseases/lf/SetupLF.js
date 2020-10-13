import React from 'react';
import { observer } from 'mobx-react';
import { Typography } from '@material-ui/core';
import { useSimulatorStore } from 'store/simulatorStore';
import useStyles from 'theme/Setup';
import PerDiseaseSetup from 'pages/components/PerDiseaseSetup';

// settings
import {
  SettingFrequency,
  SettingTargetCoverage,
  SettingDrugRegimen,
  SettingMosquitoType,
  SettingBedNetCoverage,
  SettingInsecticideCoverage,
  SettingSystematicAdherence,
} from 'pages/components/simulator/settings';


const SetupLF = (props) => {

  const classes = useStyles();
  const { simState, dispatchSimState } = useSimulatorStore();

  return (

    <PerDiseaseSetup disease={props.disease}>

      <div className={classes.formControlWrap}>
        <div className={classes.setupFormControl}>
          <Typography paragraph variant="h3" component="p">
            Environmental factors
            </Typography>
        </div>
      </div>

      <div className={classes.formControlWrap}>
        <div className={classes.setupFormControl}>
          <Typography paragraph variant="h3" component="p">
            MDA settings
            </Typography>
        </div>
      </div>

      <div className={classes.formControlWrap}>
        <div className={classes.setupFormControl}>
          <SettingBedNetCoverage inModal={false} label="Bed Net Coverage" value={simState.settings.covN} />
        </div>
      </div>

      <div className={classes.formControlWrap}>
        <div className={classes.setupFormControl}>
          <SettingFrequency
            inModal={false}
            label="MDA Frequency"
            value={simState.settings.mdaSixMonths}
          />
        </div>
      </div>

      <div className={classes.formControlWrap}>
        <div className={classes.setupFormControl}>
          <SettingMosquitoType inModal={false} label="Type of Mosquito" value={simState.settings.species} />
        </div>
      </div>

      <div className={classes.formControlWrap}>
        <div className={classes.setupFormControl}>
          <SettingTargetCoverage
            inModal={false}
            label="MDA Target Coverage"
            value={simState.settings.coverage}
          />
        </div>
      </div>

      <div className={classes.formControlWrap}>
        <div className={classes.setupFormControl}>
          <SettingInsecticideCoverage inModal={false} label="Inseticide Coverage" value={simState.settings.v_to_hR} />
        </div>
      </div>

      <div className={classes.formControlWrap}>
        <div className={classes.setupFormControl}>
          <SettingDrugRegimen
            inModal={false}
            label="MDA Drug Regimen"
            value={simState.settings.mdaRegimen}
          />
        </div>
      </div>

      <div className={`${classes.formControlWrap} fullwidth`}>
        <div className={classes.setupFormControl}>
          <SettingSystematicAdherence
            inModal={false}
            label="Systematic adherence"
            onChange={(event, newValue) => {
              dispatchSimState({ type: 'rho', payload: newValue })
            }}
            value={simState.settings.rho}
          />
        </div>
      </div>

    </PerDiseaseSetup>
  );
}
export default observer( SetupLF );
