import { v4 as uuidv4 } from 'uuid';
import { generateMdaFutureFromScenarioSettings } from 'pages/components/simulator/helpers/iuLoader';
import { csv } from 'd3';
import { DISEASE_TRACHOMA } from 'AppConstants';

// convert '02-2020' to 20.16666666666666666
const convertDateIndex = ( key ) => {
  const [ month, year ] = key.split('-' );
  const ts = ( parseInt( year ) - 2000 ) + ( parseInt( month ) / 12 );
  return ts;
};

const combineData = ( historicalData, futureData ) => {

  const combined = historicalData.map( ( item, i ) => {
    if( item[ 'Random Generator' ] === futureData[ i ][ 'Random Generator' ]) {
      // merging two objects
      return Object.assign( {}, item, futureData[ i ] );
    }
    return null;
  } );

  return combined
    .map(
      // remove redundant columns
      ( row ) => {
        delete row[ 'Random Generator' ];
        delete row.bet;
        return row;
      }
    )
    // for each row
    .map(
      ( row ) => {

        return Object.keys( row ).reduce(

          ( acc, key ) => {

            // append it to the array of timestamps
            const ts = convertDateIndex( key );
            acc.ts.push( ts );

            // append the prevalence value to the array of prevalences
            const p = parseFloat( row[ key ] );

            // convert decimal to actual percentage * 100
            acc.p.push( p*100 );

            return acc;
          },

          // reduce()'s accumulator
          { ts: [], p: [] }

        )

      }
    );
};

const combineSummaries = ( historicalSummary, futureSummary ) => {
  const history = convertSummary( historicalSummary );
  const future = convertSummary( futureSummary );
  return {
    ts: history.ts.concat( future.ts ),
    median: history.median.concat( future.median ),
    min: history.min.concat( future.min ),
    max: history.max.concat( future.max ),
  };
};

/*
 * comes in as
 * {
 *   "median": { "02-2020": 0.0526236376, },
 *   "lower": { "02-2020": 0.0269567667, },
 *   "upper": { "02-2020": 0.1019832762, }
 * }
 *
 * goes out as
 *
 * {
 *   "ts": [ 20.166666666666668, ],
 *   "median": [ 0.0526236376, ],
 *   "min": [ 0.0269567667, ],
 *   "max": [ 0.1019832762, ]
 * }
 *
 */

const convertSummary = ( s ) => {
  return Object.keys( s.median ).reduce(

    ( acc, k ) => {

      const ts = convertDateIndex( k );

      acc.ts.push( ts );
      // convert decimal to actual percentage * 100
      acc.median.push( s.median[ k ]*100 );
      acc.min.push( s.lower[ k ]*100 );
      acc.max.push( s.upper[ k ]*100 );

      return acc;
    },

    { ts: [], median: [], min: [], max: [] }
  );
};

