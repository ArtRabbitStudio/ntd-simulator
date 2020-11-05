import Papa from 'papaparse'
import { last, filter, forEach } from 'lodash'
import { DISEASE_LIMF, DISEASE_TRACHOMA, DISEASE_STH_ROUNDWORM } from 'AppConstants';

import SessionStorage from './sessionStorage';

export const loadAllIUhistoricData = async (
  simState,
  dispatchSimState,
  implementationUnit,
  disease
) => {
  console.log('loadAllIUhistoricData for', disease)
  let mdaData = null
  let params = null
  
  // TODO new param diesase
  switch ( disease ) {
    case DISEASE_LIMF:
      mdaData = await loadMdaHistoryLF(implementationUnit)
      params = await loadIUParamsLF(implementationUnit)
      break;

    case DISEASE_TRACHOMA:
      break;
    case DISEASE_STH_ROUNDWORM:
      mdaData = await loadMdaHistorySTHRoundworm(implementationUnit)
      break
    default:
      break;
  }

  // clear LS
  SessionStorage.simulatorState = null;
  SessionStorage.removeAllScenarios();


  // set default values
  const defaultSimParams = {
    settings: {
    covN: 0, // $("#bedNetCoverage").val(),
    coverage: 80, // $("#MDACoverage").val(),
    endemicity: 10, // $("#endemicity").val(),
    macrofilaricide: 65, // $("#Macrofilaricide").val(),
    mda: 2, // $("#inputMDARounds").val(),
    mdaRegimen: 'xIA', // $("input[name=mdaRegimenRadios]:checked").val(),
    mdaSixMonths: 12, // $("input:radio[name=mdaSixMonths]:checked").val(),
    microfilaricide: 65, // $("#Microfilaricide").val(),
    rho: 0.2, // $("#sysAdherence").val(),
    rhoBComp: 0, // $("#brMda").val(),
    rhoCN: 0, // $("#bedNetMda").val(),
    runs: 10, // $("#runs").val()
    species: 0, // $("input[name=speciesRadios]:checked").val(),
    specificPrediction: null, // null or {}
    specificPredictionIndex: -1, // null or {}
    v_to_hR: 0, // $("#insecticideCoverage").val(),
    vecCap: 0, // $("#vectorialCapacity").val(),
    vecComp: 0, //$("#vectorialCompetence").val(),
    vecD: 0, //$("#vectorialDeathRate").val(),


    // additions for sth roundworm
    // "cov_infants","cov_preSAC","cov_SAC","cov_adults"
    coverageInfants: 0,
    coveragePreSAC: 0,
    coverageSAC: 75, // who guidelines
    coverageAdults: 0,  


    /*
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
      runs: 30,

      macrofilaricide: 65, // $("#Macrofilaricide").val(), - NOT CHANGED ANYWHERE
      microfilaricide: 65, // - NOT CHANGED ANYWHERE
      specificPrediction: null, // null or {},
      specificPredictionIndex: -1
    */
    }
  }

  const defaults = {
    ...defaultSimParams, // these ones are observed
    IUData: {
      id: implementationUnit,
      mdaObj: mdaData,
      params: params,
    },
  }

  switch ( disease ) {
    case DISEASE_LIMF:
      const bednets = last(mdaData.bednets)
      if (bednets) {
        defaults.settings.covN = bednets
      }

      const mdaRegimen = last(filter(mdaData.regimen, (x) => x !== 'xxx'))
      if (mdaRegimen) {
        defaults.settings.mdaRegimen = mdaRegimen
      }

      const adherence = last(mdaData.adherence)
      if (adherence) {
        defaults.settings.rho = adherence
      }

      const coverage = last(filter(mdaData.coverage, (x) => x !== 0))
      if (coverage) {
        defaults.settings.coverage = coverage
      }
      break
    case DISEASE_STH_ROUNDWORM:
      defaults.settings.coverageInfants = last(mdaData.coverageInfants)
      defaults.settings.coveragePreSAC = last(mdaData.coveragePreSAC)
      defaults.settings.coverageSAC = last(mdaData.coverageSAC)
      defaults.settings.coverageAdults = last(mdaData.coverageAdults)
      break
    default:
      break
  }



  console.log( "iuLoader creating simState defaults:", defaults );

  dispatchSimState({
    type: 'everything',
    payload: defaults,
  })

//  SessionStorage.simulatorState = defaults;
}


