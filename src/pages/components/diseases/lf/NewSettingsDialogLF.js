import React, { /* useState */ } from 'react';

import NewScenarioSettingsDialog from 'pages/components/simulator/NewScenarioSettingsDialog';

import {
  SettingBedNetCoverage,
  SettingDrugRegimen,
  SettingFrequency,
  SettingInsecticideCoverage,
  SettingMosquitoType,
  SettingSystematicAdherence,
  SettingTargetCoverage,
} from 'pages/components/simulator/settings';

const NewSettingsDialogLF = ( { scenarioData, action, cancel, newScenarioSettingsOpen } ) => {

  return (

    <NewScenarioSettingsDialog
      action={ action }
      cancel={ cancel }
      scenarioData={ scenarioData }
      newScenarioSettingsOpen={ newScenarioSettingsOpen }>

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

    </NewScenarioSettingsDialog>

  );
};

export default NewSettingsDialogLF;
