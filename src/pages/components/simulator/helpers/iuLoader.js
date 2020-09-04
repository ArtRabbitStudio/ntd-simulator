import Papa from 'papaparse'
import { last, filter, forEach } from 'lodash'
import {
  DISEASE_LIMF, DISEASE_TRACHOMA
} from '../../../../constants'

export const loadAllIUhistoricData = async (
  simParams,
  dispatchSimParams,
  implementationUnit,
  disease
) => {

  // TODO new param diesase 
  switch (disease) {
    default:
    case DISEASE_LIMF:

      break;
    case DISEASE_TRACHOMA:

      break;
  }

  // clear LS
  window.localStorage.removeItem('simParams')
 // window.localStorage.removeItem('scenarioIndex')
  window.localStorage.removeItem('sessionData')

  //const doWeHaveData = simParams.IUData.id === implementationUnit
  //console.log('doWeHaveData ? ', doWeHaveData)
  //console.log('implementationUnit ? ', implementationUnit)
  // if (!doWeHaveData) {
  const mdaData = await loadMdaHistory(implementationUnit)
  const params = await loadIUParams(implementationUnit)
  // set default values
  const defaultSimParams = {
    coverage: 65, // $("#MDACoverage").val(),
    mda: 1, // $("#inputMDARounds").val(), TODO: what do we do here?
    mdaSixMonths: 12, // TODO; what do we do here
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
    runs: 10,
  }
  const defaults = {
    ...defaultSimParams, // these ones are observed
    scenarioLabels: [],
    macrofilaricide: 65, // $("#Macrofilaricide").val(), - NOT CHANGED ANYWHERE
    microfilaricide: 65, // - NOT CHANGED ANYWHERE
    defaultParams: { ...defaultSimParams },
    IUData: {
      id: implementationUnit,
      mdaObj: mdaData,
      params: params,
    },
    defaultPrediction: generateMdaFuture(simParams),
    tweakedPrediction: generateMdaFuture(simParams),
    specificPrediction: null, // null or {}
    needsRerun: false,
  }
  const bednets = last(mdaData.bednets)
  if (bednets) {
    defaults.covN = bednets
    defaults.defaultParams.covN = bednets
  }
  const mdaRegimen = last(filter(mdaData.regimen, (x) => x !== 'xxx'))
  if (mdaRegimen) {
    defaults.mdaRegimen = mdaRegimen
    defaults.defaultParams.mdaRegimen = mdaRegimen
  }
  const adherence = last(mdaData.adherence)
  if (adherence) {
    defaults.rho = adherence
    defaults.defaultParams.rho = adherence
  }
  const coverage = last(filter(mdaData.coverage, (x) => x !== 0))
  if (coverage) {
    defaults.coverage = coverage
    defaults.defaultParams.coverage = coverage
  }
  console.log('mdaData', mdaData)
  console.log('defaults', defaults)
  dispatchSimParams({
    type: 'everything',
    payload: defaults,
  })
  window.localStorage.setItem('simParams', JSON.stringify(defaults))
  // }
}

