// store.js
import React, { createContext, useContext, useReducer } from 'react';

import SessionStorage from 'pages/components/simulator/helpers/sessionStorage';

const SimulatorStoreContext = createContext();

const initialState = ( () => {

    const storedState = SessionStorage.simulatorState;

    if ( storedState ) {
      delete storedState.lastUpdateType;
    }

    return storedState ? storedState : {

      /*
       * These are the default settings to be used per-scenario and are
       * injected into reducer state in src/pages/components/simulator/helpers/iuLoader.js
       * via dispatchSimState( type: 'everything', defaults )
       *
       *	covN: 0
       *	coverage: 90
       *	endemicity: 10
       *	macrofilaricide: 65
       *	mda: 2
       *	mdaRegimen: "xIA"
       *	mdaSixMonths: 6
       *	microfilaricide: 65
       *	rho: 0.2
       *	rhoBComp: 0
       *	rhoCN: 0
       *	runs: 10
       *	species: 0
       *	v_to_hR: 0
       *	vecCap: 0
       *	vecComp: 0
       *	vecD: 0
      */
      settings: {
        covN: 0, // $("#bedNetCoverage").val(),
        coverage: 90, // $("#MDACoverage").val(),
        endemicity: 10, // $("#endemicity").val(),
        macrofilaricide: 65, // $("#Macrofilaricide").val(),
        mda: 2, // $("#inputMDARounds").val(),
        mdaRegimen: 'xIA', // $("input[name=mdaRegimenRadios]:checked").val(),
        mdaSixMonths: 6, // $("input:radio[name=mdaSixMonths]:checked").val(),
        microfilaricide: 65, // $("#Microfilaricide").val(),
        rho: 0.2, // $("#sysAdherence").val(),
        rhoBComp: 0, // $("#brMda").val(),
        rhoCN: 0, // $("#bedNetMda").val(),
        runs: 10, // $("#runs").val()
        species: 0, // $("input[name=speciesRadios]:checked").val(),
        specificPrediction: null, // null or {}
        specificPredictionIndex: -1, // null or {}
        v_to_hR: 0, // $("#insecticideCoverage").val(),
        vecCap: 0, // $("#vectorialCapacity").val(),
        vecComp: 0, //$("#vectorialCompetence").val(),
        vecD: 0, //$("#vectorialDeathRate").val(),
      },

      IUData: {
        id: null, //which IU is loaded if any
        mdaObj: null, // historic mdaObj for IU
        params: null, // parms object for IU
      },

  }
} )();

const reducer = ( incomingSimState, action ) => {

  const simState = {
    ...incomingSimState,
    lastUpdateType: action.type
  };

  switch (action.type) {
    case 'everything':
      console.log( 'SimulatorStore setting everything:', action.payload );
      return {
        ...simState,
        ...action.payload,
      }
    case 'specificPrediction':
      return {
        ...simState,
        settings: { ...simState.settings, specificPrediction: action.payload }
      }
    case 'specificPredictionIndex':
      return {
        ...simState,
        settings: { ...simState.settings, specificPredictionIndex: action.payload }
      }
    case 'everythingbuthistoric':
      let newIUDataall = { ...simState.IUData }
      return {
        ...simState,
        ...action.payload,
        IUData: newIUDataall,
      }
    case 'IUData':
      return {
        ...simState,
        IUData: action.payload,
      }
    case 'mdaObj':
      let newIUDatamda = { ...simState.IUData }
      newIUDatamda.mdaObj = action.payload
      return {
        ...simState,
        IUData: newIUDatamda,
      }
    case 'params':
      let newIUDataparams = { ...simState.IUData }
      newIUDataparams.params = action.payload
      return {
        ...simState,
        IUData: newIUDataparams,
      }
    case 'coverage':
      return {
        ...simState,
       settings: { ...simState.settings, coverage: action.payload }
      }
    case 'adherence':
      return {
        ...simState,
        adherence: action.payload,
      }
    case 'mda':
      return {
        ...simState,
        settings: { ...simState.settings, mda: action.payload }
      }
    case 'mdaSixMonths':
      return {
        ...simState,
        settings: { ...simState.settings, mdaSixMonths: action.payload }
      }
    case 'endemicity':
      return {
        ...simState,
        settings: { ...simState.settings, endemicity: action.payload }
      }
    case 'covN':
      return {
        ...simState,
        settings: { ...simState.settings, covN: action.payload }
      }
    case 'v_to_hR':
      return {
        ...simState,
        settings: { ...simState.settings, v_to_hR: action.payload }
      }
    case 'vecCap':
      return {
        ...simState,
        settings: { ...simState.settings, vecCap: action.payload }
      }
    case 'vecComp':
      return {
        ...simState,
        settings: { ...simState.settings, vecComp: action.payload }
      }
    case 'vecD':
      return {
        ...simState,
        settings: { ...simState.settings, vecD: action.payload }
      }
    case 'mdaRegimen':
      return {
        ...simState,
        settings: { ...simState.settings, mdaRegimen: action.payload }
      }
    case 'rho':
      return {
        ...simState,
        settings: { ...simState.settings, rho: action.payload }
      }
    case 'rhoBComp':
      return {
        ...simState,
        settings: { ...simState.settings, rhoBComp: action.payload }
      }
    case 'rhoCN':
      return {
        ...simState,
        settings: { ...simState.settings, rhoCN: action.payload }
      }
    case 'species':
      return {
        ...simState,
        settings: { ...simState.settings, species: action.payload }
      }
    case 'macrofilaricide':
      return {
        ...simState,
        settings: { ...simState.settings, macrofilaricide: action.payload }
      }
    case 'microfilaricide':
      return {
        ...simState,
        settings: { ...simState.settings, microfilaricide: action.payload }
      }
    case 'runs':
      return {
        ...simState,
        settings: { ...simState.settings, runs: action.payload }
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
};

const simulatorStoreConsumer = ( { simState } ) => {

//  console.log( `simulatorStoreConsumer saving simState on update type ${simState.lastUpdateType}:`, simState );

  /*
   * only update the simulator state in session storage on a typed action,
   * i.e. not on reload/default reducer state hydration
   */
  if( !simState.lastUpdateType ) {
    return;
  }

  SessionStorage.simulatorState = simState;
};

export const SimulatorStoreProvider = ( { children } ) => {

  const [ simState, dispatchSimState ] = useReducer( reducer, initialState );

  return (
    <React.Fragment>
      <SimulatorStoreContext.Provider value={{ simState, dispatchSimState }}>

        <SimulatorStoreContext.Consumer>
          { simulatorStoreConsumer }
        </SimulatorStoreContext.Consumer>

        {children}

      </SimulatorStoreContext.Provider>
    </React.Fragment>
  )
}

export const useSimulatorStore = () => useContext(SimulatorStoreContext);
