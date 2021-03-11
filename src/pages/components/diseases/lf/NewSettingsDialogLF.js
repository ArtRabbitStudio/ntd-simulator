import React, { /* useState */ } from 'react';

import NewScenarioSettingsDialog from 'pages/components/simulator/NewScenarioSettingsDialog';
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation();

  return (

    <NewScenarioSettingsDialog
      action={ action }
      cancel={ cancel }
      scenarioData={ scenarioData }
      newScenarioSettingsOpen={ newScenarioSettingsOpen }
      showPrecision={ false }
    >

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

    </NewScenarioSettingsDialog>

  );
};

export default NewSettingsDialogLF;