export const loadMdaHistorySTHRoundworm = async (implementationUnit) => {
  console.log( "iuLoader loadMdaHistorySTHRoundworm:", implementationUnit );

  const IUid = implementationUnit ? implementationUnit : 'AGO02107'
  const mdaResponse = await fetch(`/diseases/sth-roundworm/mda-history/${IUid}.csv`)
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
  for ( let chunk of chunks) {
    chunksAll.set(chunk, position); // (4.2)
    position += chunk.length;
  }

  let decoder = new TextDecoder('utf-8')
  const mdaCSV = decoder.decode(chunksAll);
  // console.log(mdaCSV);
  const mdaJSON = Papa.parse(mdaCSV, { header: true })

  // this mdaObject only goes to 2018 (I don't know why I only have this data up to this year, ask Swati)
  // question is do I need to create two empty time stamps or how does this work?
  // check in LF
  let newMdaObj = {
    time: mdaJSON.data.reduce((filtered,item) => { if ( item.adjusted_years != null ) { filtered.push(Number((item.adjusted_years)*12)) } return filtered },[] ),
    coverage: mdaJSON.data.map((item) => 0),
    coverageInfants: mdaJSON.data.map((item) => Number(item.cov_infants)),
    coveragePreSAC: mdaJSON.data.map((item) => Number(item.cov_preSAC)),
    coverageSAC: mdaJSON.data.map((item) => Number(item.cov_SAC)), 
    coverageAdults: mdaJSON.data.map((item) => Number(item.cov_adults)),  
    regimen: mdaJSON.data.map((item) => ''),
    bednets: mdaJSON.data.map((item) => 0),
    adherence: mdaJSON.data.map((item) => 0),
    active: mdaJSON.data.map((item) => {
      if (item.cov_infants + item.cov_preSAC + item.cov_SAC + item.cov_adults !== 0) {
        return true
      }
      return false
    }),
  }
  newMdaObj.coverage.length = newMdaObj.time.length
  newMdaObj.coverageInfants.length = newMdaObj.time.length
  newMdaObj.coveragePreSAC.length = newMdaObj.time.length
  newMdaObj.coverageSAC.length = newMdaObj.time.length
  newMdaObj.coverageAdults.length = newMdaObj.time.length
  newMdaObj.regimen.length = newMdaObj.time.length
  newMdaObj.bednets.length = newMdaObj.time.length
  newMdaObj.adherence.length = newMdaObj.time.length
  newMdaObj.active.length = newMdaObj.time.length


  return newMdaObj

}


