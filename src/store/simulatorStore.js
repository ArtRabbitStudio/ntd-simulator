// store.js
import React, { createContext, useContext, useReducer, useState } from "react";

const StoreContext = createContext();
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
  mdaRegimen: 1, // $("input[name=mdaRegimenRadios]:checked").val(),
  rho: 0.2, // $("#sysAdherence").val(),
  rhoBComp: 0, // $("#brMda").val(),
  rhoCN: 0, // $("#bedNetMda").val(),
  species: 0, // $("input[name=speciesRadios]:checked").val(),
  macrofilaricide: 65, // $("#Macrofilaricide").val(),
  microfilaricide: 65, // $("#Microfilaricide").val(),
  runs: 5, // $("#runs").val()
};

const reducer = (simParams, action) => {
  switch (action.type) {
    case "everything":
      return {
        ...simParams,
        ...action.payload,
      };
    case "coverage":
      return {
        ...simParams,
        coverage: action.payload,
      };
    case "mda":
      return {
        ...simParams,
        mda: action.payload,
      };
    case "mdaSixMonths":
      return {
        ...simParams,
        mdaSixMonths: action.payload,
      };
    case "endemicity":
      return {
        ...simParams,
        endemicity: action.payload,
      };
    case "covN":
      return {
        ...simParams,
        covN: action.payload,
      };
    case "v_to_hR":
      return {
        ...simParams,
        v_to_hR: action.payload,
      };
    case "vecCap":
      return {
        ...simParams,
        vecCap: action.payload,
      };
    case "vecComp":
      return {
        ...simParams,
        vecComp: action.payload,
      };
    case "vecD":
      return {
        ...simParams,
        vecD: action.payload,
      };
    case "mdaRegimen":
      return {
        ...simParams,
        mdaRegimen: action.payload,
      };
    case "rho":
      return {
        ...simParams,
        rho: action.payload,
      };
    case "rhoBComp":
      return {
        ...simParams,
        rhoBComp: action.payload,
      };
    case "rhoCN":
      return {
        ...simParams,
        rhoCN: action.payload,
      };
    case "species":
      return {
        ...simParams,
        species: action.payload,
      };
    case "macrofilaricide":
      return {
        ...simParams,
        macrofilaricide: action.payload,
      };
    case "microfilaricide":
      return {
        ...simParams,
        microfilaricide: action.payload,
      };
    case "runs":
      return {
        ...simParams,
        runs: action.payload,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const StoreProvider = ({ children }) => {
  const [simParams, dispatchSimParams] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={{ simParams, dispatchSimParams }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
