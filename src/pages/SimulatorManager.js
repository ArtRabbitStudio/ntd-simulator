/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid, Tab, Tabs, Typography } from '@material-ui/core';
import PropTypes from 'prop-types'

import SessionStorage from './components/simulator/helpers/sessionStorage'
import SimulatorDisplay from './SimulatorDisplay';
import * as SimulatorEngine from './components/simulator/SimulatorEngine'
import { useStore } from './../store/simulatorStore'
import useStyles from './components/simulator/styles'
import { Layout } from '../layout'
import HeadWithInputs from './components/HeadWithInputs'
import SelectCountry from './components/SelectCountry'
import ConfirmationDialog from './components/ConfirmationDialog'

import { obtainIUData } from './components/simulator/helpers/obtainIUData'
import { detectChange } from './components/simulator/helpers/detectChange'
import { generateMdaFuture } from './components/simulator/helpers/iuLoader'
import { combineFullMda } from './components/simulator/helpers/combineFullMda'
import { removeInactiveMDArounds } from './components/simulator/helpers/removeInactiveMDArounds'
import { trimMdaHistory } from './components/simulator/helpers/trimMdaHistory'
import { shallIupdateTabLabel } from './components/simulator/helpers/shallIupdateTabLabel'

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


  const [ ntdScenarioKeys, setNtdScenarioKeys ] = useState( [] );
  const [ currentScenarioId, setCurrentScenarioId ] = useState( null );
  const [ currentScenarioData, setCurrentScenarioData ] = useState( null );
