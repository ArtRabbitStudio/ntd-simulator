// store.js
import React, { createContext, useContext, useReducer } from 'react'

import SessionStorage from 'pages/components/simulator/helpers/sessionStorage';

export const ScenarioStoreConstants = {
  ACTION_TYPES: {
    SET_LOADED_SCENARIO_DATA: 'setLoadedScenarioData',
    ADD_SCENARIO_DATA: 'addScenarioData',
    SAVE_SCENARIO_DATA: 'saveScenarioData',
    SAVE_SCENARIO_BY_ID: 'saveScenarioById',
    UPDATE_SCENARIO_DATA: 'updateScenarioData',
    UPDATE_SCENARIO_LABEL_BY_ID: 'updateScenarioLabelById',
    UPDATE_SCENARIO_SETTING_BY_ID: 'updateScenarioSettingById',
    UPDATE_SCENARIO_MDA_FUTURE_SETTING_BY_ID_AND_IDX: 'updateScenarioMdaFutureSettingByIdAndIdx',
    SET_SCENARIO_MDA_FUTURE_BY_ID: 'setScenarioMdaFutureById',
    SWITCH_SCENARIO_BY_ID: 'switchScenarioById',
    MARK_SCENARIO_DIRTY_BY_ID: 'markScenarioDirtyById',
    REMOVE_SCENARIO_BY_ID: 'removeScenarioById',
    SET_NEW_SCENARIO_DATA: 'setNewScenarioData',
    SET_SCENARIO_KEYS: 'setScenarioKeys',
    RESET_SCENARIO_STATE: 'resetScenarioState',
  }
};

const ScenarioStoreContext = createContext();

const getInitState = () => {
  return {
    updated: new Date(),
    scenarioKeys: [],
    scenarioData: {},
    currentScenarioId: null
  };
};

const initialState = getInitState();

const settingToMdaFutureMap = {
  coverage: 'coverage',
  covN: 'bednets',
  rho: 'adherence',
  mdaRegimen: 'regimen'
};

const reducer = ( scenarioState, action ) => {

  if ( !action.type ) {
    throw new Error ( 'ScenarioStore got type-less action:', action );
  }

  let newState = {
    ...scenarioState,
    lastUpdateType: action.type
  };

  try {

    switch( action.type ) {

      case ScenarioStoreConstants.ACTION_TYPES.SET_LOADED_SCENARIO_DATA:
        newState.scenarioData[ action.scenario.id ] = action.scenario;
        break;


      case ScenarioStoreConstants.ACTION_TYPES.ADD_SCENARIO_DATA:
        newState.scenarioData[ action.scenario.id ] = action.scenario;
        newState.lastUpdatedScenarioId = action.scenario.id;
        break;


      case ScenarioStoreConstants.ACTION_TYPES.SAVE_SCENARIO_DATA:
        newState.scenarioData[ action.scenario.id ] = action.scenario;
        delete newState.scenarioData[ action.scenario.id ].labelChanged;
        newState.lastUpdatedScenarioId = action.scenario.id;
        break;


      case ScenarioStoreConstants.ACTION_TYPES.SAVE_SCENARIO_BY_ID:
        delete newState.scenarioData[ action.id ].labelChanged;
        newState.lastUpdatedScenarioId = action.id;
        break;


      case ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_DATA:
        newState.scenarioData[ action.scenario.id ] = action.scenario;
        delete newState.scenarioData[ action.scenario.id ].labelChanged;
        newState.lastUpdatedScenarioId = action.scenario.id;
        break;


      case ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_LABEL_BY_ID:
        newState.scenarioData[ action.id ].label = action.label;
        newState.scenarioData[ action.id ].labelChanged = true;
        newState.lastUpdatedScenarioId = action.id;
        break;


      case ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_SETTING_BY_ID:
        newState.scenarioData[ action.id ].settings[ action.key ] = action.value;

        // copy this per-scenario setting across to all the MDA rounds for this scenario
        if( Object.keys( settingToMdaFutureMap ).includes( action.key ) ) {
          const mdaFutureKey = settingToMdaFutureMap[ action.key ];
          newState.scenarioData[ action.id ].mdaFuture[ mdaFutureKey ].forEach(
            ( v, idx ) => {
              newState.scenarioData[ action.id ].mdaFuture[ mdaFutureKey ][ idx ] = action.value;
            }
          );
        }

        /*
         * work out whether a specific prediction (e.g. 6 months covid) is set
         * either in existing state or in new action
         */
        const specificPredictionIndex =
          action.key === 'mdaSixMonths'
            ? newState.scenarioData[ action.id ].settings.specificPredictionIndex
            : action.key === 'specificPredictionIndex'
              ? action.value
              : null;

        /*
         * work out if it's annual or every 6 months, either
         * from existing state or in new action
         */
        const mdaSixMonths = action.key === 'mdaSixMonths'
          ? action.value
          : newState.scenarioData[ action.id ].settings.mdaSixMonths;

        /*
         * assuming there's a proper prediction set, block off any years in the prediction
         * and then work out 6-monthly/yearly after that
         */
        if ( specificPredictionIndex !== null && typeof specificPredictionIndex !== 'undefined' ) {

          newState.scenarioData[ action.id ].mdaFuture.active = newState.scenarioData[ action.id ].mdaFuture.active.map(

            ( v, idx ) => {

              let active;

              if( idx <= specificPredictionIndex ) {
                active = false;
              }

              else {
                active = mdaSixMonths === 6 ? true : ( idx % 2 ? false : true );
              }

              return active;
            }
          );

        }

        newState.lastUpdatedScenarioId = action.id;
        break;


      case ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_MDA_FUTURE_SETTING_BY_ID_AND_IDX:
        newState.scenarioData[ action.id ].mdaFuture[ action.key ][ action.idx ] = action.value;
        newState.lastUpdatedScenarioId = action.id;
        newState.scenarioData[ action.id ].isDirty = true;
        break;


      case ScenarioStoreConstants.ACTION_TYPES.SET_SCENARIO_MDA_FUTURE_BY_ID:
        newState.scenarioData[ action.id ].mdaFuture = action.mdaFuture;
        break;


      case ScenarioStoreConstants.ACTION_TYPES.SET_NEW_SCENARIO_DATA:
        newState.scenarioData[ action.scenario.id ] = action.scenario;
        newState.lastUpdatedScenarioId = action.scenario.id;
        newState.currentScenarioId = action.scenario.id;
        break;


      case ScenarioStoreConstants.ACTION_TYPES.SWITCH_SCENARIO_BY_ID:
        newState.currentScenarioId = action.id;
        break;


      case ScenarioStoreConstants.ACTION_TYPES.MARK_SCENARIO_DIRTY_BY_ID:
        newState.scenarioData[ action.id ].isDirty = true;
        break;


      case ScenarioStoreConstants.ACTION_TYPES.REMOVE_SCENARIO_BY_ID:

        // remove from state
        delete( newState.scenarioData[ action.id ] );

        // mark it removed for consumer
        newState.lastUpdatedScenarioId = action.id;

        // remove it from ordered key list
        newState.scenarioKeys = newState.scenarioKeys.filter(
          ( { id, label } ) => id !== action.id
        );

        // update the current selection if any left
        if( newState.scenarioKeys.length ) {
          const lastScenarioKeyIdx = newState.scenarioKeys.length - 1;
          newState.currentScenarioId = newState.scenarioKeys[ lastScenarioKeyIdx ].id;
        }

        break;


      case ScenarioStoreConstants.ACTION_TYPES.SET_SCENARIO_KEYS:
        newState.scenarioKeys = action.keys;
        break;


      case ScenarioStoreConstants.ACTION_TYPES.RESET_SCENARIO_STATE:
        newState = getInitState();
        break;


      default:
     //   console.log( `=> scenarioStore got OOB update type ${action.type}:`, action );
        break;
    }

  }

  catch ( e ) {
    console.warn( e.message );
  }


  return {
    ...newState,
    updated: new Date()
  };

};

