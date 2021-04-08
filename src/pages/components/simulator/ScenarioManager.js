/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react'
import { Box, CircularProgress, Grid, Tab, Tabs, Typography } from '@material-ui/core';
import PropTypes from 'prop-types'

import { useScenarioStore, ScenarioStoreConstants } from "store/scenarioStore";

import SessionStorage from 'pages/components/simulator/helpers/sessionStorage';
import ScenarioDisplay from 'pages/components/simulator/ScenarioDisplay';
import { useSimulatorStore } from 'store/simulatorStore';
import { useUIState } from 'hooks/stateHooks';
import useStyles from 'pages/components/simulator/styles';
import ConfirmationDialog from 'pages/components/ConfirmationDialog';

import AppConstants from 'AppConstants';
import DiseaseModels from 'pages/components/simulator/models/DiseaseModels';
import Evolving from 'pages/components/Evolving';

import { loadAllIUhistoricData } from 'pages/components/simulator/helpers/iuLoader'
import { NewSettingsDialogLF } from 'pages/components/diseases/lf';
import { NewSettingsDialogTrachoma } from 'pages/components/diseases/trachoma';
import { NewSettingsDialogSTHRoundworm } from 'pages/components/diseases/sth-roundworm';
import { DISEASE_LIMF, DISEASE_TRACHOMA, DISEASE_STH_ROUNDWORM } from 'AppConstants';
import { DISEASE_STH_WHIPWORM } from '../../../AppConstants';
import { useTranslation } from 'react-i18next';

const settingsDialogComponents = {
  [AppConstants.DISEASE_LIMF]: NewSettingsDialogLF,
  [AppConstants.DISEASE_TRACHOMA]: NewSettingsDialogTrachoma,
  [AppConstants.DISEASE_STH_ROUNDWORM]: NewSettingsDialogSTHRoundworm,
  [AppConstants.DISEASE_STH_WHIPWORM]: NewSettingsDialogSTHRoundworm,
  [AppConstants.DISEASE_STH_HOOKWORM]: NewSettingsDialogSTHRoundworm,
  [AppConstants.DISEASE_SCH_MANSONI]: NewSettingsDialogSTHRoundworm,
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Typography>
  )
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

/*
 * this is a Routed component so we have
 * history, location, match { params { country, iu } }
 */
