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

import { obtainIUData } from './components/simulator/helpers/obtainIUData'
//import { detectChange } from './components/simulator/helpers/detectChange'
import { generateMdaFuture } from './components/simulator/helpers/iuLoader'
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

const SimulatorManager = ( props ) => {

  const { simState, dispatchSimState } = useSimulatorStore();
  const { scenarioState, dispatchScenarioStateUpdate } = useScenarioStore();

  const [ simInProgress, setSimInProgress ] = useState( false );
  const [ simulationProgress, setSimulationProgress ] = useState( 0 );
  const [ confirmationOpen, setConfirmationOpen ] = useState( false );

  const defaultTabIndex = (
    () => {
      const idx = scenarioState.scenarioKeys.findIndex( ( { id, label } ) => id === scenarioState.currentScenarioId );
      const defaultIdx = idx < 0 ? 0 : idx;
      return defaultIdx;
    }
  )();

  const [ tabIndex, setTabIndex ] = useState( defaultTabIndex );

  const classes = useStyles();

  const runScenario = ( isNewScenario ) => {

    if (!simInProgress) {

      setSimInProgress(true);

      updateMDAAndIUData( isNewScenario );

      SimulatorEngine.simControler.newScenario = isNewScenario;

      console.log( `SimulatorManager calling SimulatorEngine.simControler.runScenario( ${scenarioState.currentScenarioId}, isNewScenario: ${isNewScenario} ) in runCurrentScenario` );

      const currentScenarioData = scenarioState.currentScenarioId ? scenarioState.scenarioData[ scenarioState.currentScenarioId ] : null;

      SimulatorEngine.simControler.runScenario(
        simState,
        isNewScenario
          ? null // "create a new ID"
          : currentScenarioData, // "re-run the scenario with this ID"
        { progressCallback, resultCallback }
      );
    }

  };

  const updateMDAAndIUData = ( isNewScenario ) => {

      const scenarioData = scenarioState.scenarioData[ scenarioState.currentScenarioId ];

      const specificPrediction = scenarioData ? scenarioData.settings.specificPrediction : simState.specificPrediction;

      const IUData = obtainIUData( simState, dispatchSimState );
      if ( isNewScenario ) {
        SimulatorEngine.simControler.iuParams = IUData.params;
      }
      const mdaHistory = IUData.mdaObj;
      const generatedMda = generateMdaFuture( simState );
      const mdaPrediction =
        specificPrediction !== null
          ? { ...generatedMda, ...specificPrediction }
          : generatedMda;
      const fullMDA = combineFullMda( mdaHistory, mdaPrediction );

      dispatchSimState( {
        type: 'defaultPrediction',
        payload: mdaPrediction,
      } );

      dispatchSimState( {
        type: 'tweakedPrediction',
        payload: mdaPrediction,
      } );

      SimulatorEngine.simControler.mdaObj = removeInactiveMDArounds( fullMDA );
      SimulatorEngine.simControler.mdaObjUI = fullMDA;
      SimulatorEngine.simControler.mdaObj2015 = trimMdaHistory( mdaHistory );
      SimulatorEngine.simControler.mdaObjFuture = mdaPrediction;
      SimulatorEngine.simControler.iuParams = IUData.params;
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

    console.log( `SimulatorManager running current scenario ${scenarioState.currentScenarioId}` );

    runScenario( false );

  };

  const resetCurrentScenario = () => {
    resetScenario( scenarioState.currentScenarioId );
  };

  const progressCallback = ( progress ) => {
    setSimulationProgress( progress );
  };

  const resultCallback = ( resultScenario, isNewScenario ) => {

    console.log( `SimulatorEngine returned result, stored in scenario id ${resultScenario.id}` );

    delete resultScenario.isDirty;

    setSimInProgress( false );

    if( isNewScenario ) {
      console.info( `SimulatorManager received new scenario ${resultScenario.id}` );

      dispatchScenarioStateUpdate( {
        type: ScenarioStoreConstants.ACTION_TYPES.SET_NEW_SCENARIO_DATA,
        scenario: resultScenario
      } );

    }

    else {
      console.info( `SimulatorManager received updated scenario ${resultScenario.id}` );

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
    console.log( `RESETTING SCENARIO ${scenarioId}` );
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

      console.log( `scenarioState.currentScenarioId changed to ${scenarioState.currentScenarioId}` );

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
        console.log( "CREATING NEW SCENARIO" );
        runNewScenario();
      }

    },

    []
  );

  return (
    <div id="SimulatorManager">
      <Layout>

      <HeadWithInputs title="prevalence simulator" />

      Scenario state last updated: {scenarioState.updated.toISOString()}

      <SelectCountry selectIU={true} showConfirmation={true} />

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
              { scenarioState.scenarioKeys.map(
                ( { id, label }, idx ) => {
                return (
                  <Tab
                    key={ id }
                    label={ scenarioState.scenarioData[ id ].label }
                    { ...a11yProps( idx ) }
                  />
                );
                }
              ) }

              { scenarioState.scenarioKeys.length < 5 && (
                <Tab
                  key={ `tab-element-99` }
                  label={ `+ Add one` }
                  disabled={ simInProgress }
                  onClick={ runNewScenario }
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
            switchScenario={switchScenario}
            removeScenario={removeScenario}
            runNewScenario={runNewScenario}
            resetCurrentScenario={resetCurrentScenario}
            runCurrentScenario={runCurrentScenario}
            simInProgress={simInProgress}
            setSimInProgress={setSimInProgress}
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
      </Layout>
    </div>
  );
}

export default SimulatorManager;
