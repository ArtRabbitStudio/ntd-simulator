import React, { /* useState */ } from 'react';
import {
  Grid,
  Typography,
} from '@material-ui/core';

import useStyles from './simulator/styles';
import ChartSettings from './ChartSettings';
import TextContents from './TextContents';
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
} from './simulator/settings';
import { useScenarioStore } from '../../store/scenarioStore';

const SettingsDialog = ( props ) => {

  const classes = useStyles();
  const { scenarioState } = useScenarioStore();

  const scenarioData = scenarioState.scenarioData[ props.scenarioId ];

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
        closeCallback={props.closeCallback}
      >
        <TextContents>
          <Typography paragraph variant="body1" component="p">
            What scenario do you want to simulate?
          </Typography>
        </TextContents>

        <SettingName
          inModal={true}
          label="Scenario name"
          scenarioId={ scenarioData.id }
          scenarioLabel={ scenarioData.label }
        />

        <SettingBedNetCoverage
          scenarioId={ scenarioData.id }
          inModal={true}
          label="Bed Net Coverage"
        />

        <SettingFrequency
          scenarioId={ scenarioData.id }
          inModal={true}
          label="Treatment frequency"
        />

        <SettingDrugRegimen
          scenarioId={ scenarioData.id }
          inModal={true}
          label="Drug regimen"
        />

        <SettingTargetCoverage
          scenarioId={ scenarioData.id }
          inModal={true}
          label="Treatment target coverage"
        />

        <SettingSystematicAdherence
          scenarioId={ scenarioData.id }
          inModal={true}
          label="Systematic adherence"
        />

        {/* no longer in use <SettingBasePrevalence inModal={true} label="Base prevalence" /> */}
        {/* no longer in use <SettingNumberOfRuns inModal={true} label="Number of runs" /> */}

        <SettingInsecticideCoverage
          scenarioId={ scenarioData.id }
          inModal={true}
          label="Insecticide Coverage"
        />

        <SettingMosquitoType
          scenarioId={ scenarioData.id }
          inModal={true}
          label="Mosquito type"
        />

        <TextContents>
          <Typography paragraph variant="body1" component="p">
            Are you interested in a specific scenario? { scenarioState.scenarioData[ scenarioState.currentScenarioId ].specificPredictionIndex }
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
          label="Precision (runs)"
          setGraphTypeSimple={()=>{console.log('handling graph type simple');}}
        />

      </ChartSettings>

    </Grid>
  );
};

export default SettingsDialog;
