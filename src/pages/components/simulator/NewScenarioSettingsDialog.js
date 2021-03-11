import React, { /* useState */ } from 'react';
import {
  Grid,
  Typography,
} from '@material-ui/core';

import useStyles from 'pages/components/simulator/styles';

import ChartSettings from 'pages/components/simulator/ChartSettings';
import TextContents from 'pages/components/TextContents';
import { useTranslation } from 'react-i18next';

import {
  SettingName,
  SettingPrecision,
  SettingSpecificScenario,
} from 'pages/components/simulator/settings';

const NewScenarioSettingsDialog = ( props ) => {

  const classes = useStyles();
  const { t, i18n } = useTranslation();

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
          scenarioId={ props.scenarioData.id }
          scenarioLabel={ props.scenarioData.label }
        />

        {props.children}

        <TextContents>
          <Typography paragraph variant="body1" component="p">
             {t('specific')} { props.scenarioData.settings.specificPredictionIndex }
          </Typography>
        </TextContents>

        <SettingSpecificScenario
          scenarioId={ props.scenarioData.id }
          inModal={true}
        />

        { props.showPrecision &&
          <SettingPrecision
            scenarioId={ props.scenarioData.id }
            classAdd={classes.precision}
            inModal={true}
            label={t('precision')}
            setGraphTypeSimple={()=>{console.log('handling graph type simple');}}
          />
        }

      </ChartSettings>

    </Grid>

  );
};

export default NewScenarioSettingsDialog;
