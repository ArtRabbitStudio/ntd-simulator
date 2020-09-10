export const obtainIUData = (simState, dispatchSimState) => {
  // Store? Storage? Redirect.
  let IUData = simState.IUData
  //IUData)
  if (!IUData.id) {
    let simStateFromLC = window.localStorage.getItem('simState')
    simStateFromLC = JSON.parse(simStateFromLC)
    const IUDataFromLC =
      simStateFromLC && simStateFromLC.IUData ? simStateFromLC.IUData : null
    IUData = IUDataFromLC && IUDataFromLC ? IUDataFromLC : null
    if (IUData) {
      dispatchSimState({
        type: 'IUData',
        payload: IUDataFromLC,
      })
    } else {
      window.location.href = '/'
    }
    // console.log(IUData)
  }
  return IUData
}