//  const [ scenarioLoadingError, setScenarioLoadingError ] = useState( null );
  const [ simInProgress, setSimInProgress ] = useState( false );
  const [ simulationProgress, setSimulationProgress ] = useState( 0 );
  const [ confirmationOpen, setConfirmationOpen ] = useState( false );

  const defaultTabIndex = (
    () => {
      const idx = ntdScenarioKeys.findIndex( ( { id, label } ) => id === currentScenarioId );
      const defaultIdx = idx < 0 ? 0 : idx;
      return defaultIdx;
    }
  )();

  const [ tabIndex, setTabIndex ] = useState( defaultTabIndex );
  const [ scenarioInputs, setScenarioInputs ] = useState( [] );
  const [ scenarioMDAs, setScenarioMDAs ] = useState( {} );

  const { simParams, dispatchSimParams } = useStore();

  const classes = useStyles();

  const runScenario = ( isNewScenario ) => {

    if (!simInProgress) {

      setSimInProgress(true);

      dispatchSimParams( {
        type: 'needsRerun',
        payload: false,
      } );

      updateMDAAndIUData( isNewScenario );

      if ( !isNewScenario ) {
        if (
          shallIupdateTabLabel(
            simParams.specificPrediction,
            simParams.scenarioLabels[ currentScenarioId ]
          )
        ) {
          dispatchSimParams({
            type: 'scenarioLabel',
            scenarioId: currentScenarioId,
            payload: simParams.specificPrediction.label,
          })
        }
      }

      SimulatorEngine.simControler.newScenario = isNewScenario;

      console.log( `SimulatorManager calling SimulatorEngine.simControler.runScenario( ${currentScenarioId}, isNewScenario: ${isNewScenario} ) in runCurrentScenario` );

      SimulatorEngine.simControler.runScenario(
        simParams,
        isNewScenario
          ? null // "create a new ID"
          : currentScenarioId, // "re-run the scenario with this ID"
        { progressCallback, resultCallback }
      );
    }
  };

  const updateMDAAndIUData = ( isNewScenario ) => {

      const IUData = obtainIUData( simParams, dispatchSimParams );
      if ( isNewScenario ) {
        SimulatorEngine.simControler.iuParams = IUData.params;
      }
      const mdaHistory = IUData.mdaObj;
      const generatedMda = generateMdaFuture( simParams );
      const mdaPrediction =
        simParams.specificPrediction !== null
          ? { ...generatedMda, ...simParams.specificPrediction }
          : generatedMda;
      const fullMDA = combineFullMda( mdaHistory, mdaPrediction );

      dispatchSimParams( {
        type: 'defaultPrediction',
        payload: mdaPrediction,
      } );

      dispatchSimParams( {
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

    if ( ntdScenarioKeys.length > 5 && !simInProgress ) {
      alert('Sorry maximum number of Scenarios is 5.');
      return;
    }

    runScenario( true );

  };

  const runCurrentScenario = async () => {

    console.log( `SimulatorManager running current scenario ${currentScenarioId}` );

    runScenario( false );

  };

  const progressCallback = ( progress ) => {
//    console.log( `SimulatorEngine returned progress ${progress}` );
    setSimulationProgress( progress );
  };

  const resultCallback = ( newStoredScenario, isNewScenario ) => {

    console.log( `SimulatorEngine returned result, stored in scenario id ${newStoredScenario.id}` );

    dispatchSimParams( {
      type: 'needsRerun',
      payload: false,
    } );

    setSimInProgress( false );

    // this scenario is new
    if( ntdScenarioKeys.findIndex( ( { id, label } ) => id === newStoredScenario.id ) === -1 ) {
      console.info( `SimulatorManager received new scenario ${newStoredScenario.id}` );
    }

    // this scenario has been updated
    else {
      console.info( `SimulatorManager received updated scenario ${newStoredScenario.id}` );
    }

    setNtdScenarioKeys( SessionStorage.scenarioKeys );
    switchScenario( newStoredScenario.id );

  };

  const switchScenario = ( id ) => {

    try {

      const newScenarioData = SessionStorage.fetchScenario( id );

      setCurrentScenarioData( newScenarioData );
      setCurrentScenarioId( newScenarioData.id );

      // store MDAs & inputs in state for use in simulator, keyed by id
      console.log( `switchScenario setting MDAs & Inputs for ${newScenarioData.id}\n`, newScenarioData.mda2015, '\n', newScenarioData.params.inputs );
      setScenarioMDAs( { ...scenarioMDAs, [ newScenarioData.id ]: JSON.parse( JSON.stringify( newScenarioData.mda2015 ) ) } );
      setScenarioInputs( { ...scenarioInputs, [ newScenarioData.id ]: JSON.parse( JSON.stringify( newScenarioData.params.inputs ) ) } );

      updateMDAAndIUData( false );

      console.log( `SimulatorManager switched scenario to ${newScenarioData.id}: "${newScenarioData.label}"` );
    }

    catch ( e ) {
    // TODO display error message somehow
    //  setScenarioLoadingError( e.message );
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
      removeScenario( currentScenarioId );
    }
  };

  const removeScenario = ( scenarioId ) => {

//    const currentScenarioIndexInKeys = ntdScenarioKeys.findIndex( ( { id, label } ) => id === scenarioId );

    SessionStorage.removeScenario( scenarioId );
    
    const stateScenarioMDAs = JSON.parse( JSON.stringify( scenarioMDAs ) );
    const stateScenarioInputs = JSON.parse( JSON.stringify( scenarioInputs ) );

    delete stateScenarioMDAs[ scenarioId ];
    delete stateScenarioInputs[ scenarioId ];

    setScenarioMDAs( stateScenarioMDAs );
    setScenarioInputs( stateScenarioInputs );

    const scenarioKeys = SessionStorage.scenarioKeys; 
    setNtdScenarioKeys( scenarioKeys );

    if ( scenarioKeys.length ) {
      const lastScenarioKeyIdx = scenarioKeys.length -1;
      const loadedScenarioData = SessionStorage.fetchScenario( scenarioKeys[ lastScenarioKeyIdx ].id );
      setCurrentScenarioData( loadedScenarioData );
      setCurrentScenarioId( loadedScenarioData.id );
    }

    else {
      setCurrentScenarioData( null );
      setCurrentScenarioId( null );
    }

  };

  const handleTabChange = ( event, newTabIndex ) => {

    if( ntdScenarioKeys[ newTabIndex ] && ntdScenarioKeys[ newTabIndex ].id !== currentScenarioId ) {
      switchScenario( ntdScenarioKeys[ newTabIndex ].id );
    }

    setTabIndex( newTabIndex );
    
  };

  useEffect(
    () => {
      console.log( `currentScenarioId updated: ${currentScenarioId}`, scenarioInputs );
      if ( typeof scenarioInputs[ currentScenarioId ] !== 'undefined' ) {
        console.log( 'dispatchingSimParams', simParams );
        dispatchSimParams({
          type: 'everythingbuthistoric',
          payload: {
            ...scenarioInputs[ currentScenarioId ],
            scenarioLabels: simParams.scenarioLabels,
          },
        })
      }
    },
    [ currentScenarioId ]
  );

  useEffect(

    () => {

      console.log( `currentScenarioId changed to ${currentScenarioId}` );
      const currentScenarioIndexInKeys = ntdScenarioKeys.findIndex( ( { id, label } ) => id === currentScenarioId );
      if ( currentScenarioIndexInKeys !== -1 ) {
        setTabIndex( currentScenarioIndexInKeys );
      }

    },

    [ currentScenarioId ]
  );

  useEffect(
    () => {
      console.log( `scenarioMDAs changed to `, scenarioMDAs );
    },
    [ scenarioMDAs ]
  );

  useEffect(
    () => {
      console.log( `scenarioInputs changed to `, scenarioInputs );
    },
    [ scenarioInputs ]
  );

  // 2nd-arg empty array makes this a componentDidMount equivalent - only re-run if {nothing} changes
  useEffect(
    () => {

      const scenarioKeys = SessionStorage.scenarioKeys; 

      setNtdScenarioKeys( scenarioKeys );

      if ( scenarioKeys.length === 0 ) {
        console.log( "CREATING NEW SCENARIO" );
        runNewScenario();
      }

      if( !currentScenarioId && scenarioKeys.length ) {
        switchScenario( scenarioKeys[ 0 ].id );
        /*
        try {
          const firstScenarioData = SessionStorage.fetchScenario( scenarioKeys[ 0 ].id );

          setCurrentScenarioData( firstScenarioData );
          setCurrentScenarioId( scenarioKeys[ 0 ].id );
        }
        catch ( e ) {
        // TODO display error message somehow
        //  setScenarioLoadingError( e.message );
        }
        */
      }

/*
      const scenariosArray = SessionStorage.fetchAllScenarios();

      let paramsInputs = scenariosArray.map((item) => item.params.inputs)
      let mdaFuture = scenariosArray.map((item) => item.mdaFuture)
      let MDAs = scenariosArray.map((item) => item.mda2015)
      // make new default prediction from ex tweaked one - the one from "mdaFuture".
      let paramsInputsWithPrediction = paramsInputs.map((item, index) => ({
        ...item,
        defaultPrediction: {
          time: [...mdaFuture[index].time],
          coverage: [...mdaFuture[index].coverage],
          adherence: [...mdaFuture[index].adherence],
          bednets: [...mdaFuture[index].bednets],
          regimen: [...mdaFuture[index].regimen],
          active: [...mdaFuture[index].active],
          beenFiddledWith: [...mdaFuture[index].beenFiddledWith],
        },
        tweakedPrediction: {
          time: [...mdaFuture[index].time],
          coverage: [...mdaFuture[index].coverage],
          adherence: [...mdaFuture[index].adherence],
          bednets: [...mdaFuture[index].bednets],
          regimen: [...mdaFuture[index].regimen],
          active: [...mdaFuture[index].active],
          beenFiddledWith: [...mdaFuture[index].beenFiddledWith],
        },
      }))
//      setScenarioInputs(paramsInputsWithPrediction)
//      if (typeof paramsInputsWithPrediction[tabIndex] != 'undefined') {
//        setScenarioMDAs(MDAs)
//        //console.log(simParams)
        console.log( "DISPATCHING everythingbuthistoric", paramsInputsWithPrediction );
//        dispatchSimParams({
//          type: 'everythingbuthistoric',
//          payload: paramsInputsWithPrediction[tabIndex],
//        })
//      }
*/
    } ,

    []
  );

/*
  useEffect(
    () => {
      detectChange(simParams, dispatchSimParams)
    },

    [
      simParams.coverage,
      simParams.mdaSixMonths,
      simParams.covN,
      simParams.mdaRegimen,
      simParams.rho,
      simParams.species,
      simParams.runs,
      simParams.tweakedPrediction,
      simParams.defaultPrediction,
    ]
  );
*/

  return (
    <div id="SimulatorManager">
      <Layout>

      <HeadWithInputs title="prevalence simulator" />

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
              { ntdScenarioKeys.map(
                ( { id, label }, idx ) => {
                return (
                  <Tab
                    key={ id }
                    label={ label }
                    { ...a11yProps( idx ) }
                  />
                );
                }
              ) }

              { ntdScenarioKeys.length < 5 && (
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
            scenarioId={currentScenarioId}
            scenarioData={currentScenarioData}
            scenarioKeys={ntdScenarioKeys}
            switchScenario={switchScenario}
            removeScenario={removeScenario}
            runNewScenario={runNewScenario}
            runCurrentScenario={runCurrentScenario}
            simInProgress={simInProgress}
            setSimInProgress={setSimInProgress}
            scenarioInputs={scenarioInputs}
            setScenarioInputs={setScenarioInputs}
            scenarioMDAs={scenarioMDAs}
            setScenarioMDAs={setScenarioMDAs}
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