export const loadMdaHistory = async (implementationUnit) => {
  const IUid = implementationUnit ? implementationUnit : 'AGO02107'
  const mdaResponse = await fetch(`/data/mda-history/${IUid}.csv`)
  let reader = mdaResponse.body.getReader()

  // Step 3: read the data
  let receivedLength = 0; // received that many bytes at the moment
  let chunks = []; // array of received binary chunks (comprises the body)
  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    chunks.push(value);
    receivedLength += value.length;

    //console.log(`Received ${receivedLength}`)
  }

  // Step 4: concatenate chunks into single Uint8Array
  let chunksAll = new Uint8Array(receivedLength); // (4.1)
  let position = 0;
  for (let chunk of chunks) {
    chunksAll.set(chunk, position); // (4.2)
    position += chunk.length;
  }

  let decoder = new TextDecoder('utf-8')
  const mdaCSV = decoder.decode(chunksAll);
  // console.log(mdaCSV);
  const mdaJSON = Papa.parse(mdaCSV, { header: true })
  // console.log(mdaJSON.data);
  let newMdaObj = {
    time: mdaJSON.data.map((item) => Number(item.time)),
    coverage: mdaJSON.data.map((item) => Number(item.coverage)),
    regimen: mdaJSON.data.map((item) => item.regimen),
    bednets: mdaJSON.data.map((item) => Number(item.bednets)),
    adherence: mdaJSON.data.map((item) => Number(item.adherence)),
    active: mdaJSON.data.map((item) => {
      if (item.regimen === 'xxx') {
        return false
      }
      return true
    }),
  }

  // returns one more line than it's ought to?
  newMdaObj.time.length = 20
  newMdaObj.coverage.length = 20
  newMdaObj.regimen.length = 20
  newMdaObj.bednets.length = 20
  newMdaObj.adherence.length = 20
  newMdaObj.active.length = 20

  return newMdaObj
}



export const loadIUParams = async (implementationUnit) => {
  const IUid = implementationUnit ? implementationUnit : 'AGO02107'
  const IUParamsResponse = await fetch(`/data/iu-params/${IUid}.csv`)
  //console.log(`/data/iu-params/${IUid}.csv`);
  //console.log(IUParamsResponse);
  // populate iuParams
  // const IUParamsResponse = await fetch('/data/iu-params/AGO02107.csv')
  let reader = IUParamsResponse.body.getReader()

  // Step 3: read the data
  let receivedLength = 0; // received that many bytes at the moment
  let chunks = []; // array of received binary chunks (comprises the body)
  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    chunks.push(value);
    receivedLength += value.length;

    //console.log(`Received ${receivedLength}`)
  }

  // Step 4: concatenate chunks into single Uint8Array
  let chunksAll = new Uint8Array(receivedLength); // (4.1)
  let position = 0;
  for (let chunk of chunks) {
    chunksAll.set(chunk, position); // (4.2)
    position += chunk.length;
  }

  let decoder = new TextDecoder('utf-8')

  const IUParamsCSV = decoder.decode(chunksAll)
  //console.log('IUParamsCSV',IUParamsCSV)
  const IUParamsJSON = Papa.parse(IUParamsCSV, { header: true })
  //console.log('IUParamsJSON.data',IUParamsJSON.data);

  let newParams = { Population: [], shapeRisk: [], v_to_h: [], aImp: [], aImp_2000: [], aImp_2001: [], aImp_2002: [], aImp_2003: [], aImp_2004: [], aImp_2005: [], aImp_2006: [], aImp_2007: [], aImp_2008: [], aImp_2009: [], aImp_2010: [], aImp_2011: [], aImp_2012: [], aImp_2013: [], aImp_2014: [], aImp_2015: [], aImp_2016: [], aImp_2017: [], aImp_2018: [], aImp_2019: [] }
  forEach(IUParamsJSON.data, (row, i) => {
    //console.log('rownumber',i)
    //console.log('row',row)
    if (row.Population === "") return
    newParams.Population.push(Number(row.Population));
    newParams.shapeRisk.push(Number(row.shapeRisk));
    newParams.v_to_h.push(Number(row.v_to_h));
    newParams.aImp.push(Number(row.aImp));
    newParams.aImp_2000.push(Number(row.aImp_2000));
    newParams.aImp_2001.push(Number(row.aImp_2001));
    newParams.aImp_2002.push(Number(row.aImp_2002));
    newParams.aImp_2003.push(Number(row.aImp_2003));
    newParams.aImp_2004.push(Number(row.aImp_2004));
    newParams.aImp_2005.push(Number(row.aImp_2005));
    newParams.aImp_2006.push(Number(row.aImp_2006));
    newParams.aImp_2007.push(Number(row.aImp_2007));
    newParams.aImp_2008.push(Number(row.aImp_2008));
    newParams.aImp_2009.push(Number(row.aImp_2009));
    newParams.aImp_2010.push(Number(row.aImp_2010));
    newParams.aImp_2011.push(Number(row.aImp_2011));
    newParams.aImp_2012.push(Number(row.aImp_2012));
    newParams.aImp_2013.push(Number(row.aImp_2013));
    newParams.aImp_2014.push(Number(row.aImp_2014));
    newParams.aImp_2015.push(Number(row.aImp_2015));
    newParams.aImp_2016.push(Number(row.aImp_2016));
    newParams.aImp_2017.push(Number(row.aImp_2017));
    newParams.aImp_2018.push(Number(row.aImp_2018));
    newParams.aImp_2019.push(Number(row.aImp_2019));
  })

  //console.log('newParams',newParams)
  return newParams

  /*
   * IS THIS NEEDED?
  newParams = {
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
  }
  return newParams
   */
}

