/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid, Tab, Tabs, Typography } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types'

import { useScenarioStore, ScenarioStoreConstants } from "store/scenarioStore";

import SessionStorage from 'pages/components/simulator/helpers/sessionStorage';
import SimulatorDisplay from 'pages/SimulatorDisplay';
import { useSimulatorStore } from 'store/simulatorStore';
import { useUIState } from 'hooks/stateHooks';
import useStyles from 'pages/components/simulator/styles';
import { Layout } from 'layout';
import HeadWithInputs from 'pages/components/HeadWithInputs';
import SelectCountry from 'pages/components/SelectCountry';
import ConfirmationDialog from 'pages/components/ConfirmationDialog';
import SettingsDialog from 'pages/components/SettingsDialog';

import DiseaseModels from 'pages/components/simulator/models/DiseaseModels';

import { loadAllIUhistoricData } from 'pages/components/simulator/helpers/iuLoader'

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
const SimulatorManager = ( props ) => {

  const classes = useStyles();

  const { simState, dispatchSimState } = useSimulatorStore();
  const { scenarioState, dispatchScenarioStateUpdate } = useScenarioStore();
  const { disease } = useUIState();

  const diseaseModel = DiseaseModels[ disease ];

  const [ simInProgress, setSimInProgress ] = useState( false );
  const [ simulationProgress, setSimulationProgress ] = useState( 0 );
  const [ confirmationOpen, setConfirmationOpen ] = useState( false );
  const [ newScenarioSettingsOpen, setNewScenarioSettingsOpen ] = useState( false );
  const [ newScenarioId, setNewScenarioId ] = useState( null );

  const getDefaultTabIndex = () => {
    const idx = scenarioState.scenarioKeys.findIndex( ( { id, label } ) => id === scenarioState.currentScenarioId );
    const defaultIdx = idx < 0 ? 0 : idx;
    return defaultIdx;
  };

  const [ tabIndex, setTabIndex ] = useState( getDefaultTabIndex() );

  const createNewScenario = () => {

    const label = new Date().toISOString().split('T').join(' ').replace(/\.\d{3}Z/, '');
    const id = uuidv4();

    const newScenarioData = {
      id,
      label,
      settings: { ...simState.settings } // should this be here or in the initScenario?
    };

    console.log( `SimulatorManager created new scenario id ${newScenarioData.id} on UI request` );

    const initedScenarioData = diseaseModel.initScenario( newScenarioData );

    /*
     * ADD_SCENARIO_DATA = just add to memory,
     * don't save to storage or add to scenarioKeys
     */
    dispatchScenarioStateUpdate( {
      type: ScenarioStoreConstants.ACTION_TYPES.ADD_SCENARIO_DATA,
      scenario: initedScenarioData
    } );

    setNewScenarioId( initedScenarioData.id );
    setNewScenarioSettingsOpen( true );
  };

  const callbacks = {

    progressCallback: ( progress ) => {
      setSimulationProgress( progress );
    },

    resultCallback: ( resultScenario, isNewScenario ) => {

      delete resultScenario.isDirty;

      setSimInProgress( false );

      if( isNewScenario ) {
        console.log( `SimulatorManager received new result scenario data from '${disease}' model, storing in scenario id ${resultScenario.id}` );

        dispatchScenarioStateUpdate( {
          type: ScenarioStoreConstants.ACTION_TYPES.SET_NEW_SCENARIO_DATA,
          scenario: resultScenario
        } );

      }

      else {
        console.log( `SimulatorManager received updated result scenario data from '${disease}' model, storing in scenario id ${resultScenario.id}` );

        dispatchScenarioStateUpdate( {
          type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_DATA,
          scenario: resultScenario
        } );
      }

      dispatchScenarioStateUpdate( {
        type: ScenarioStoreConstants.ACTION_TYPES.SET_SCENARIO_KEYS,
        keys: SessionStorage.scenarioKeys // will have been internally updated by SessionStorage
      } );

      switchScenario( resultScenario.id );

    }

  };

  const runCreatedScenario = () => {

    console.log( `SimulatorManager running newly-UI-created scenario ${newScenarioId} for disease ${disease}` );
    setNewScenarioSettingsOpen( false );

    // save the scenario
    dispatchScenarioStateUpdate( {
      type: ScenarioStoreConstants.ACTION_TYPES.SAVE_SCENARIO_BY_ID,
      id: newScenarioId
    } );

    // snag the data & id
    const scenarioData = scenarioState.scenarioData[ newScenarioId ];

    console.log( 'SimulatorManager BEFORE running CREATED scenario:', scenarioData );

    // tell the UI we're not in 'new scenario' any more
    setNewScenarioId( null );

    if ( !simInProgress ) {

      setSimInProgress( true );

      diseaseModel.runScenario( {
        scenarioId: scenarioData.id,
        scenarioState,
        simState,
        simInProgress,
        setSimInProgress,
        callbacks
      } );
    }
  };

  const cancelCreatedScenario = () => {

    console.log( `SimulatorManager cancelling newly-UI-created scenario ${newScenarioId} for disease ${disease}` );
    setNewScenarioSettingsOpen( false );

    dispatchScenarioStateUpdate( {
      type: ScenarioStoreConstants.ACTION_TYPES.REMOVE_SCENARIO_BY_ID,
      id: newScenarioId
    } );

    setNewScenarioId( null );
    setTabIndex( getDefaultTabIndex() );

  };

  const runNewScenario = () => {

    console.log( `SimulatorManager running new scenario for disease ${disease}` );

    if ( scenarioState.scenarioKeys.length > 5 && !simInProgress ) {
      alert( 'Sorry, maximum number of Scenarios is 5.' );
      return;
    }

    if ( !simInProgress ) {

      setSimInProgress( true );

      diseaseModel.runScenario( {
        scenarioId: false,
        scenarioState,
        simState,
        simInProgress,
        setSimInProgress,
        callbacks
       } );
    }

  };

  const runCurrentScenario = () => {

    console.log( `SimulatorManager re-running current scenario ${scenarioState.currentScenarioId}` );

    // snag the data & id
    const scenarioData = scenarioState.scenarioData[ scenarioState.currentScenarioId ];

    console.log( 'SimulatorManager BEFORE running CURRENT scenario:', scenarioData );

    if ( !simInProgress ) {

      setSimInProgress( true );

      diseaseModel.runScenario( {
        scenarioId: scenarioState.currentScenarioId,
        scenarioState,
        simState,
        simInProgress,
        setSimInProgress,
        callbacks
      } );

    }

  };

  const resetCurrentScenario = () => {
    resetScenario( scenarioState.currentScenarioId );
  };

  const switchScenario = ( scenarioId ) => {

    try {

      const newScenarioData = scenarioState.scenarioData[ scenarioId ];

      dispatchScenarioStateUpdate( {
        type: ScenarioStoreConstants.ACTION_TYPES.SWITCH_SCENARIO_BY_ID,
        id: scenarioId
      } );

      diseaseModel.prepScenarioAndParams( scenarioId, scenarioState, simState );

      console.log( `SimulatorManager switched scenario to ${newScenarioData.id}: "${newScenarioData.label}"` );
    }

    catch ( e ) {
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
      setConfirmationOpen( false );
      removeScenario( scenarioState.currentScenarioId );
    }
  };

  const resetScenario = ( scenarioId ) => {
    console.log( `SimulatorManager resetting scenario ${scenarioId}` );
    const scenario = SessionStorage.fetchScenario( scenarioId );
    dispatchScenarioStateUpdate( {
      type: ScenarioStoreConstants.ACTION_TYPES.SET_LOADED_SCENARIO_DATA,
      scenario: scenario
    } );
  };

  const removeScenario = ( scenarioId ) => {

    dispatchScenarioStateUpdate( {
      type: ScenarioStoreConstants.ACTION_TYPES.REMOVE_SCENARIO_BY_ID,
      id: scenarioId
    } );


  };

  const handleTabChange = ( event, newTabIndex ) => {

    if( scenarioState.scenarioKeys[ newTabIndex ] && scenarioState.scenarioKeys[ newTabIndex ].id !== scenarioState.currentScenarioId ) {
      switchScenario( scenarioState.scenarioKeys[ newTabIndex ].id );
    }

    setTabIndex( newTabIndex );
    
  };

  // set tab index correctly when scenarioId is changed
  useEffect(

    () => {
    
      if( !scenarioState.currentScenarioId ) {
        return;
      }

      const currentScenarioIndexInKeys = scenarioState.scenarioKeys.findIndex( ( { id, label } ) => id === scenarioState.currentScenarioId );

      if ( currentScenarioIndexInKeys !== -1 ) {
        setTabIndex( currentScenarioIndexInKeys );
      }

    },

    [ scenarioState.currentScenarioId ]
  );

  // 2nd-arg empty array makes this a componentDidMount equivalent - only re-run if {nothing} changes
  useEffect(
    () => {

      if ( !( simState && simState.IUData && simState.IUData.id === props.match.params.iu ) ) {

        console.log( `SimulatorManager found no stored simulator state` );
        SessionStorage.simulatorState = null;

        ( async () => {
          console.log( `SimulatorManager calling loadAllIUhistoricData for ${props.match.params.iu} / ${disease} in ${props.match.params.country}` );
          await loadAllIUhistoricData(
            simState,
            dispatchSimState,
            props.match.params.iu, //implementationUnit,
            disease
          )
          console.log( `SimulatorManager loaded historic data for ${props.match.params.iu} / ${disease} in ${props.match.params.country}` );
        } )();

        return;
      }

      const scenarioKeys = SessionStorage.scenarioKeys;

      // load any stored scenario keys into state
      dispatchScenarioStateUpdate( {
        type: ScenarioStoreConstants.ACTION_TYPES.SET_SCENARIO_KEYS,
        keys: scenarioKeys
      } );

      // any keys found
      if( scenarioKeys.length ) {

        // load the data
        scenarioKeys.forEach(
          ( scenarioKey ) => {
            const scenario = SessionStorage.fetchScenario( scenarioKey.id );
            dispatchScenarioStateUpdate( {
              type: ScenarioStoreConstants.ACTION_TYPES.SET_LOADED_SCENARIO_DATA,
              scenario: scenario
            } );
          }
        );

        // switch to the first one
        dispatchScenarioStateUpdate( {
          type: ScenarioStoreConstants.ACTION_TYPES.SWITCH_SCENARIO_BY_ID,
          id: scenarioKeys[ 0 ].id
        } );
      
      }

      // none loaded - make a new one
      else {
        console.log( "SimulatorManager found no stored scenarios" );
        runNewScenario();
      }

    },

    []
  );
  // debug
  //Scenario state last updated: {scenarioState.updated.toISOString()}

  return (
    <div id="SimulatorManager">
      <Layout>

        <HeadWithInputs title="prevalence simulator" />
      
        <SelectCountry selectIU={true} showConfirmation={true} showBack={true} />
    
        <section className={classes.simulator}>

          <Grid container spacing={0}>

            <Grid item xs={12} className={classes.tabs}>

              <Tabs
                value={ tabIndex }
                onChange={ handleTabChange }
                aria-label="Available scenarios"
                indicatorColor="secondary"
                textColor="secondary"
                variant="scrollable"
                scrollButtons="auto"
              >
                {
                  scenarioState.scenarioKeys.map(
                    ( { id, label }, idx ) => {
                    return (
                      <Tab
                        key={ id }
                        label={ scenarioState.scenarioData[ id ].label }
                        { ...a11yProps( idx ) }
                      />
                    );
                    }
                  )
                }

                { scenarioState.scenarioKeys.length < 5 && (
                  <Tab
                    key={ `tab-element-99` }
                    label={ `+ Add scenario` }
                    disabled={ simInProgress }
                    onClick={ createNewScenario }
                  />
                ) }
              </Tabs>

            </Grid>

          </Grid>

          <Grid item md={12} xs={12} className={classes.chartContainer}>
            <TabPanel
              key={`scenario-result-${props.scenarioId}`}
              value={tabIndex}
              index={tabIndex}
            >
              <SimulatorDisplay
                  scenarioKeys={scenarioState.scenarioKeys}
                  resetCurrentScenario={resetCurrentScenario}
                  runCurrentScenario={runCurrentScenario}
                  simInProgress={simInProgress}
                  confirmRemoveCurrentScenario={confirmRemoveCurrentScenario}
                />

            </TabPanel>

            <ConfirmationDialog
              title="Do you want to delete this scenario?"
              onClose={ () => {
                setConfirmationOpen( false );
              }}
              onConfirm={ confirmedRemoveCurrentScenario }
              open={ confirmationOpen }
            />

            { simulationProgress !== 0 && simulationProgress !== 100 && (
              <div className={ classes.progress }>
                <CircularProgress
                  variant="determinate"
                  value={ simulationProgress }
                  color="primary"
                />
              </div>
            ) }
          </Grid>
        </section>

        {
          ( newScenarioSettingsOpen && newScenarioId )
            ? <SettingsDialog
                scenarioId={ newScenarioId }
                action={ runCreatedScenario }
                cancel={ cancelCreatedScenario }
                newScenarioSettingsOpen={newScenarioSettingsOpen}
              />
            : null
         }
      </Layout>

    </div>
  );
}

export default SimulatorManager;
