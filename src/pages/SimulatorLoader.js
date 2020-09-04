import React, { useEffect, useState } from 'react';

import SessionStorage from './components/simulator/helpers/sessionStorage'
import Simulator from './Simulator';
import * as SimulatorEngine from './components/simulator/SimulatorEngine'
import { useStore } from './../store/simulatorStore'

import { obtainIUData } from './components/simulator/helpers/obtainIUData'
import { generateMdaFuture } from './components/simulator/helpers/iuLoader'
import { combineFullMda } from './components/simulator/helpers/combineFullMda'
import { removeInactiveMDArounds } from './components/simulator/helpers/removeInactiveMDArounds'
import { trimMdaHistory } from './components/simulator/helpers/trimMdaHistory'

let renderCount = 0;

const SimulatorLoader = ( props ) => {

  console.log( `SimulatorLoader render() #${++renderCount}` );

  const [ ntdScenarioKeys, setNtdScenarioKeys ] = useState( [] );
  const [ currentScenarioId, setCurrentScenarioId ] = useState( null );
  const [ currentScenarioData, setCurrentScenarioData ] = useState( null );
  const [ scenarioLoadingError, setScenarioLoadingError ] = useState( null );
  const [ simInProgress, setSimInProgress ] = useState( false );
  const [ simulationProgress, setSimulationProgress ] = useState( 0 );

  const { simParams, dispatchSimParams } = useStore();

  const runNewScenario = async () => {

    renderCount = 0;

    console.log( 'SimulatorLoader running new scenario' );

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
      const fullMDA = combineFullMda(mdaHistory, mdaPrediction);

      // REPLACEME
      /*
      if (
      shallIupdateTabLabel(
      simParams.specificPrediction,
      simParams.scenarioLabels[tabIndex]
      )
      ) {
      dispatchSimParams({
      type: 'scenarioLabel',
      payload: simParams.specificPrediction.label,
      })
      }
      */

      dispatchSimParams({
        type: 'defaultPrediction',
        payload: mdaPrediction,
      });

      dispatchSimParams({
        type: 'tweakedPrediction',
        payload: mdaPrediction,
      });

      SimulatorEngine.simControler.mdaObj = removeInactiveMDArounds(fullMDA);
      SimulatorEngine.simControler.mdaObjUI = fullMDA;
      SimulatorEngine.simControler.mdaObj2015 = trimMdaHistory(mdaHistory);
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

      setSimInProgress(true)
      const IUData = obtainIUData(simParams, dispatchSimParams)
      const mdaHistory = IUData.mdaObj
      const generatedMda = generateMdaFuture(simParams)
      const mdaPrediction =
        simParams.specificPrediction !== null
          ? { ...generatedMda, ...simParams.specificPrediction }
          : generatedMda;
      const fullMDA = combineFullMda(mdaHistory, mdaPrediction);

// REPLACEME
/*
      if (
        shallIupdateTabLabel(
          simParams.specificPrediction,
          simParams.scenarioLabels[tabIndex]
        )
      ) {
        dispatchSimParams({
          type: 'scenarioLabel',
          payload: simParams.specificPrediction.label,
        })
      }
*/
      dispatchSimParams({
        type: 'defaultPrediction',
        payload: mdaPrediction,
      });

      dispatchSimParams({
        type: 'tweakedPrediction',
        payload: mdaPrediction,
      });

      SimulatorEngine.simControler.mdaObj = removeInactiveMDArounds(fullMDA);
      SimulatorEngine.simControler.mdaObjUI = fullMDA;
      SimulatorEngine.simControler.mdaObj2015 = trimMdaHistory(mdaHistory);
      SimulatorEngine.simControler.mdaObjFuture = mdaPrediction;
      SimulatorEngine.simControler.iuParams = IUData.params;

      console.log('runCurrentScenario: mdaObj',SimulatorEngine.simControler.mdaObj);
      console.log('runCurrentScenario: iuParams',SimulatorEngine.simControler.iuParams);

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
    switchScenario( newStoredScenario.id );
    setNtdScenarioKeys( SessionStorage.scenarioKeys );

  // REPLACEME
  /*

    if (typeof scenarioResults[tabIndex] === 'undefined') {
      //console.log('scenarioResults',resultObject)
      const newScenarioResults = [...scenarioResults, JSON.parse(resultObject)];
      console.log( `Simulator calling setScenarioResults( ${newScenarioResults} )` );
      setScenarioResults( newScenarioResults )
      setScenarioInputs([
        ...scenarioInputs,
        JSON.parse(resultObject).params.inputs,
      ])
      setScenarioMDAs([...scenarioMDAs, JSON.parse(resultObject).mda2015])
    }

    else {
      let correctTabIndex = isNewScenario === true ? tabIndex + 1 : tabIndex
      //console.log('scenarioResults',resultObject)
      let scenarioResultsNew = [...scenarioResults] // 1. Make a shallow copy of the items
      let resultItem = scenarioResultsNew[correctTabIndex] // 2. Make a shallow copy of the resultItem you want to mutate
      resultItem = JSON.parse(resultObject) // 3. Replace the property you're intested in
      scenarioResultsNew[correctTabIndex] = resultItem // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
      setScenarioResults(scenarioResultsNew) // 5. Set the state to our new copy

      let scenarioInputsNew = [...scenarioInputs]
      let inputsItem = scenarioInputsNew[correctTabIndex]
      inputsItem = JSON.parse(resultObject).params.inputs
      scenarioInputsNew[correctTabIndex] = inputsItem
      setScenarioInputs(scenarioInputsNew)

      let scenarioMDAsNew = [...scenarioMDAs]
      let MDAsItem = scenarioMDAsNew[correctTabIndex]
      const returnedmda2015 = JSON.parse(resultObject)
      MDAsItem = {
        time: [...returnedmda2015.mda2015.time],
        coverage: [...returnedmda2015.mda2015.coverage],
        adherence: [...returnedmda2015.mda2015.adherence],
        bednets: [...returnedmda2015.mda2015.bednets],
        regimen: [...returnedmda2015.mda2015.regimen],
      }
      scenarioMDAsNew[correctTabIndex] = MDAsItem
      setScenarioMDAs(scenarioMDAsNew)
    }
    setSimInProgress(false)
    // console.log('isNewScenario', isNewScenario)
    if (isNewScenario === true) {
      setTabLength(tabLength + 1)
      setTabIndex(tabLength > 5 ? 4 : tabLength)
    }
  */
  };

  const switchScenario = ( id ) => {

    try {
      console.log( `SimulatorLoader asked to switchScenario( ${id} ) from currentScenario ${currentScenarioId}` );

      const newScenarioData = SessionStorage.fetchScenario( id );
      console.log( `SimulatorLoader loaded newScenarioData for ${newScenarioData.id}` );
      setCurrentScenarioData( newScenarioData );
      setCurrentScenarioId( newScenarioData.id );

      console.log( `SimulatorLoader switched scenario to ${newScenarioData.id}: "${newScenarioData.label}"` );
    }

    catch ( e ) {
      setScenarioLoadingError( e.message );
    }
    
  };

  const removeScenario = ( id ) => {

    SessionStorage.removeScenario( id );

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

  // 2nd-arg empty array makes this a componentDidMount equivalent - only re-run if {nothing} changes
  useEffect(
    () => {

      const scenarioKeys = SessionStorage.scenarioKeys; 

      console.log( `SimulatorLoader mount-time scenario load, setting scenarioKeys:`, scenarioKeys );
      setNtdScenarioKeys( scenarioKeys );

      if ( scenarioKeys.length === 0 ) {
        console.log( "CREATING NEW SCENARIO" );
        runNewScenario();
      }

      if( !currentScenarioId && scenarioKeys.length ) {
        try {
          const firstScenarioData = SessionStorage.fetchScenario( scenarioKeys[ 0 ].id );

          console.log( `SimulatorLoader setting currentScenarioData to ${scenarioKeys[ 0 ].label} (id ${scenarioKeys[ 0 ].id})` );
          setCurrentScenarioData( firstScenarioData );

          console.log( `SimulatorLoader setting currentScenarioKey to ${scenarioKeys[ 0 ].id}` );
          setCurrentScenarioId( scenarioKeys[ 0 ].id );
        }
        catch ( e ) {
          setScenarioLoadingError( e.message );
        }
      }
    } ,
    // eslint-disable-next-line
    []
  );

  return (
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
        simulationProgress={simulationProgress}
        setSimulationProgress={setSimulationProgress}
      />
  );
}

export default SimulatorLoader;
