import React, { /* useState */ } from 'react';

import NewScenarioSettingsDialog from 'pages/components/simulator/NewScenarioSettingsDialog';
import { useTranslation } from "react-i18next";

import {
  SettingFrequency,
  SettingTargetCoverage,
} from 'pages/components/simulator/settings';

const NewSettingsDialogSTHRoundworm = ( { scenarioData, action, cancel, newScenarioSettingsOpen,disease } ) => {
  console.log("NewSettingsDialog",disease)
  const { t, i18n } = useTranslation();
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
        label={t('treatmentFrequency')}
        disease={disease}
      />

      <SettingTargetCoverage
        scenarioId={ scenarioData.id }
        inModal={true}
        label={t('MDAInfants')}
        min={0}
        max={100}
        step={5}
        valueKey="coverageInfants"
        title={t('InfantsTitle')}
      />
  
      <SettingTargetCoverage
        scenarioId={ scenarioData.id }
        inModal={true}
        label={t('MDAPreschool')}
        min={0}
        max={100}
        step={5}
        valueKey="coveragePreSAC"
        title={t('PreschoolTitle')}
      />
  
      <SettingTargetCoverage
        scenarioId={ scenarioData.id }
        inModal={true}
        label={t('MDASchoolAge')}
        min={0}
        max={100}
        step={5}
        valueKey="coverageSAC"
        title={t('SchoolAgeTitle')}
      />
    
      <SettingTargetCoverage
        scenarioId={ scenarioData.id }
        inModal={true}
        label={t('MDAAdults')}
        min={0}
        max={100}
        step={5}
        valueKey="coverageAdults"
        title={t('AdultsTitle')}
      />




    </NewScenarioSettingsDialog>

  );
};

export default NewSettingsDialogSTHRoundworm;
