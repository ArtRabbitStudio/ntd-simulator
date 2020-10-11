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
        label="Treatment target coverage"
      />

      <SettingSystematicAdherence
        scenarioId={ scenarioData.id }
        inModal={true}
        label="Systematic adherence"
      />

    </NewScenarioSettingsDialog>

  );
};

export default NewSettingsDialogTrachoma;
