import React, { /* useState */ } from 'react';

import NewScenarioSettingsDialog from 'pages/components/simulator/NewScenarioSettingsDialog';
import { useTranslation } from "react-i18next";

import {
  SettingFrequency,
  SettingTargetCoverage,
} from 'pages/components/simulator/settings';

const NewSettingsDialogTrachoma = ( { scenarioData, action, cancel, newScenarioSettingsOpen } ) => {
  const { t } = useTranslation();

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
      />

      <SettingTargetCoverage
        scenarioId={ scenarioData.id }
        inModal={true}
        min={60}
        max={90}
        step={10}
        label={t('treatmentTargetCoverage')}
      />


    </NewScenarioSettingsDialog>

  );
};

export default NewSettingsDialogTrachoma;
