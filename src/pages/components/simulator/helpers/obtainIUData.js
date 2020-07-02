export const obtainIUData = (simParams, dispatchSimParams) => {
  // Store? Storage? Redirect.
  let IUData = simParams.IUData
  console.log(IUData)
  if (!IUData.IUloaded) {
    let simParamsFromLC = window.localStorage.getItem('simParams')
    simParamsFromLC = JSON.parse(simParamsFromLC)
    const IUDataFromLC =
      simParamsFromLC && simParamsFromLC.IUData ? simParamsFromLC.IUData : null
    IUData = IUDataFromLC && IUDataFromLC ? IUDataFromLC : null
    if (IUData) {
      dispatchSimParams({
        type: 'IUData',
        payload: IUDataFromLC,
      })
    } else {
      window.location.href = '/'
    }
    console.log(IUData)
  }
  return IUData
}
