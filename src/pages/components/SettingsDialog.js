import React, { /* useState */ } from 'react';
import {
  Box,
  Grid,
  Typography,
} from '@material-ui/core';

import useStyles from './simulator/styles';
import ChartSettings from './ChartSettings';
import TextContents from './TextContents';
import { useTranslation } from 'react-i18next';
import {
  SettingBedNetCoverage,
  SettingDrugRegimen,
  SettingFrequency,
  SettingInsecticideCoverage,
  SettingMosquitoType,
  SettingName,
  SettingPrecision,
  SettingSpecificScenario,
  SettingSystematicAdherence,
  SettingTargetCoverage,
  SettingMicrofilaricide,
  SettingMacrofilaricide,
  SettingfecRed
} from 'pages/components/simulator/settings';
import { useScenarioStore } from 'store/scenarioStore';

const SettingsDialog = ( props ) => {
  
  const { t } = useTranslation();

  const classes = useStyles();
  const { scenarioState } = useScenarioStore();

  const scenarioData = scenarioState.scenarioData[ props.scenarioId ];

  return (
    <Grid item md={6} xs={12}>

      <ChartSettings
        title={t('newScenario')}
        buttonText={t('createNewScenario')}
        cancelText={t('cancelChanges')}
        action={props.action}
        cancel={props.cancel}
        hideFab={true}
        newScenarioSettingsOpen={props.newScenarioSettingsOpen}
      >
        <TextContents>
          <Typography paragraph variant="body1" component="p">
            {t('simulate')}
          </Typography>
        </TextContents>

        <SettingName
          inModal={true}
          label={t('scenarioName')}
          scenarioId={ scenarioData.id }
          scenarioLabel={ scenarioData.label }
        />

        <SettingBedNetCoverage
          scenarioId={ scenarioData.id }
          inModal={true}
          label={t('bedNetCoverage')}
        />

        <SettingFrequency
          scenarioId={ scenarioData.id }
          inModal={true}
          label={t('treatmentFrequency')}
        />

        <SettingDrugRegimen
          scenarioId={ scenarioData.id }
          inModal={true}
          label={t('drugRegimen')}
        />

        <Box>
          <SettingMicrofilaricide
            scenarioId={ scenarioData.id }
            inModal={true}
            label={t('microfilaricide')}
          />
          <SettingMacrofilaricide
            scenarioId={ scenarioData.id }
            inModal={true}
            label={t('macrofilaricide')}
          />
          <SettingfecRed
            scenarioId={ scenarioData.id }
            inModal={true}
            label={t('fecRed')}
          />
        </Box>

        <SettingTargetCoverage
          scenarioId={ scenarioData.id }
          inModal={true}
          label={t('treatmentTargetCoverage')}
        />

        <SettingSystematicAdherence
          scenarioId={ scenarioData.id }
          inModal={true}
          label={t('systematicAdherence')}
        />

        {/* no longer in use <SettingBasePrevalence inModal={true} label="Base prevalence" /> */}
        {/* no longer in use <SettingNumberOfRuns inModal={true} label="Number of runs" /> */}

        <SettingInsecticideCoverage
          scenarioId={ scenarioData.id }
          inModal={true}
          label={t('insecticideCoverage')}
        />

        <SettingMosquitoType
          scenarioId={ scenarioData.id }
          inModal={true}
          label={t('mosquitoType')}
        />

        <TextContents>
          <Typography paragraph variant="body1" component="p">
           {t('specific')} { scenarioData.settings.specificPredictionIndex }
          </Typography>
        </TextContents>
        <SettingSpecificScenario
          scenarioId={ scenarioData.id }
          inModal={true}
        />

        <SettingPrecision
          scenarioId={ scenarioData.id }
          classAdd={classes.precision}
          inModal={true}
          label={t('precision')}
          setGraphTypeSimple={()=>{console.log('handling graph type simple');}}
        />

      </ChartSettings>

    </Grid>
  );
};

export default SettingsDialog;
