import { diff } from 'deep-diff';

export const detectChange = (simState, dispatchSimState) => {
  //console.log('compare params')
  const observedSimParams = {
    coverage: simState.coverage,
    mda: simState.mda,
    mdaSixMonths: simState.mdaSixMonths,
    endemicity: simState.endemicity,
    covN: simState.covN,
    v_to_hR: simState.v_to_hR,
    vecCap: simState.vecCap,
    vecComp: simState.vecComp,
    vecD: simState.vecD,
    mdaRegimen: simState.mdaRegimen,
    rho: simState.rho,
    rhoBComp: simState.rhoBComp,
    rhoCN: simState.rhoCN,
    species: simState.species,
    runs: simState.runs,
  }
  const changeDetected =
    JSON.stringify(observedSimParams) !==
    JSON.stringify(simState.defaultParams)
  if (changeDetected) {
    console.log(
      '%c Param change detected! ',
      'background: #222; color: #bada55'
    )
    console.log( diff( observedSimParams, simState.defaultParams ) );
    dispatchSimState({
      type: 'needsRerun',
      payload: true,
    })
    return
  } else {
    console.log('%c No Param changes. ', 'background: #222; color: #cc9900')
    dispatchSimState({
      type: 'needsRerun',
      payload: false,
    })
  }
  const MDAchangeDetected =
    JSON.stringify(simState.tweakedPrediction) !==
    JSON.stringify(simState.defaultPrediction)
  if (MDAchangeDetected) {
    console.log('%c MDA change detected! ', 'background: #222; color: #bada55')
    console.log( diff( simState.tweakedPrediction, simState.defaultPrediction ) );
    dispatchSimState({
      type: 'needsRerun',
      payload: true,
    })
  } else {
    console.log('%c No MDA changes. ', 'background: #222; color: #cc9900')
    dispatchSimState({
      type: 'needsRerun',
      payload: false,
    })
  }
}