const ScenarioManager = (props) => {

  const classes = useStyles();
  const { t } = useTranslation();

  const { simState, dispatchSimState } = useSimulatorStore();
  const { scenarioState, dispatchScenarioStateUpdate } = useScenarioStore();
  const { disease, country, implementationUnit: iu, section } = useUIState();

  /*
   * everything flows from the 'disease' key in the URL
   * work out which model to use, and init it with a
   * 'variant' (e.g. sth-roundworm, sth-whipworm etc)
   * if called for by the model
   */
  const diseaseModel = DiseaseModels[disease];
  if (diseaseModel.initModel) {
    diseaseModel.initModel(disease);
  }

  const [simInProgress, setSimInProgress] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [newScenarioSettingsOpen, setNewScenarioSettingsOpen] = useState(false);
  const [newScenarioId, setNewScenarioId] = useState(null);

  const getDefaultTabIndex = () => {
    const idx = scenarioState.scenarioKeys.findIndex(({ id, label }) => id === scenarioState.currentScenarioId);
    const defaultIdx = idx < 0 ? 0 : idx;
    return defaultIdx;
  };

  const [tabIndex, setTabIndex] = useState(getDefaultTabIndex());

  const createNewScenario = () => {

    const newScenarioData = diseaseModel.createNewScenario(simState.settings);

    console.log(`ScenarioManager created new ${disease} scenario with id ${newScenarioData.id} on UI request`);

    /*
     * ADD_SCENARIO_DATA = just add to memory,
     * don't save to storage or add to scenarioKeys
     */
    dispatchScenarioStateUpdate({
      type: ScenarioStoreConstants.ACTION_TYPES.ADD_SCENARIO_DATA,
      scenario: newScenarioData
    });

    setNewScenarioId(newScenarioData.id);
    setNewScenarioSettingsOpen(true);
  };

  const callbacks = {

    pleaseWaitCallback: () => {
      console.info(`✋ Please wait, running ${disease} simulation ...`);
    },

    progressCallback: (progress) => {
      setSimulationProgress(progress);
    },

    failureCallback: (msg) => {
      console.warn(`⛔️ Error running ${disease} model: ${msg}`);
    },

    resultCallback: (resultScenario, isNewScenario) => {

      delete resultScenario.isDirty;

      setSimInProgress(false);

      if (isNewScenario) {
        console.log(`ScenarioManager received new result scenario data from '${disease}' model, storing in scenario id ${resultScenario.id}`, resultScenario);

        dispatchScenarioStateUpdate({
          type: ScenarioStoreConstants.ACTION_TYPES.SET_NEW_SCENARIO_DATA,
          scenario: resultScenario
        });

      }

      else {
        console.log(`ScenarioManager received updated result scenario data from '${disease}' model, storing in scenario id ${resultScenario.id}`);

        dispatchScenarioStateUpdate({
          type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_DATA,
          scenario: resultScenario
        });
      }

      dispatchScenarioStateUpdate({
        type: ScenarioStoreConstants.ACTION_TYPES.SET_SCENARIO_KEYS,
        keys: SessionStorage.scenarioKeys // will have been internally updated by SessionStorage
      });

      switchScenario(resultScenario.id);

    }

  };

  const runCreatedScenario = () => {

    console.log(`ScenarioManager running newly-UI-created scenario ${newScenarioId} for disease ${disease}`);
    setNewScenarioSettingsOpen(false);

    // save the scenario
    dispatchScenarioStateUpdate({
      type: ScenarioStoreConstants.ACTION_TYPES.SAVE_SCENARIO_BY_ID,
      id: newScenarioId
    });

    // snag the data & id
    const scenarioData = scenarioState.scenarioData[newScenarioId];

    // tell the UI we're not in 'new scenario' any more
    setNewScenarioId(null);

    if (!simInProgress) {

      setSimInProgress(true);

      diseaseModel.runScenario({
        scenarioId: scenarioData.id,
        scenarioState,
        simState,
        simInProgress,
        setSimInProgress,
        callbacks
      });
    }
  };

  const cancelCreatedScenario = () => {

    console.log(`ScenarioManager cancelling newly-UI-created scenario ${newScenarioId} for disease ${disease}`);
    setNewScenarioSettingsOpen(false);

    dispatchScenarioStateUpdate({
      type: ScenarioStoreConstants.ACTION_TYPES.REMOVE_SCENARIO_BY_ID,
      id: newScenarioId
    });

    setNewScenarioId(null);
    setTabIndex(getDefaultTabIndex());

  };

  const runNewScenario = () => {

    console.log(`ScenarioManager auto-running new scenario for disease ${disease}`);

    if (scenarioState.scenarioKeys.length > 5 && !simInProgress) {
      alert(t('alertText1'));
      return;
    }

    if (!simInProgress) {

      setSimInProgress(true);

      diseaseModel.runScenario({
        scenarioId: false,
        scenarioState,
        simState,
        simInProgress,
        setSimInProgress,
        callbacks
      });
    }

  };

  const runCurrentScenario = () => {

    console.log(`ScenarioManager re-running current scenario ${scenarioState.currentScenarioId}`);

    if (!simInProgress) {

      setSimInProgress(true);

      diseaseModel.runScenario({
        scenarioId: scenarioState.currentScenarioId,
        scenarioState,
        simState,
        simInProgress,
        setSimInProgress,
        callbacks
      });

    }

  };

  const resetCurrentScenario = () => {
    resetScenario(scenarioState.currentScenarioId);
  };

  const switchScenario = (scenarioId) => {

    try {

      const newScenarioData = scenarioState.scenarioData[scenarioId];

      dispatchScenarioStateUpdate({
        type: ScenarioStoreConstants.ACTION_TYPES.SWITCH_SCENARIO_BY_ID,
        id: scenarioId
      });

      if (diseaseModel.prepScenarioAndParams) {
        diseaseModel.prepScenarioAndParams(scenarioId, scenarioState, simState);
      }

      console.log(`ScenarioManager switched scenario to ${newScenarioData.id}: "${newScenarioData.label}"`);
    }

    catch (e) {
      // TODO display error message somehow
    }

  };

  const confirmRemoveCurrentScenario = () => {
    if (!simInProgress) {
      setConfirmationOpen(true)
    }
  };

  const confirmedRemoveCurrentScenario = () => {
    if (!simInProgress) {
      setConfirmationOpen(false);
      removeScenario(scenarioState.currentScenarioId);
    }
  };

  const resetScenario = (scenarioId) => {
    console.log(`ScenarioManager resetting scenario ${scenarioId}`);
    const scenario = SessionStorage.fetchScenario(scenarioId);
    dispatchScenarioStateUpdate({
      type: ScenarioStoreConstants.ACTION_TYPES.SET_LOADED_SCENARIO_DATA,
      scenario: scenario
    });
  };

  const removeScenario = (scenarioId) => {

    dispatchScenarioStateUpdate({
      type: ScenarioStoreConstants.ACTION_TYPES.REMOVE_SCENARIO_BY_ID,
      id: scenarioId
    });


  };

  const handleTabChange = (event, newTabIndex) => {

    if (scenarioState.scenarioKeys[newTabIndex] && scenarioState.scenarioKeys[newTabIndex].id !== scenarioState.currentScenarioId) {
      switchScenario(scenarioState.scenarioKeys[newTabIndex].id);
    }

    setTabIndex(newTabIndex);

  };

  // set tab index correctly when scenarioId is changed
  useEffect(

    () => {

      if (!scenarioState.currentScenarioId) {
        return;
      }

      const currentScenarioIndexInKeys = scenarioState.scenarioKeys.findIndex(({ id, label }) => id === scenarioState.currentScenarioId);

      if (currentScenarioIndexInKeys !== -1) {
        setTabIndex(currentScenarioIndexInKeys);
      }

    },

    [scenarioState.currentScenarioId]
  );

  // 2nd-arg empty array makes this a componentDidMount equivalent - only re-run if {nothing} changes
  useEffect(
    () => {
      console.log("ScenarioManager mounting");

      if (!diseaseModel) {
        return;
      }

      if (!(simState && simState.IUData && simState.IUData.id === iu)) {

        console.log(`ScenarioManager found no stored simulator state`);
        SessionStorage.simulatorState = null;

        (async () => {
          console.log(`ScenarioManager calling loadAllIUhistoricData for ${iu} / ${disease} in ${country}`);
          await loadAllIUhistoricData(
            simState,
            dispatchSimState,
            iu, //implementationUnit,
            disease
          )
          console.log(`ScenarioManager loaded historic data for ${iu} / ${disease} in ${country}`);
        })();

        return;
      }

      const scenarioKeys = SessionStorage.scenarioKeys;

      // load any stored scenario keys into state
      dispatchScenarioStateUpdate({
        type: ScenarioStoreConstants.ACTION_TYPES.SET_SCENARIO_KEYS,
        keys: scenarioKeys
      });

      // any keys found
      if (scenarioKeys.length) {

        // load the data
        scenarioKeys.forEach(
          (scenarioKey) => {
            const scenario = SessionStorage.fetchScenario(scenarioKey.id);
            dispatchScenarioStateUpdate({
              type: ScenarioStoreConstants.ACTION_TYPES.SET_LOADED_SCENARIO_DATA,
              scenario: scenario
            });
          }
        );

        // switch to the first one
        dispatchScenarioStateUpdate({
          type: ScenarioStoreConstants.ACTION_TYPES.SWITCH_SCENARIO_BY_ID,
          id: scenarioKeys[0].id
        });

      }

      // none loaded - make a new one
      else {
        console.log("ScenarioManager found no stored scenarios");
        runNewScenario();
      }

    },

    []
  );
  // debug
  //Scenario state last updated: {scenarioState.updated.toISOString()}

  if (!diseaseModel) {
    return (<div>No model for {AppConstants.DISEASE_LABELS[disease]}</div>);
  }

  const SettingsDialogComponent = (disease !== null) ? settingsDialogComponents[disease] : null;
  const STH = (![AppConstants.DISEASE_LIMF, AppConstants.DISEASE_TRACHOMA].includes(disease));
  return (
    <div id="ScenarioManager">
      <section className={classes.simulator}>

        <Grid container spacing={0}>

          <Grid item xs={12} className={classes.tabs}>

            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              aria-label="Available scenarios"
              indicatorColor="secondary"
              textColor="secondary"
              variant="scrollable"
              scrollButtons="auto"
            >
              {
                scenarioState.scenarioKeys.map(
                  ({ id, label }, idx) => {
                    return (
                      <Tab
                        key={id}
                        label={scenarioState.scenarioData[id].label}
                        {...a11yProps(idx)}
                      />
                    );
                  }
                )
              }

              {scenarioState.scenarioKeys.length < 5 && (
                <Tab
                  className={classes.addScenario}
                  key={`tab-element-99`}
                  label={t('addScenario')}
                  disabled={simInProgress}
                  onClick={createNewScenario}
                />
              )}
            </Tabs>

          </Grid>

        </Grid>

        <Grid item md={12} xs={12} className={classes.chartContainer}>
          <TabPanel
            key={`scenario-result-${props.scenarioId}`}
            value={tabIndex}
            index={tabIndex}
          >
            <ScenarioDisplay
              scenarioKeys={scenarioState.scenarioKeys}
              resetCurrentScenario={resetCurrentScenario}
              runCurrentScenario={runCurrentScenario}
              simInProgress={simInProgress}
              confirmRemoveCurrentScenario={confirmRemoveCurrentScenario}
            />

          </TabPanel>

          <ConfirmationDialog
            title={t('deleteScenario')}
            onClose={() => {
              setConfirmationOpen(false);
            }}
            onConfirm={confirmedRemoveCurrentScenario}
            open={confirmationOpen}
          />

          {(simInProgress) && ( STH || disease === AppConstants.DISEASE_TRACHOMA ) && (

            <div className={classes.progress}>
              <CircularProgress
                variant="indeterminate"
                value={simulationProgress}
                color="primary"
              />

              <Typography paragraph variant="body1" component="p" align="center">
                {t('calculating')}
              </Typography>

            </div>
          )}
          {(simulationProgress !== 0 && simulationProgress !== 100) && (disease === AppConstants.DISEASE_LIMF ) && (

            <div className={classes.progress}>
              <CircularProgress
                variant="determinate"
                value={simulationProgress}
                color="primary"
              />

              <Typography paragraph variant="body1" component="p" align="center">
                {t('calculating')}
              </Typography>

            </div>
          )}
        </Grid>
      </section>

      {
        (newScenarioSettingsOpen && newScenarioId)
          ? <SettingsDialogComponent
            scenarioData={scenarioState.scenarioData[newScenarioId]}
            action={runCreatedScenario}
            cancel={cancelCreatedScenario}
            newScenarioSettingsOpen={newScenarioSettingsOpen}
            disease={disease}
          />
          : null
      }

      <Evolving />
    </div>

  );
}

export default observer(ScenarioManager);
