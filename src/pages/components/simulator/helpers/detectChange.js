export const detectChange = (simParams, dispatchSimParams) => {
  //console.log('compare params')
  const observedSimParams = {
    coverage: simParams.coverage,
    mda: simParams.mda,
    mdaSixMonths: simParams.mdaSixMonths,
    endemicity: simParams.endemicity,
    covN: simParams.covN,
    v_to_hR: simParams.v_to_hR,
    vecCap: simParams.vecCap,
    vecComp: simParams.vecComp,
    vecD: simParams.vecD,
    mdaRegimen: simParams.mdaRegimen,
    rho: simParams.rho,
    rhoBComp: simParams.rhoBComp,
    rhoCN: simParams.rhoCN,
    species: simParams.species,
    runs: simParams.runs,
  }
  const changeDetected =
    JSON.stringify(observedSimParams) !==
    JSON.stringify(simParams.defaultParams)
  if (changeDetected) {
    /*console.log(
      '%c Param change detected! ',
      'background: #222; color: #bada55'
    )*/
    dispatchSimParams({
      type: 'needsRerun',
      payload: true,
    })
    return
  } else {
    //console.log('%c No Param changes. ', 'background: #222; color: #cc9900')
    dispatchSimParams({
      type: 'needsRerun',
      payload: false,
    })
  }
  const MDAchangeDetected =
    JSON.stringify(simParams.tweakedPrediction) !==
    JSON.stringify(simParams.defaultPrediction)
  if (MDAchangeDetected) {
    //console.log('%c MDA change detected! ', 'background: #222; color: #bada55')
    dispatchSimParams({
      type: 'needsRerun',
      payload: true,
    })
  } else {
    //console.log('%c No MDA changes. ', 'background: #222; color: #cc9900')
    dispatchSimParams({
      type: 'needsRerun',
      payload: false,
    })
  }
}
