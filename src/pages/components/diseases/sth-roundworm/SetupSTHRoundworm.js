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
} from 'pages/components/simulator/settings';

const SetupSTHRoundworm = (props) => {

  const classes = useStyles();
  const { simState } = useSimulatorStore();

  return (

    <PerDiseaseSetup disease={props.disease}>

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
            label="MDA Target Coverage Infants"
            min={0}
            max={100}
            step={5}
            valueKey="coverageInfants"
            title="Proportion of infants that will be treated."
            value={simState.settings.coverageInfants}
          />
        </div>
      </div>
      <div className={classes.formControlWrap}>
        <div className={classes.setupFormControl}>
          <SettingTargetCoverage
            inModal={false}
            label="MDA Target Coverage Preschool Children"
            min={0}
            max={100}
            step={5}
            valueKey="coveragePreSAC"
            title="Proportion of preschool age children that will be treated."
            value={simState.settings.coveragePreSAC}
          />
        </div>
      </div>
      <div className={classes.formControlWrap}>
        <div className={classes.setupFormControl}>
          <SettingTargetCoverage
            inModal={false}
            label="MDA Target Coverage School-Age Children "
            min={0}
            max={100}
            step={5}
            valueKey="coverageSAC"
            title="Proportion of school-age children that will be treated."
            value={simState.settings.coverageSAC}
          />
        </div>
      </div>
      <div className={classes.formControlWrap}>
        <div className={classes.setupFormControl}>
          <SettingTargetCoverage
            inModal={false}
            label="MDA Target Coverage Adults"
            min={0}
            max={100}
            step={5}
            valueKey="coverageAdults"
            title="Proportion of adults that will be treated."
            value={simState.settings.coverageAdults}
          />
        </div>
      </div>

  
    </PerDiseaseSetup>
  );
}
export default observer( SetupSTHRoundworm );
