import Papa from "papaparse";


export const loadAllIUhistoricData = async (simParams,dispatchSimParams,implementationUnit) => {
    const doWeHaveData = simParams.IUData.IUloaded === implementationUnit;
    if ( !doWeHaveData ) {
      const mdaData = await loadMda();
      const params = await loadParams();
      dispatchSimParams({
        type: "IUData", payload: {
          IUloaded: implementationUnit,
          mdaObj: mdaData,
          params: params
        }
      });
    }
    
    
}


export const loadMda = async () => {
  const mdaResponse = await fetch("/data/simulator/MLI30034-mda.csv");
  let reader = mdaResponse.body.getReader();
  let decoder = new TextDecoder("utf-8");
  const mdaResult = await reader.read();
  const mdaCSV = decoder.decode(mdaResult.value);
  // console.log(mdaCSV);
  const mdaJSON = Papa.parse(mdaCSV, { header: true });
  // console.log(mdaJSON.data);
  let newMdaObj = {
    time: mdaJSON.data.map((item) => Number(item.time)),
    coverage: mdaJSON.data.map((item) => Number(item.coverage)),
    regimen: mdaJSON.data.map((item) => item.regimen),
    bednets: mdaJSON.data.map((item) => Number(item.bednets)),
    adherence: mdaJSON.data.map((item) => Number(item.adherence)),
    active: mdaJSON.data.map((item) => true),
  };
  // returns one more line than it's ought to?
  newMdaObj.time.length = 20;
  newMdaObj.coverage.length = 20;
  newMdaObj.regimen.length = 20;
  newMdaObj.bednets.length = 20;
  newMdaObj.adherence.length = 20;
  newMdaObj.active.length = 20;

  return newMdaObj;
};

export const loadParams = async () => {
  // populate parametersJSON
  const IUParamsResponse = await fetch("/data/simulator/MLI30034-params.csv");
  let reader = IUParamsResponse.body.getReader();
  let decoder = new TextDecoder("utf-8");
  const IUParamsResult = await reader.read();
  const IUParamsCSV = decoder.decode(IUParamsResult.value);
  const IUParamsJSON = Papa.parse(IUParamsCSV, { header: true });
  //   console.log(IUParamsJSON.data);
  let newParams = {
    Population: IUParamsJSON.data.map((item) => Number(item.Population)),
    shapeRisk: IUParamsJSON.data.map((item) => Number(item.shapeRisk)),
    v_to_h: IUParamsJSON.data.map((item) => Number(item.v_to_h)),
    aImp: IUParamsJSON.data.map((item) => Number(item.aImp)),
    aImp_2000: IUParamsJSON.data.map((item) => Number(item.aImp_2000)),
    aImp_2001: IUParamsJSON.data.map((item) => Number(item.aImp_2001)),
    aImp_2002: IUParamsJSON.data.map((item) => Number(item.aImp_2002)),
    aImp_2003: IUParamsJSON.data.map((item) => Number(item.aImp_2003)),
    aImp_2004: IUParamsJSON.data.map((item) => Number(item.aImp_2004)),
    aImp_2005: IUParamsJSON.data.map((item) => Number(item.aImp_2005)),
    aImp_2006: IUParamsJSON.data.map((item) => Number(item.aImp_2006)),
    aImp_2007: IUParamsJSON.data.map((item) => Number(item.aImp_2007)),
    aImp_2008: IUParamsJSON.data.map((item) => Number(item.aImp_2008)),
    aImp_2009: IUParamsJSON.data.map((item) => Number(item.aImp_2009)),
    aImp_2010: IUParamsJSON.data.map((item) => Number(item.aImp_2010)),
    aImp_2011: IUParamsJSON.data.map((item) => Number(item.aImp_2011)),
    aImp_2012: IUParamsJSON.data.map((item) => Number(item.aImp_2012)),
    aImp_2013: IUParamsJSON.data.map((item) => Number(item.aImp_2013)),
    aImp_2014: IUParamsJSON.data.map((item) => Number(item.aImp_2014)),
    aImp_2015: IUParamsJSON.data.map((item) => Number(item.aImp_2015)),
    aImp_2016: IUParamsJSON.data.map((item) => Number(item.aImp_2016)),
    aImp_2017: IUParamsJSON.data.map((item) => Number(item.aImp_2017)),
    aImp_2018: IUParamsJSON.data.map((item) => Number(item.aImp_2018)),
    aImp_2019: IUParamsJSON.data.map((item) => Number(item.aImp_2019)),
    aImp_2020: IUParamsJSON.data.map((item) => Number(item.aImp_2020)),
  };
  return newParams;
};