const scenarioStoreConsumer = ( { scenarioState } ) => {

  if( !scenarioState.lastUpdateType ) {
    return;
  }

//  console.log( `scenarioStoreConsumer got update type ${scenarioState.lastUpdateType}` );

  try {
    switch( scenarioState.lastUpdateType ) {
      /* eslint-disable no-fallthrough */

      case ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_DATA:
      case ScenarioStoreConstants.ACTION_TYPES.SET_NEW_SCENARIO_DATA:

        console.log( `ScenarioStoreContext.Consumer storing scenario ${scenarioState.lastUpdatedScenarioId} on update type ${scenarioState.lastUpdateType}` );
        const scenarioData = scenarioState.scenarioData[ scenarioState.lastUpdatedScenarioId ];
        SessionStorage.storeScenario( scenarioData );
        break;

      case ScenarioStoreConstants.ACTION_TYPES.SAVE_SCENARIO_DATA:
      case ScenarioStoreConstants.ACTION_TYPES.SAVE_SCENARIO_BY_ID:

        console.log( `ScenarioStoreContext.Consumer saving existing scenario ${scenarioState.lastUpdatedScenarioId} on update type ${scenarioState.lastUpdateType}` );
        SessionStorage.storeScenario( scenarioState.scenarioData[ scenarioState.lastUpdatedScenarioId ] );
        break;

      case ScenarioStoreConstants.ACTION_TYPES.REMOVE_SCENARIO_BY_ID:

        console.log( `ScenarioStoreContext.Consumer got removed scenario id ${scenarioState.lastUpdatedScenarioId}` );
        SessionStorage.removeScenario( scenarioState.lastUpdatedScenarioId );
        break;

      // TODO work out why this doesn't get triggered
      case ScenarioStoreConstants.ACTION_TYPES.RESET_SCENARIO_STATE:
        console.log( `ScenarioStoreContext.Consumer resetting scenario state in storage` );
        SessionStorage.simulatorState = null;
        SessionStorage.removeAllScenarios();
        break;

      default:
     //   console.info( `-> scenarioStoreConsumer got OOB update type ${scenarioState.lastUpdateType}`, scenarioState );
        break;

    }
  }

  catch ( e ) {
    console.warn( e.message );
  }

};

export const ScenarioStoreProvider = ( { children } ) => {

  const [ scenarioState, dispatchScenarioStateUpdate ] = useReducer( reducer, initialState );

  return (

    <React.Fragment>

      <ScenarioStoreContext.Provider value={{ scenarioState, dispatchScenarioStateUpdate }}>

        <ScenarioStoreContext.Consumer>
          { scenarioStoreConsumer }
        </ScenarioStoreContext.Consumer>

        {children}

      </ScenarioStoreContext.Provider>

    </React.Fragment>
  );
};

export const useScenarioStore = () => { return useContext( ScenarioStoreContext ); }
