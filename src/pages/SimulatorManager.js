/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid, Tab, Tabs, Typography } from '@material-ui/core';
import PropTypes from 'prop-types'

import { useScenarioStore, ScenarioStoreConstants } from "../store/scenarioStore";

import SessionStorage from './components/simulator/helpers/sessionStorage'
import SimulatorDisplay from './SimulatorDisplay';
import * as SimulatorEngine from './components/simulator/SimulatorEngine'
import { useSimulatorStore } from './../store/simulatorStore'
import useStyles from './components/simulator/styles'
import { Layout } from '../layout'
import HeadWithInputs from './components/HeadWithInputs'
import SelectCountry from './components/SelectCountry'
import ConfirmationDialog from './components/ConfirmationDialog'
import SettingsDialog from './components/SettingsDialog'

import { generateMdaFutureFromDefaults, generateMdaFutureFromScenario } from './components/simulator/helpers/iuLoader'
import { combineFullMda } from './components/simulator/helpers/combineFullMda'
import { removeInactiveMDArounds } from './components/simulator/helpers/removeInactiveMDArounds'
import { trimMdaHistory } from './components/simulator/helpers/trimMdaHistory'

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

  const [ simInProgress, setSimInProgress ] = useState( false );
  const [ simulationProgress, setSimulationProgress ] = useState( 0 );
  const [ confirmationOpen, setConfirmationOpen ] = useState( false );
  const [ newScenarioSettingsOpen, setNewScenarioSettingsOpen ] = useState( false );
  const [ newScenarioData, setNewScenarioData ] = useState( null );

  const defaultTabIndex = (
    () => {
      const idx = scenarioState.scenarioKeys.findIndex( ( { id, label } ) => id === scenarioState.currentScenarioId );
      const defaultIdx = idx < 0 ? 0 : idx;
      return defaultIdx;
    }
  )();

  const [ tabIndex, setTabIndex ] = useState( defaultTabIndex );

  const runScenario = ( isNewScenario ) => {

    if (!simInProgress) {

      setSimInProgress( true );

      updateMDAAndIUData( isNewScenario );

      SimulatorEngine.simControler.newScenario = isNewScenario;

      console.log( `SimulatorManager calling SimulatorEngine.simControler.runScenario( ${scenarioState.currentScenarioId}, isNewScenario: ${isNewScenario} ) in runCurrentScenario` );

      const currentScenarioData = scenarioState.currentScenarioId ? scenarioState.scenarioData[ scenarioState.currentScenarioId ] : null;

      const callbacks = { progressCallback, resultCallback };

      if ( isNewScenario ) {
        SimulatorEngine.simControler.runScenario(
          simState.settings, // use default params
          null, // create a new ID & scenario
          callbacks
        );
      }

      else {
        SimulatorEngine.simControler.runScenario(
          currentScenarioData.settings,  // use per-scenario params
          currentScenarioData,  // use existing scenario
          callbacks
        );
      }

    }

  };

  const updateMDAAndIUData = ( isNewScenario ) => {

      // get MDA history
      const IUData = simState.IUData;

      if ( isNewScenario ) {
        SimulatorEngine.simControler.iuParams = IUData.params;
      }

      const mdaHistory = IUData.mdaObj;

      // generate MDA predictions
      const scenarioData = scenarioState.scenarioData[ scenarioState.currentScenarioId ];

      const specificPrediction = 
        ( scenarioData && isNewScenario === false )
          ? scenarioData.settings.specificPrediction
          : simState.specificPrediction;

      const generatedMda =
        ( scenarioData && isNewScenario === false )
          ? generateMdaFutureFromScenario( scenarioData )
          : generateMdaFutureFromDefaults( simState );

      const mdaPrediction =
        specificPrediction !== null
          ? { ...generatedMda, ...specificPrediction }
          : generatedMda;

      const fullMDA = combineFullMda( mdaHistory, mdaPrediction );

      SimulatorEngine.simControler.mdaObj = removeInactiveMDArounds( fullMDA );
      SimulatorEngine.simControler.mdaObjUI = fullMDA;
      SimulatorEngine.simControler.mdaObj2015 = trimMdaHistory( mdaHistory );
      SimulatorEngine.simControler.mdaObjFuture = mdaPrediction;
      SimulatorEngine.simControler.iuParams = IUData.params;
  };

  const createNewScenario = () => {
    console.log( 'SimulatorManager creating new scenario' );
    const newScenarioData = SimulatorEngine.simControler.createScenario( simState.settings );

    setNewScenarioData( newScenarioData );
    setNewScenarioSettingsOpen( true );
  };

  const runNewScenario = async () => {

    console.log( 'SimulatorManager running new scenario' );

    if ( scenarioState.scenarioKeys.length > 5 && !simInProgress ) {
      alert( 'Sorry, maximum number of Scenarios is 5.' );
      return;
    }

    runScenario( true );

  };

  const runCurrentScenario = async () => {

    console.log( `SimulatorManager re-running current scenario ${scenarioState.currentScenarioId}` );

    runScenario( false );

  };

  const resetCurrentScenario = () => {
    resetScenario( scenarioState.currentScenarioId );
  };

  const progressCallback = ( progress ) => {
    setSimulationProgress( progress );
  };

  const resultCallback = ( resultScenario, isNewScenario ) => {


    delete resultScenario.isDirty;

    setSimInProgress( false );

    if( isNewScenario ) {
      console.log( `SimulatorManager received new result scenario from SimulatorEngine, storing in scenario id ${resultScenario.id}` );

      dispatchScenarioStateUpdate( {
        type: ScenarioStoreConstants.ACTION_TYPES.SET_NEW_SCENARIO_DATA,
        scenario: resultScenario
      } );

    }

    else {
      console.log( `SimulatorManager received updated result scenario from SimulatorEngine, storing in scenario id ${resultScenario.id}` );

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

  };

  const switchScenario = ( id ) => {

    try {

      const newScenarioData = scenarioState.scenarioData[ scenarioState.currentScenarioId ];

      dispatchScenarioStateUpdate( {
        type: ScenarioStoreConstants.ACTION_TYPES.SWITCH_SCENARIO_BY_ID,
        id: id
      } );

      updateMDAAndIUData( false );

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

  useEffect(

    () => {
    
      if( !scenarioState.currentScenarioId ) {
        return;
      }

   //   console.log( `SimulatorManager saw scenarioState.currentScenarioId changed to ${scenarioState.currentScenarioId}` );

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

      // try to load simulator state from storage
      const simulatorState = SessionStorage.simulatorState;

      // if it's got state for this IU cached
      if( simulatorState && simulatorState.IUData && simulatorState.IUData.id === props.match.params.iu ) {

        // set it in memory
        if ( simulatorState ) {
          dispatchSimState( {
            type: 'everything',
            payload: simulatorState
          } );
        }

      }

      // otherwise clear out the cache & any sceanrios
      else {
        SessionStorage.simulatorState = null;
        SessionStorage.removeAllScenarios();
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
        console.log( "SimulatorManager creating new scenario" );
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
                    label={ `+ Add one` }
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

        { newScenarioSettingsOpen ? <SettingsDialog scenarioData={ newScenarioData } /> : null }
      </Layout>

    </div>
  );
}

export default SimulatorManager;