export default {

  createNewScenario: function ( settings ) {

      const label = new Date().toISOString().split('T').join(' ').replace(/\.\d{3}Z/, '');
      const id = uuidv4();

      const newScenarioData = {
        id,
        label,
        type: DISEASE_TRACHOMA,
        settings: { ...settings } // should this be here or in the initScenario?
      };

      console.log( `TrachomaModel auto-created new scenario id ${newScenarioData.id}` );

      return this.initScenario( newScenarioData );

  },

  initScenario: function( newScenarioData ) {
    
    const newScenario =  {
      ...newScenarioData,
      mdaFuture: generateMdaFutureFromScenarioSettings( newScenarioData ),
      mda2015: {time:[204,216,228]}
    };

    console.log( 'TrachomaModel inited MDA future from new scenario settings', newScenario );

    return newScenario;

  },

  runScenario: function ( { scenarioId, scenarioState, simState, callbacks } ) {

    const isNewScenario = scenarioId ? false : true;

    const scenarioData =
      isNewScenario
        ? this.createNewScenario( simState.settings )
        : scenarioState.scenarioData[ scenarioId ];

    console.log( 'TrachomaModel fetching prepped scenarioData', scenarioData );

    // work out the data file path from the scenario settings
    const mappedGroup = window.ntd.iuGroupMapping[ simState.IUData.id ];  // TODO temporary - to be generated from full IU list and loaded into simState in iuLoader
    const group = [ 3, 32, 37, 43, 45, 99, 124, 126, 132, 128, 191, 262, 265, 269, 294, 323, 324, 325, 382 ].includes( mappedGroup ) ? mappedGroup : 32;
    const coverage = scenarioData.settings.coverage / 100;    // 0.9 in model vs 90 in UI
    const mdaSixMonths = scenarioData.settings.mdaSixMonths;  // 6=biannual, 12=annual
    const mdaRoundsString = scenarioData.mdaFuture.time
      .map( t => 2000 + ( t - 6 ) / 12 )
      .map( t => Math.floor( t ) === t ? `${t}01` : `${Math.floor( t) }06` )
      .filter( ( t, idx ) => { return scenarioData.mdaFuture.active[ idx ]; } )
      .join( '-' );

	/*
	 *	/diseases/trachoma/data/group-103/103-historical-prevalence.csv
	 *	/diseases/trachoma/data/group-103/103-historical-prevalence-summary.json
	 *	/diseases/trachoma/data/group-103/coverage-0.6/mdatype-12/103-0.6-12-202001.csv
	 *	/diseases/trachoma/data/group-103/coverage-0.6/mdatype-12/103-0.6-12-202101-summary.json
	 */
    const storagePath = `https://storage.googleapis.com/ntd-disease-simulator-data`;
    const groupUrlPath = `${storagePath}/diseases/trachoma/data/group-${group}`;
    const mdaUrlPath = `${groupUrlPath}/coverage-${coverage}/mdatype-${scenarioData.settings.mdaSixMonths}`;



    const historicalDataUrl = `${groupUrlPath}/${group}-historical-prevalence.csv`;
    const historicalSummaryUrl = `${groupUrlPath}/${group}-historical-prevalence-summary.json`;
    const scenarioSpecifier = `${group}-${coverage}-${mdaSixMonths}-${mdaRoundsString}`;
    const futureDataUrl = `${mdaUrlPath}/${scenarioSpecifier}-prev.csv`;
    const futureSummaryUrl = `${mdaUrlPath}/${scenarioSpecifier}-summary.json`;
    // TODO add -infect.csv

    const historicalDataPromise = new Promise(
      ( resolve, reject ) => {
        console.log( `TrachomaModel loading historical data ${historicalDataUrl}` );
        csv( historicalDataUrl )
        .then( ( results ) => {
          resolve( results );
        } );
      }
    );

    const historicalSummaryPromise = new Promise(
      ( resolve, reject ) => {
        console.log( `TrachomaModel loading historical summary ${historicalSummaryUrl}` );
        fetch( historicalSummaryUrl )
        .then( ( response ) => { return response; } )
        .then( ( res ) => { return res.json(); } )
        .then( ( json ) => { resolve( json ); } )
      }
    );

    const futureDataPromise = new Promise(
      ( resolve, reject ) => {
        console.log( `TrachomaModel loading future data ${futureDataUrl}` );
        csv( futureDataUrl )
        .then( ( results ) => {
          resolve( results );
        } );
      }
    );

    const futureSummaryPromise = new Promise(
      ( resolve, reject ) => {
        console.log( `TrachomaModel loading future summary ${futureSummaryUrl}` );
        fetch( futureSummaryUrl )
        .then( ( response ) => { return response; } )
        .then( ( res ) => { return res.json(); } )
        .then( ( json ) => { resolve( json ); } )
      }
    );

    Promise.all( [ historicalDataPromise, historicalSummaryPromise, futureDataPromise, futureSummaryPromise ] )
      .then(
        ( [ historicalData, historicalSummary, futureData, futureSummary ] ) => {

          const combinedData = combineData( historicalData, futureData );
          const combinedSummary = combineSummaries( historicalSummary, futureSummary );

          const result = {
            ...scenarioData,
            results: combinedData,
            summary: combinedSummary
          };
          callbacks.resultCallback( result, isNewScenario );
        }
      );

  },

};