export const generateMdaFuture = (simParams) => {
  //console.log('generateMDAFuture')
  //console.log(simParams)
  const numberOfYears = 11 * 2
  let MDAtime = []
  for (let i = 0; i < numberOfYears; i++) {
    // 246/12 = 2020
    // 228/12 = 2019
    MDAtime.push(6 * i + 246)
  }
  let MDAcoverage = []
  for (let i = 0; i < numberOfYears; i++) {
    MDAcoverage.push(
      simParams.tweakedPrediction &&
        simParams.tweakedPrediction.beenFiddledWith[i] === true
        ? simParams.tweakedPrediction.coverage[i]
        : simParams.coverage
    )
  }
  let MDAadherence = []
  for (let i = 0; i < numberOfYears; i++) {
    MDAadherence.push(
      simParams.tweakedPrediction &&
        simParams.tweakedPrediction.beenFiddledWith[i] === true
        ? simParams.tweakedPrediction.adherence[i]
        : simParams.rho
    )
  }
  let MDAbednets = []
  for (let i = 0; i < numberOfYears; i++) {
    MDAbednets.push(
      simParams.tweakedPrediction &&
        simParams.tweakedPrediction.beenFiddledWith[i] === true
        ? simParams.tweakedPrediction.bednets[i]
        : simParams.covN
    )
  }
  let MDAregimen = []
  for (let i = 0; i < numberOfYears; i++) {
    MDAregimen.push(
      simParams.tweakedPrediction &&
        simParams.tweakedPrediction.beenFiddledWith[i] === true
        ? simParams.tweakedPrediction.regimen[i]
        : simParams.mdaRegimen
    )
  }
  let MDAactive = []
  for (let i = 0; i < numberOfYears; i++) {
    if (simParams.mdaSixMonths === 12 && i % 2 === 1) {
      MDAactive.push(
        simParams.tweakedPrediction &&
          simParams.tweakedPrediction.beenFiddledWith[i] === true
          ? simParams.tweakedPrediction.active[i]
          : false
      )
    } else {
      MDAactive.push(
        simParams.tweakedPrediction &&
          simParams.tweakedPrediction.beenFiddledWith[i] === true
          ? simParams.tweakedPrediction.active[i]
          : true
      ) // alternate here
    }
  }
  let MDAbeenFiddledWith = []
  for (let i = 0; i < numberOfYears; i++) {
    MDAbeenFiddledWith.push(
      simParams.tweakedPrediction &&
        simParams.tweakedPrediction.beenFiddledWith[i] === true
        ? true
        : false
    )
  }
  const newMDAs = {
    time: [...MDAtime],
    coverage: [...MDAcoverage],
    adherence: [...MDAadherence],
    bednets: [...MDAbednets],
    regimen: [...MDAregimen],
    active: [...MDAactive],
    beenFiddledWith: [...MDAbeenFiddledWith],
  }
  //  console.log('newMDAs')
  //  console.log(JSON.stringify(newMDAs))
  return newMDAs
}
