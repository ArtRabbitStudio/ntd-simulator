import React, { /* useState */ } from 'react';
import {
  Box,
} from '@material-ui/core';
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
  SettingMicrofilaricide,
  SettingMacrofilaricide,
  SettingfecRed
} from 'pages/components/simulator/settings';

const NewSettingsDialogLF = ( { scenarioData, action, cancel, newScenarioSettingsOpen } ) => {
  const { t } = useTranslation();

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

      {scenarioData.settings.mdaRegimen === 'custom' && <Box>
          <SettingMicrofilaricide
            scenarioId={ scenarioData.id }
            inModal={true}
            label={t('microfilaricide')}
          />
          <SettingMacrofilaricide
            scenarioId={ scenarioData.id }
            inModal={true}
            label={t('macrofilaricide')}
          />
          <SettingfecRed
            scenarioId={ scenarioData.id }
            inModal={true}
            label={t('fecRed')}
          />
      </Box>}

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