export const loadMdaHistoryLF = async (implementationUnit) => {

  console.log( "iuLoader loadMdaHistoryLF:", implementationUnit );


  const IUid = implementationUnit ? implementationUnit : 'AGO02107'
  const mdaResponse = await fetch(`/diseases/lf/mda-history/${IUid}.csv`)
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
  for ( let chunk of chunks) {
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



export const loadIUParamsLF = async (implementationUnit) => {
  const IUid = implementationUnit ? implementationUnit : 'AGO02107'
  const IUParamsResponse = await fetch(`/diseases/lf/iu-params/${IUid}.csv`)
  //console.log(`/lf/iu-params/${IUid}.csv`);
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
  for ( let chunk of chunks) {
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

export const generateMdaFutureFromDefaults = (simState) => {

  const numberOfYears = 11 * 2;

  let MDAtime = [];

  for ( let i = 0; i < numberOfYears; i++ ) {
    // 246/12 = 2020
    // 228/12 = 2019
    MDAtime.push(6 * i + 246);
  }

  let MDAcoverage = [];
  for ( let i = 0; i < numberOfYears; i++ ) {
    MDAcoverage.push( simState.settings.coverage );
  }

  let MDAadherence = [];
  for ( let i = 0; i < numberOfYears; i++ ) {
    MDAadherence.push( simState.settings.rho );
  }

  let MDAbednets = [];
  for ( let i = 0; i < numberOfYears; i++ ) {
    MDAbednets.push( simState.settings.covN );
  }

  let MDAregimen = [];
  for ( let i = 0; i < numberOfYears; i++ ) {
    MDAregimen.push( simState.settings.mdaRegimen );
  }

  let MDAactive = [];
  for ( let i = 0; i < numberOfYears; i++ ) {

    let active;

    if( i <= simState.settings.specificPredictionIndex ) {
      active = false;
    }

    else {
      active = simState.settings.mdaSixMonths === 6 ? true : ( i % 2 ? false : true );
    }

    MDAactive.push( active );
  }

  let MDAcoverageInfants = [];
  for ( let i = 0; i < numberOfYears; i++ ) {
    MDAcoverageInfants.push( simState.settings.coverageInfants)
  }

  let MDAcoveragePreSAC = [];
  for ( let i = 0; i < numberOfYears; i++ ) {
    MDAcoveragePreSAC.push( simState.settings.coveragePreSAC)
  }

  let MDAcoverageSAC = [];
  for ( let i = 0; i < numberOfYears; i++ ) {
    MDAcoverageSAC.push( simState.settings.coverageSAC)
  }

  let MDAcoverageAdults = [];
  for ( let i = 0; i < numberOfYears; i++ ) {
    MDAcoverageAdults.push( simState.settings.coverageAdults)
  }


  const newMDAs = {
    time: [ ...MDAtime ],
    coverage: [ ...MDAcoverage ],
    adherence: [ ...MDAadherence ],
    bednets: [ ...MDAbednets ],
    regimen: [ ...MDAregimen ],
    active: [ ...MDAactive ],
    coverageInfants: [ ...MDAcoverageInfants ],
    coveragePreSAC: [ ...MDAcoveragePreSAC ],
    coverageSAC: [ ...MDAcoverageSAC ],
    coverageAdults: [ ...MDAcoverageAdults ],  
  };

  return newMDAs;
}

export const generateMdaFutureFromScenario = ( scenario ) => {

  const mdaFuture = scenario.mdaFuture;

  const numberOfYears = 11 * 2;

  let MDAtime = [];

  for ( let i = 0; i < numberOfYears; i++ ) {
    // 246/12 = 2020
    // 228/12 = 2019
    MDAtime.push(6 * i + 246);
  }

  let MDAcoverage = [];
  for ( let i = 0; i < numberOfYears; i++ ) {
    MDAcoverage.push( mdaFuture.coverage[i] );
  }

  let MDAadherence = [];
  for ( let i = 0; i < numberOfYears; i++ ) {
    MDAadherence.push( mdaFuture.adherence[i] );
  }

  let MDAbednets = [];
  for ( let i = 0; i < numberOfYears; i++ ) {
    MDAbednets.push( mdaFuture.bednets[i] );
  }

  let MDAregimen = [];
  for ( let i = 0; i < numberOfYears; i++ ) {
    MDAregimen.push( mdaFuture.regimen[i] );
  }

  let MDAactive = [];
  for ( let i = 0; i < numberOfYears; i++ ) {

    let active;

    if( i <= scenario.settings.specificPredictionIndex ) {
      active = false;
    }

    else {
      active = scenario.settings.mdaSixMonths === 6 ? true : ( i % 2 ? false : true );
    }

    MDAactive.push( active );
  }

  let MDAcoverageInfants = [];
  for ( let i = 0; i < numberOfYears; i++ ) {
    MDAcoverageInfants.push( scenario.settings.coverageInfants[i])
  }

  let MDAcoveragePreSAC = [];
  for ( let i = 0; i < numberOfYears; i++ ) {
    MDAcoveragePreSAC.push( scenario.settings.coveragePreSAC[i])
  }

  let MDAcoverageSAC = [];
  for ( let i = 0; i < numberOfYears; i++ ) {
    MDAcoverageSAC.push( scenario.settings.coverageSAC[i])
  }

  let MDAcoverageAdults = [];
  for ( let i = 0; i < numberOfYears; i++ ) {
    MDAcoverageAdults.push( scenario.settings.coverageAdults[i])
  }


  const newMDAs = {
    time: [ ...MDAtime ],
    coverage: [ ...MDAcoverage ],
    adherence: [ ...MDAadherence ],
    bednets: [ ...MDAbednets ],
    regimen: [ ...MDAregimen ],
    active: [ ...MDAactive ],
    coverageInfants: [ ...MDAcoverageInfants ],
    coveragePreSAC: [ ...MDAcoveragePreSAC ],
    coverageSAC: [ ...MDAcoverageSAC ],
    coverageAdults: [ ...MDAcoverageAdults ],  
  };

  return newMDAs;
}

export const generateMdaFutureFromScenarioSettings = ( scenario ) => {

  const numberOfYears = 11 * 2;

  let MDAtime = [];

  for ( let i = 0; i < numberOfYears; i++ ) {
    // 246/12 = 2020
    // 228/12 = 2019
    MDAtime.push(6 * i + 246);
  }

  let MDAcoverage = [];
  for ( let i = 0; i < numberOfYears; i++ ) {
    MDAcoverage.push( scenario.settings.coverage );
  }

  let MDAadherence = [];
  for ( let i = 0; i < numberOfYears; i++ ) {
    MDAadherence.push( scenario.settings.rho );
  }

  let MDAbednets = [];
  for ( let i = 0; i < numberOfYears; i++ ) {
    MDAbednets.push( scenario.settings.covN );
  }

  let MDAregimen = [];
  for ( let i = 0; i < numberOfYears; i++ ) {
    MDAregimen.push( scenario.settings.mdaRegimen );
  }

  let MDAactive = [];
  for ( let i = 0; i < numberOfYears; i++ ) {

    let active;

    if( i <= scenario.settings.specificPredictionIndex ) {
      active = false;
    }

    else {
      active = scenario.settings.mdaSixMonths === 6 ? true : ( i % 2 ? false : true );
    }

    MDAactive.push( active );
  }

  let MDAcoverageInfants = [];
  for ( let i = 0; i < numberOfYears; i++ ) {
    MDAcoverageInfants.push( scenario.settings.coverageInfants)
  }

  let MDAcoveragePreSAC = [];
  for ( let i = 0; i < numberOfYears; i++ ) {
    MDAcoveragePreSAC.push( scenario.settings.coveragePreSAC)
  }

  let MDAcoverageSAC = [];
  for ( let i = 0; i < numberOfYears; i++ ) {
    MDAcoverageSAC.push( scenario.settings.coverageSAC)
  }

  let MDAcoverageAdults = [];
  for ( let i = 0; i < numberOfYears; i++ ) {
    MDAcoverageAdults.push( scenario.settings.coverageAdults)
  }


  const newMDAs = {
    time: [ ...MDAtime ],
    coverage: [ ...MDAcoverage ],
    adherence: [ ...MDAadherence ],
    bednets: [ ...MDAbednets ],
    regimen: [ ...MDAregimen ],
    active: [ ...MDAactive ],
    coverageInfants: [ ...MDAcoverageInfants ],
    coveragePreSAC: [ ...MDAcoveragePreSAC ],
    coverageSAC: [ ...MDAcoverageSAC ],
    coverageAdults: [ ...MDAcoverageAdults ],  
  };

  return newMDAs;
}
