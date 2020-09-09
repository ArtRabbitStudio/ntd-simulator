// store.js
import React, { createContext, useContext, useReducer } from 'react'
import SessionStorage from '../pages/components/simulator/helpers/sessionStorage';

const SimulatorStoreContext = createContext()
const initialState = {

/*
 * These are per-scenario and are injected in src/pages/components/simulator/helpers/iuLoader.js
 * via dispatchSimState( type: 'everything', defaults )
 *
 *	covN: 0
 *	coverage: 65
 *	endemicity: 10
 *	macrofilaricide: 65
 *	mda: 1
 *	mdaRegimen: "xIA"
 *	mdaSixMonths: 12
 *	microfilaricide: 65
 *	rho: 0.35
 *	rhoBComp: 0
 *	rhoCN: 0
 *	runs: 10
 *	scenarioLabels: {}
 *	species: 0
 *	v_to_hR: 0
 *	vecCap: 0
 *	vecComp: 0
 *	vecD: 0
*/

  scenarioLabels: {},
  coverage: 90, // $("#MDACoverage").val(),
  mda: 2, // $("#inputMDARounds").val(),
  mdaSixMonths: 6, // $("input:radio[name=mdaSixMonths]:checked").val(),
  endemicity: 10, // $("#endemicity").val(),
  covN: 0, // $("#bedNetCoverage").val(),
  v_to_hR: 0, // $("#insecticideCoverage").val(),
  vecCap: 0, // $("#vectorialCapacity").val(),
  vecComp: 0, //$("#vectorialCompetence").val(),
  vecD: 0, //$("#vectorialDeathRate").val(),
  mdaRegimen: 'xIA', // $("input[name=mdaRegimenRadios]:checked").val(),
  rho: 0.2, // $("#sysAdherence").val(),
  rhoBComp: 0, // $("#brMda").val(),
  rhoCN: 0, // $("#bedNetMda").val(),
  species: 0, // $("input[name=speciesRadios]:checked").val(),
  /* macrofilaricide: 65, // $("#Macrofilaricide").val(),
  microfilaricide: 65, // $("#Microfilaricide").val(), */
  runs: 5, // $("#runs").val()
  defaultParams: null,
  IUData: {
    id: null, //which IU is loaded if any
    mdaObj: null, // historic mdaObj for IU
    params: null, // parms object for IU
  },
  defaultPrediction: null, // future mdaObjPrediction for IU - user sets on setup page
  tweakedPrediction: null, // future mdaObjPrediction for IU
  specificPrediction: null, // null or {}
  specificPredictionIndex: -1, // null or {}
  needsRerun: false,
}

