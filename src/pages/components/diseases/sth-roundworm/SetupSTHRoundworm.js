import React from 'react';
import { observer } from 'mobx-react';
import { Typography } from '@material-ui/core';
import { useSimulatorStore } from 'store/simulatorStore';
import useStyles from 'theme/Setup';
import PerDiseaseSetup from 'pages/components/PerDiseaseSetup';
import { useTranslation } from "react-i18next";

// settings
import {
  SettingFrequency,
  SettingTargetCoverage,
} from 'pages/components/simulator/settings';

const SetupSTHRoundworm = (props) => {
  console.log("SetupSTHRoundworm",props.disease)

  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const { simState } = useSimulatorStore();

  return (

    <PerDiseaseSetup disease={props.disease}>

      <div className={`${classes.formControlWrap} fullwidth`}>
        <div className={classes.setupFormControl}>
          <Typography paragraph variant="h3" component="p">
            {t('MDASettings')}
            </Typography>
        </div>
      </div>
    
      <div className={classes.formControlWrap}>
        <div className={classes.setupFormControl}>
          <SettingFrequency
            inModal={false}
            label={t('MDAFrequency')}
            value={simState.settings.mdaSixMonths}
            disease={props.disease}
          />
        </div>
      </div>

      <div className={classes.formControlWrap}>
        <div className={classes.setupFormControl}>
          <SettingTargetCoverage
            inModal={false}
            label={t('MDAInfants')}
            min={0}
            max={100}
            step={5}
            valueKey="coverageInfants"
            title={t('InfantsTitle')}
            value={simState.settings.coverageInfants}
          />
        </div>
      </div>
      <div className={classes.formControlWrap}>
        <div className={classes.setupFormControl}>
          <SettingTargetCoverage
            inModal={false}
            label={t('tMDAPreschoolext')}
            min={0}
            max={100}
            step={5}
            valueKey="coveragePreSAC"
            title={t('PreschoolTitle')}
            value={simState.settings.coveragePreSAC}
          />
        </div>
      </div>
      <div className={classes.formControlWrap}>
        <div className={classes.setupFormControl}>
          <SettingTargetCoverage
            inModal={false}
            label={t('MDASchoolAge')}
            min={0}
            max={100}
            step={5}
            valueKey="coverageSAC"
            title={t('SchoolAgeTitle')}
            value={simState.settings.coverageSAC}
          />
        </div>
      </div>
      <div className={classes.formControlWrap}>
        <div className={classes.setupFormControl}>
          <SettingTargetCoverage
            inModal={false}
            label={t('MDAAdults')}
            min={0}
            max={100}
            step={5}
            valueKey="coverageAdults"
            title={t('AdultsTitle')}
            value={simState.settings.coverageAdults}
          />
        </div>
      </div>

  
    </PerDiseaseSetup>
  );
}
export default observer( SetupSTHRoundworm );
