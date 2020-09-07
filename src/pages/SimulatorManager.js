import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid, Tab, Tabs, Typography } from '@material-ui/core';
import PropTypes from 'prop-types'

import SessionStorage from './components/simulator/helpers/sessionStorage'
import Simulator from './Simulator';
import * as SimulatorEngine from './components/simulator/SimulatorEngine'
import { useStore } from './../store/simulatorStore'
import useStyles from './components/simulator/styles'
import { Layout } from '../layout'
import HeadWithInputs from './components/HeadWithInputs'
import SelectCountry from './components/SelectCountry'
import ConfirmationDialog from './components/ConfirmationDialog'

import { obtainIUData } from './components/simulator/helpers/obtainIUData'
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

let renderCount = 0;

const SimulatorManager = ( props ) => {

  console.log( `SimulatorManager render() #${++renderCount}` );

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
      console.log( `SimulatorManager setting defaultTabIndex ${defaultIdx}` );
      return defaultIdx;
    }
  )();

  const [ tabIndex, setTabIndex ] = useState( defaultTabIndex );
  const [ scenarioInputs, setScenarioInputs ] = useState( [] );
  const [ scenarioMDAs, setScenarioMDAs ] = useState( {} );

  const { simParams, dispatchSimParams } = useStore();

  const classes = useStyles();

  const runNewScenario = async () => {

    renderCount = 0;

    console.log( 'SimulatorManager running new scenario' );

    if ( ntdScenarioKeys.length > 5 && !simInProgress ) {
      alert('Sorry maximum number of Scenarios is 5.');
      return;
    }

    if (!simInProgress) {

      setSimInProgress(true);

      const IUData = obtainIUData(simParams, dispatchSimParams);
      SimulatorEngine.simControler.iuParams = IUData.params;

      const mdaHistory = IUData.mdaObj;
      const generatedMda = generateMdaFuture(simParams);
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

      console.log( 'runNewScenario: mdaObj', SimulatorEngine.simControler.mdaObj );
      console.log( 'runNewScenario: iuParams', SimulatorEngine.simControler.iuParams );

      SimulatorEngine.simControler.newScenario = true;
      // null 2nd parameter == 'no scenarioId' == 'create a new one'
      SimulatorEngine.simControler.runScenario( simParams, null, { progressCallback, resultCallback } );
    }

  };

  const runCurrentScenario = async () => {

    if (!simInProgress) {

      setSimInProgress(true);

      const IUData = obtainIUData( simParams, dispatchSimParams );
      const mdaHistory = IUData.mdaObj;
      const generatedMda = generateMdaFuture( simParams );
      const mdaPrediction =
        simParams.specificPrediction !== null
          ? { ...generatedMda, ...simParams.specificPrediction }
          : generatedMda;
      const fullMDA = combineFullMda(mdaHistory, mdaPrediction);

      console.log( "simParams updated", simParams );

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

      console.log( 'runCurrentScenario: mdaObj',SimulatorEngine.simControler.mdaObj );
      console.log( 'runCurrentScenario: iuParams',SimulatorEngine.simControler.iuParams );

      SimulatorEngine.simControler.newScenario = false;

      SimulatorEngine.simControler.runScenario(
        simParams,
        currentScenarioId, // "re-run the scenario with this ID"
        { progressCallback, resultCallback }
      );
    }
  }

  const progressCallback = ( progress ) => {
    console.log( `Simulator returned progress ${progress}` );
    setSimulationProgress( progress );

  };

  const resultCallback = ( newStoredScenario, isNewScenario ) => {

    console.log( `Simulator returned result, stored in scenario id ${newStoredScenario.id}` );

    dispatchSimParams({
      type: 'needsRerun',
      payload: false,
    })

    setSimInProgress( false );

    // this scenario is new
    if( ntdScenarioKeys.findIndex( ( { id, label } ) => id === newStoredScenario.id ) === -1 ) {
      console.info( `SimulatorManager received new scenario ${newStoredScenario.id}` );
    }

    // this scenario has been updated
    else {
      console.info( `SimulatorManager received updated scenario ${newStoredScenario.id}` );
    }

    // store MDAs & inputs in state for use in simulator, keyed by id
    setScenarioMDAs( { ...scenarioMDAs, [ newStoredScenario.id ]: JSON.parse( JSON.stringify( newStoredScenario.mda2015 ) ) } );
    setScenarioInputs( { ...scenarioInputs, [ newStoredScenario.id ]: JSON.parse( JSON.stringify( newStoredScenario.params.inputs ) ) } );

    switchScenario( newStoredScenario.id );
    setNtdScenarioKeys( SessionStorage.scenarioKeys );

  };

  const switchScenario = ( id ) => {

    try {
      console.log( `SimulatorManager asked to switchScenario( ${id} ) from currentScenario ${currentScenarioId}` );

      const newScenarioData = SessionStorage.fetchScenario( id );
      console.log( `SimulatorManager loaded newScenarioData for ${newScenarioData.id}` );
      setCurrentScenarioData( newScenarioData );
      setCurrentScenarioId( newScenarioData.id );

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

  const removeScenario = ( id ) => {

    SessionStorage.removeScenario( id );
    
    const stateScenarioMDAs = JSON.parse( JSON.stringify( scenarioMDAs ) );
    const stateScenarioInputs = JSON.parse( JSON.stringify( scenarioInputs ) );

    delete stateScenarioMDAs[ id ];
    delete stateScenarioInputs[ id ];

    setScenarioMDAs( stateScenarioMDAs );
    setScenarioInputs( stateScenarioInputs );

    const scenarioKeys = SessionStorage.scenarioKeys; 
    setNtdScenarioKeys( scenarioKeys );

    if ( scenarioKeys.length ) {
      const loadedScenarioData = SessionStorage.fetchScenario( scenarioKeys[ scenarioKeys.length - 1 ].id );
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

  // 2nd-arg empty array makes this a componentDidMount equivalent - only re-run if {nothing} changes
  useEffect(
    () => {

      const scenarioKeys = SessionStorage.scenarioKeys; 

      console.log( `SimulatorManager mount-time scenario load, setting scenarioKeys:`, scenarioKeys );
      setNtdScenarioKeys( scenarioKeys );

      if ( scenarioKeys.length === 0 ) {
        console.log( "CREATING NEW SCENARIO" );
        runNewScenario();
      }

      if( !currentScenarioId && scenarioKeys.length ) {
        try {
          const firstScenarioData = SessionStorage.fetchScenario( scenarioKeys[ 0 ].id );

          console.log( `SimulatorManager setting currentScenarioData to ${scenarioKeys[ 0 ].label} (id ${scenarioKeys[ 0 ].id})` );
          setCurrentScenarioData( firstScenarioData );

          console.log( `SimulatorManager setting currentScenarioKey to ${scenarioKeys[ 0 ].id}` );
          setCurrentScenarioId( scenarioKeys[ 0 ].id );
        }
        catch ( e ) {
        // TODO display error message somehow
        //  setScenarioLoadingError( e.message );
        }
      }
    } ,
    // eslint-disable-next-line
    []
  );

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
        <Simulator
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
