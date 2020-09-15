import SessionStorage from './sessionStorage';

export const obtainIUData = ( simState, dispatchSimState ) => {

  let IUData = simState.IUData;

  if (!IUData.id) {

    let simStateFromLC = SessionStorage.simulatorState;

    console.log( 'obtainIUData retrieved simStateFromLC:', simStateFromLC );

    const IUDataFromLC =
      ( simStateFromLC && simStateFromLC.IUData ) ? simStateFromLC.IUData : null;

    IUData = ( IUDataFromLC && IUDataFromLC ) ? IUDataFromLC : null;

    if (IUData) {
      dispatchSimState( {
        type: 'IUData',
        payload: IUDataFromLC,
      } );
    }
    else {
      window.location.href = '/';
    }

  }

  return IUData;
}