const reducer = (simState, action) => {
  switch (action.type) {
    case 'everything':
      return {
        ...simState,
        ...action.payload,
      }
    case 'needsRerun':
      return {
        ...simState,
        needsRerun: action.payload,
      }
    case 'scenarioLabel':
      let newLabels = {...simState.scenarioLabels}
      newLabels[action.scenarioId] =
        action.payload
      return {
        ...simState,
        scenarioLabels: newLabels,
      }
    case 'specificPrediction':
      return {
        ...simState,
        specificPrediction: action.payload,
      }
    case 'specificPredictionIndex':
      return {
        ...simState,
        specificPredictionIndex: action.payload,
      }
    case 'defaultPrediction':
      return {
        ...simState,
        defaultPrediction: action.payload,
      }
    case 'tweakedPrediction':
      return {
        ...simState,
        tweakedPrediction: action.payload,
      }
    case 'tweakedCoverage':
      return {
        ...simState,
        tweakedPrediction: {
          ...simState.tweakedPrediction,
          coverage: action.payload,
        },
      }
    case 'tweakedAdherence':
      return {
        ...simState,
        tweakedPrediction: {
          ...simState.tweakedPrediction,
          adherence: action.payload,
        },
      }
    case 'tweakedBednets':
      return {
        ...simState,
        tweakedPrediction: {
          ...simState.tweakedPrediction,
          bednets: action.payload,
        },
      }
    case 'tweakedRegimen':
      return {
        ...simState,
        tweakedPrediction: {
          ...simState.tweakedPrediction,
          regimen: action.payload,
        },
      }
    case 'tweakedActive':
      return {
        ...simState,
        tweakedPrediction: {
          ...simState.tweakedPrediction,
          active: action.payload,
        },
      }
    case 'tweakedBeenFiddledWith':
      let newBeenFiddledWith = [...simState.tweakedPrediction.beenFiddledWith]
      newBeenFiddledWith[action.payload] = true
      return {
        ...simState,
        tweakedPrediction: {
          ...simState.tweakedPrediction,
          beenFiddledWith: [...newBeenFiddledWith],
        },
      }
    case 'resetScenario':
      console.log( simState );
      return {
        ...simState,
        ...simState.defaultParams,
        tweakedPrediction: {
          time: [...simState.defaultPrediction.time],
          coverage: [...simState.defaultPrediction.coverage],
          adherence: [...simState.defaultPrediction.adherence],
          bednets: [...simState.defaultPrediction.bednets],
          regimen: [...simState.defaultPrediction.regimen],
          active: [...simState.defaultPrediction.active],
          beenFiddledWith: [...simState.defaultPrediction.beenFiddledWith],
        },
        needsRerun: false,
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
    /*     case 'IUid':
      let newIUData = { ...simState.IUData }
      newIUData.id = action.payload
      return {
        ...simState,
        IUData: newIUData,
      } */
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
        coverage: action.payload,
        defaultParams: { ...simState.defaultParams, coverage: action.payload },
      }
    case 'adherence':
      return {
        ...simState,
        adherence: action.payload,
        defaultParams: {
          ...simState.defaultParams,
          adherence: action.payload,
        },
      }
    case 'mda':
      return {
        ...simState,
        mda: action.payload,
      }
    case 'mdaSixMonths':
      return {
        ...simState,
        mdaSixMonths: action.payload,
        defaultParams: {
          ...simState.defaultParams,
          mdaSixMonths: action.payload,
        },
      }
    case 'endemicity':
      return {
        ...simState,
        endemicity: action.payload,
      }
    case 'covN':
      return {
        ...simState,
        covN: action.payload,
        defaultParams: { ...simState.defaultParams, covN: action.payload },
      }
    case 'v_to_hR':
      return {
        ...simState,
        v_to_hR: action.payload,
      }
    case 'vecCap':
      return {
        ...simState,
        vecCap: action.payload,
      }
    case 'vecComp':
      return {
        ...simState,
        vecComp: action.payload,
      }
    case 'vecD':
      return {
        ...simState,
        vecD: action.payload,
      }
    case 'mdaRegimen':
      return {
        ...simState,
        mdaRegimen: action.payload,
        defaultParams: {
          ...simState.defaultParams,
          mdaRegimen: action.payload,
        },
      }
    case 'rho':
      return {
        ...simState,
        rho: action.payload,
        defaultParams: { ...simState.defaultParams, rho: action.payload },
      }
    case 'rhoBComp':
      return {
        ...simState,
        rhoBComp: action.payload,
      }
    case 'rhoCN':
      return {
        ...simState,
        rhoCN: action.payload,
      }
    case 'species':
      return {
        ...simState,
        species: action.payload,
        defaultParams: { ...simState.defaultParams, species: action.payload },
      }
    case 'macrofilaricide':
      return {
        ...simState,
        macrofilaricide: action.payload,
      }
    case 'microfilaricide':
      return {
        ...simState,
        microfilaricide: action.payload,
      }
    case 'runs':
      return {
        ...simState,
        runs: action.payload,
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

export const SimulatorStoreProvider = ({ children }) => {
  const [simState, dispatchSimState] = useReducer(reducer, initialState)
  return (
    <React.Fragment>
      <SimulatorStoreContext.Provider value={{ simState, dispatchSimState }}>

        <SimulatorStoreContext.Consumer>
          { value => { SessionStorage.simState = value.simState; } }
        </SimulatorStoreContext.Consumer>
      
        {children}

      </SimulatorStoreContext.Provider>
    </React.Fragment>
  )
}

export const useSimulatorStore = () => useContext(SimulatorStoreContext)
