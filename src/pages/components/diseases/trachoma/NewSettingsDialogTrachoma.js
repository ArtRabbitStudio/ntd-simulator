import React, { /* useState */ } from 'react';

import NewScenarioSettingsDialog from 'pages/components/simulator/NewScenarioSettingsDialog';

import {
  SettingFrequency,
  SettingTargetCoverage,
  SettingSystematicAdherence,
} from 'pages/components/simulator/settings';

const NewSettingsDialogTrachoma = ( { scenarioData, action, cancel, newScenarioSettingsOpen } ) => {

  return (

    <NewScenarioSettingsDialog
      action={ action }
      cancel={ cancel }
      scenarioData={ scenarioData }
      newScenarioSettingsOpen={ newScenarioSettingsOpen }
      showPrecision={ false }
    >

      <SettingFrequency
        scenarioId={ scenarioData.id }
        inModal={true}
        label="Treatment frequency"
      />

      <SettingTargetCoverage
        scenarioId={ scenarioData.id }
        inModal={true}
        min={60}
        max={90}
        step={10}
        label="Treatment target coverage"
      />


    </NewScenarioSettingsDialog>

  );
};

export default NewSettingsDialogTrachoma;
