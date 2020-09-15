// store.js
import React, { createContext, useContext, useReducer } from 'react'

import SessionStorage from '../pages/components/simulator/helpers/sessionStorage';

export const ScenarioStoreConstants = {
  ACTION_TYPES: {
    SET_LOADED_SCENARIO_DATA: 'setLoadedScenarioData',
    UPDATE_SCENARIO_DATA: 'updateScenarioData',
    UPDATE_SCENARIO_LABEL_BY_ID: 'updateScenarioLabelById',
    UPDATE_SCENARIO_SETTING_BY_ID: 'updateScenarioSettingById',
    UPDATE_SCENARIO_MDA_FUTURE_SETTING_BY_ID_AND_IDX: 'updateScenarioMdaFutureSettingByIdAndIdx',
    SWITCH_SCENARIO_BY_ID: 'switchScenarioById',
    MARK_SCENARIO_DIRTY_BY_ID: 'markScenarioDirtyById',
    REMOVE_SCENARIO_BY_ID: 'removeScenarioById',
    SET_NEW_SCENARIO_DATA: 'setNewScenarioData',
    SET_SCENARIO_KEYS: 'setScenarioKeys'
  }
};

const ScenarioStoreContext = createContext();

const initialState = {
  updated: new Date(),
  scenarioKeys: [],
  scenarioData: {},
  currentScenarioId: null
};

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

//  console.log( 'ScenarioStore got action:', action.type );

  let newState = {
    ...scenarioState,
    lastUpdateType: action.type
  };

  try {

    switch( action.type ) {

      case ScenarioStoreConstants.ACTION_TYPES.SET_LOADED_SCENARIO_DATA:
        newState.scenarioData[ action.scenario.id ] = action.scenario;
        break;


      case ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_DATA:
        newState.scenarioData[ action.scenario.id ] = action.scenario;
        newState.updatedScenarioId = action.scenario.id;
        break;


      case ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_LABEL_BY_ID:
        newState.scenarioData[ action.id ].label = action.label;
        newState.updatedScenarioId = action.id;
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


        newState.updatedScenarioId = action.id;
        break;


      case ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_MDA_FUTURE_SETTING_BY_ID_AND_IDX:
        newState.scenarioData[ action.id ].mdaFuture[ action.key ][ action.idx ] = action.value;
        newState.updatedScenarioId = action.id;
        newState.scenarioData[ action.id ].isDirty = true;
        break;


      case ScenarioStoreConstants.ACTION_TYPES.SET_NEW_SCENARIO_DATA:
        newState.scenarioData[ action.scenario.id ] = action.scenario;
        newState.updatedScenarioId = action.scenario.id;
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
        newState.removedScenarioId = action.id;

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

        console.log( `scenarioStoreConsumer storing scenario ${scenarioState.updatedScenarioId} on update type ${scenarioState.lastUpdateType}` );
        const scenarioData = scenarioState.scenarioData[ scenarioState.updatedScenarioId ];
        SessionStorage.storeScenario( scenarioData );
        break;

      case ScenarioStoreConstants.ACTION_TYPES.REMOVE_SCENARIO_BY_ID:

        console.log( `scenarioStoreConsumer got removed scenario id ${scenarioState.removedScenarioId}` );
        SessionStorage.removeScenario( scenarioState.removedScenarioId );
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
