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
  SettingSystematicAdherence,
} from 'pages/components/simulator/settings';

const SetupTrachoma = (props) => {

  const classes = useStyles();
  const { simState, dispatchSimState } = useSimulatorStore();

  return (

    <PerDiseaseSetup>

      <div className={`${classes.formControlWrap} fullwidth`}>
        <div className={classes.setupFormControl}>
          <Typography paragraph variant="h3" component="p">
            MDA Settings
            </Typography>
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
          <SettingTargetCoverage
            inModal={false}
            label="MDA Target Coverage"
            value={simState.settings.coverage}
          />
        </div>
      </div>

  
    </PerDiseaseSetup>
  );
}
export default observer( SetupTrachoma );
