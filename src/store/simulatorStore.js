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

const reducer = (simParams2, action) => {
  switch (action.type) {
    case "everything":
      return {
        ...simParams2,
        ...action.payload,
      };
    case "coverage":
      return {
        ...simParams2,
        coverage: action.payload,
      };
    case "mda":
      return {
        ...simParams2,
        mda: action.payload,
      };
    case "mdaSixMonths":
      return {
        ...simParams2,
        mdaSixMonths: action.payload,
      };
    case "covN":
      return {
        ...simParams2,
        covN: action.payload,
      };
    case "mdaRegimen":
      return {
        ...simParams2,
        mdaRegimen: action.payload,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const StoreProvider = ({ children }) => {
  const [simParams2, dispatchSimParams] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={{ simParams2, dispatchSimParams }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
