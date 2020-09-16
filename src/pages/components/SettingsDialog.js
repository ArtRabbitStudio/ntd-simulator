import React, { /* useState */ } from 'react';
import {
  Grid,
  Typography,
} from '@material-ui/core';

//import useStyles from './simulator/styles';
import ChartSettings from './ChartSettings';
import TextContents from './TextContents';
import {
  SettingBedNetCoverage,
  SettingDrugRegimen,
  SettingFrequency,
  SettingInsecticideCoverage,
  SettingMosquitoType,
  SettingName,
//  SettingPrecision,
  SettingSpecificScenario,
  SettingSystematicAdherence,
  SettingTargetCoverage,
} from './simulator/settings';
import { useScenarioStore } from '../../store/scenarioStore';

const SettingsDialog = ( props ) => {

//  const classes = useStyles();
  const { scenarioState } = useScenarioStore();
//  const [ graphMetric, setGraphMetric ] = useState( 'Ms' );

  const scenarioData = props.scenarioData;

  return (
    <Grid item md={6} xs={12}>

      SETTINGS DIALOG

      <ChartSettings
        title="Edit scenario"
        buttonText="Update Scenario"
        cancelText="Cancel Changes"
        cancel={()=> {console.log('resetCurrentScenario??'); /*props.resetCurrentScenario*/}}
        action={()=> {console.log('runCurrentScenario??'); /*props.runCurrentScenario*/}}
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
          inModal={true}
          label="Bed Net Coverage"
        />
        <SettingFrequency inModal={true} label="Treatment frequency" />
        <SettingDrugRegimen inModal={true} label="Drug regimen" />
        <SettingTargetCoverage
          inModal={true}
          label="Treatment target coverage"
        />
        <SettingSystematicAdherence
          inModal={true}
          label="Systematic adherence"
        />
        {/* no longer in use <SettingBasePrevalence inModal={true} label="Base prevalence" /> */}
        {/* no longer in use <SettingNumberOfRuns inModal={true} label="Number of runs" /> */}
        <SettingInsecticideCoverage
          inModal={true}
          label="Insecticide Coverage"
        />
        <SettingMosquitoType inModal={true} label="Mosquito type" />
        <TextContents>
          <Typography paragraph variant="body1" component="p">
            Are you interested in a specific scenario? { scenarioState.scenarioData[ scenarioState.currentScenarioId ].specificPredictionIndex }
          </Typography>
        </TextContents>
        <SettingSpecificScenario inModal={true} />
      </ChartSettings>

    </Grid>
  );
};

export default SettingsDialog;
