import React, { /* useState */ } from 'react';
import {
  Grid,
  Typography,
} from '@material-ui/core';

import useStyles from 'pages/components/simulator/styles';

import ChartSettings from 'pages/components/simulator/ChartSettings';
import TextContents from 'pages/components/TextContents';

import {
  SettingName,
  SettingPrecision,
  SettingSpecificScenario,
} from 'pages/components/simulator/settings';

const NewScenarioSettingsDialog = ( props ) => {

  const classes = useStyles();

  return (

    <Grid item md={6} xs={12}>

      <ChartSettings
        title="New scenario"
        buttonText="Create New Scenario"
        cancelText="Cancel Changes"
        action={props.action}
        cancel={props.cancel}
        hideFab={true}
        newScenarioSettingsOpen={props.newScenarioSettingsOpen}
      >

        <TextContents>
          <Typography paragraph variant="body1" component="p">
            What scenario do you want to simulate?
          </Typography>
        </TextContents>

        <SettingName
          inModal={true}
          label="Scenario name"
          scenarioId={ props.scenarioData.id }
          scenarioLabel={ props.scenarioData.label }
        />

        {props.children}

        <TextContents>
          <Typography paragraph variant="body1" component="p">
            Are you interested in a specific scenario? { props.scenarioData.settings.specificPredictionIndex }
          </Typography>
        </TextContents>

        <SettingSpecificScenario
          scenarioId={ props.scenarioData.id }
          inModal={true}
        />

        <SettingPrecision
          scenarioId={ props.scenarioData.id }
          classAdd={classes.precision}
          inModal={true}
          label="Precision (runs)"
          setGraphTypeSimple={()=>{console.log('handling graph type simple');}}
        />

      </ChartSettings>

    </Grid>

  );
};

export default NewScenarioSettingsDialog;
