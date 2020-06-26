import Papa from "papaparse";

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
  };
  // returns one more line than it's ought to?
  console.log(newMdaObj);
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
  console.log(IUParamsJSON.data);
  let newParams = {
    Population: IUParamsJSON.data.map((item) => Number(item.Population)),
    shapeRisk: IUParamsJSON.data.map((item) => Number(item.shapeRisk)),
    v_to_h: IUParamsJSON.data.map((item) => Number(item.v_to_h)),
    aImp: IUParamsJSON.data.map((item) => Number(item.aImp)),
    aImp_2000: IUParamsJSON.data.map((item) => Number(item.aImp_2000)),
  };
  console.log(newParams);
  return newParams;
};
