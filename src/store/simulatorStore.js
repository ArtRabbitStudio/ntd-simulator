// store.js
import React, { createContext, useContext, useReducer, useState } from 'react'

const StoreContext = createContext()
const initialState = {
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
  macrofilaricide: 65, // $("#Macrofilaricide").val(),
  microfilaricide: 65, // $("#Microfilaricide").val(),
  runs: 5, // $("#runs").val()
  IUData: {
    IUloaded: null, //which IU is loaded if any
    mdaObj: null, // historic mdaObj for IU
    params: null, // parms object for IU
  },
  mdaObjDefaultPrediction: null, // future mdaObjPrediction for IU
  mdaObjTweakedPrediction: null, // future mdaObjPrediction for IU
  needsRerun: false,
}

const reducer = (simParams, action) => {
  switch (action.type) {
    case 'everything':
      return {
        ...simParams,
        ...action.payload,
      }
    case 'needsRerun':
      return {
        ...simParams,
        needsRerun: action.payload,
      }
    case 'mdaObjDefaultPrediction':
      return {
        ...simParams,
        mdaObjDefaultPrediction: action.payload,
      }
    case 'mdaObjTweakedPrediction':
      return {
        ...simParams,
        mdaObjTweakedPrediction: action.payload,
      }
    case 'resetTweakedPrediction':
      return {
        ...simParams,
        mdaObjTweakedPrediction: {
          time: [...simParams.mdaObjDefaultPrediction.time],
          coverage: [...simParams.mdaObjDefaultPrediction.coverage],
          adherence: [...simParams.mdaObjDefaultPrediction.adherence],
          bednets: [...simParams.mdaObjDefaultPrediction.bednets],
          regimen: [...simParams.mdaObjDefaultPrediction.regimen],
          active: [...simParams.mdaObjDefaultPrediction.active],
        },
        needsRerun: false,
      }
    case 'everythingbuthistoric':
      let newIUDataall = { ...simParams.IUData }
      return {
        ...simParams,
        ...action.payload,
        IUData: newIUDataall,
      }
    case 'IUData':
      return {
        ...simParams,
        IUData: action.payload,
      }
    case 'IUloaded':
      let newIUDataiuloaded = { ...simParams.IUData }
      newIUDataiuloaded.IUloaded = action.payload
      return {
        ...simParams,
        IUData: newIUDataiuloaded,
      }
    case 'mdaObj':
      let newIUDatamda = { ...simParams.IUData }
      newIUDatamda.mdaObj = action.payload
      return {
        ...simParams,
        IUData: newIUDatamda,
      }
    case 'params':
      let newIUDataparams = { ...simParams.IUData }
      newIUDataparams.params = action.payload
      return {
        ...simParams,
        IUData: newIUDataparams,
      }
    case 'coverage':
      return {
        ...simParams,
        coverage: action.payload,
      }
    case 'mda':
      return {
        ...simParams,
        mda: action.payload,
      }
    case 'mdaSixMonths':
      return {
        ...simParams,
        mdaSixMonths: action.payload,
      }
    case 'endemicity':
      return {
        ...simParams,
        endemicity: action.payload,
      }
    case 'covN':
      return {
        ...simParams,
        covN: action.payload,
      }
    case 'v_to_hR':
      return {
        ...simParams,
        v_to_hR: action.payload,
      }
    case 'vecCap':
      return {
        ...simParams,
        vecCap: action.payload,
      }
    case 'vecComp':
      return {
        ...simParams,
        vecComp: action.payload,
      }
    case 'vecD':
      return {
        ...simParams,
        vecD: action.payload,
      }
    case 'mdaRegimen':
      return {
        ...simParams,
        mdaRegimen: action.payload,
      }
    case 'rho':
      return {
        ...simParams,
        rho: action.payload,
      }
    case 'rhoBComp':
      return {
        ...simParams,
        rhoBComp: action.payload,
      }
    case 'rhoCN':
      return {
        ...simParams,
        rhoCN: action.payload,
      }
    case 'species':
      return {
        ...simParams,
        species: action.payload,
      }
    case 'macrofilaricide':
      return {
        ...simParams,
        macrofilaricide: action.payload,
      }
    case 'microfilaricide':
      return {
        ...simParams,
        microfilaricide: action.payload,
      }
    case 'runs':
      return {
        ...simParams,
        runs: action.payload,
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

export const StoreProvider = ({ children }) => {
  const [simParams, dispatchSimParams] = useReducer(reducer, initialState)
  return (
    <StoreContext.Provider value={{ simParams, dispatchSimParams }}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)
