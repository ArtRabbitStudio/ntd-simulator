import React, { /* useState */ } from 'react';

import NewScenarioSettingsDialog from 'pages/components/simulator/NewScenarioSettingsDialog';

import {
  SettingFrequency,
  SettingTargetCoverage,
} from 'pages/components/simulator/settings';

const NewSettingsDialogSTHRoundworm = ( { scenarioData, action, cancel, newScenarioSettingsOpen } ) => {

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
        label="MDA Target Coverage Infants"
        min={0}
        max={100}
        step={5}
        valueKey="coverageInfants"
        title="Proportion of infants that will be treated."
      />
  
      <SettingTargetCoverage
        scenarioId={ scenarioData.id }
        inModal={true}
        label="MDA Target Coverage Preschool Children"
        min={0}
        max={100}
        step={5}
        valueKey="coveragePreSAC"
        title="Proportion of preschool age children that will be treated."
      />
  
      <SettingTargetCoverage
        scenarioId={ scenarioData.id }
        inModal={true}
        label="MDA Target Coverage School-Age Children "
        min={0}
        max={100}
        step={5}
        valueKey="coverageSAC"
        title="Proportion of school-age children that will be treated."
      />
    
      <SettingTargetCoverage
        scenarioId={ scenarioData.id }
        inModal={true}
        label="MDA Target Coverage Adults"
        min={0}
        max={100}
        step={5}
        valueKey="coverageAdults"
        title="Proportion of adults that will be treated."
      />




    </NewScenarioSettingsDialog>

  );
};

export default NewSettingsDialogSTHRoundworm;
