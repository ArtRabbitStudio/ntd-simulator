import { v4 as uuidv4 } from 'uuid';
import { generateMdaFutureFromScenarioSettings } from 'pages/components/simulator/helpers/iuLoader';
import { csv } from 'd3';
import { DISEASE_TRACHOMA } from 'AppConstants';

// TODO temporary - to be generated from full IU list and loaded into simState in iuLoader
import iuGroupMapping from 'pages/components/simulator/models/iuGroupMapping';

// convert '02-2020' to 20.16666666666666666
const convertDateIndex = ( key ) => {
  const [ month, year ] = key.split('-' );
  const ts = ( parseInt( year ) - 2000 ) + ( parseInt( month ) / 12 );
  return ts;
};

const combineData = ( historicalData, futureData ) => {

  const combined = historicalData.map( ( item, i ) => {
    if( item[ 'Random Generator' ] === futureData[ i ][ 'Random Generator' ]) {
      //merging two objects
      return Object.assign( {}, item, futureData[ i ] )
    }
    return null
  } );

  console.log('combined',combined)

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
            acc.p.push( p );

            return acc;
          },

          // reduce()'s accumulator
          { ts: [], p: [] }

        )

      }
    );
};

/*
 * comes in as
 * {
 *   "median": { "02-2020": 0.0526236376, },
 *   "percentile_25": { "02-2020": 0.0269567667, },
 *   "percentile_75": { "02-2020": 0.1019832762, }
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
      acc.median.push( s.median[ k ] );
      acc.min.push( s.percentile_25[ k ] );
      acc.max.push( s.percentile_75[ k ] );

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

  prepScenarioAndParams: function ( scenarioId, scenarioState, simState ) {
    console.log( 'TrachomaModel pretending to prep scenario and params' );
  },

  runScenario: function ( { scenarioId, scenarioState, simState, callbacks } ) {

    const isNewScenario = scenarioId ? false : true;

    const scenarioData =
      isNewScenario
        ? this.createNewScenario( simState.settings )
        : scenarioState.scenarioData[ scenarioId ];

    this.prepScenarioAndParams( scenarioData.id, scenarioState, simState );

    console.log( 'TrachomaModel fetching prepped scenarioData', scenarioData );

    // work out the data file path from the scenario settings
    const group = iuGroupMapping[ simState.IUData.id ];
    const coverage = scenarioData.settings.coverage / 100;  // 0.9 in model vs 90 in UI
    const mdaSixMonths = scenarioData.settings.mdaSixMonths;  // 6=biannual, 12=annual
    const mdaRoundsString = scenarioData.mdaFuture.time
      .map( t => 2000 + ( t - 6 ) / 12 )
      .map( t => Math.floor( t ) === t ? `${t}01` : `${Math.floor( t) }06` )
      .filter( ( t, idx ) => { return scenarioData.mdaFuture.active[ idx ]; } )
      .join( '-' );

    const urlPath = `/diseases/trachoma/data/group-${group}/coverage-${coverage}/${group}`;
    const historicalDataUrl = `${urlPath}-historical-prevalence.csv`;
    const futureDataUrl = `${urlPath}-${coverage}-${mdaSixMonths}-${mdaRoundsString}.csv`;
    const summaryDataUrl = `${urlPath}-${coverage}-${mdaSixMonths}-${mdaRoundsString}-summary.json`;

    console.log( historicalDataUrl );
    console.log( futureDataUrl );
    console.log( summaryDataUrl );

    const historicalDataPromise = new Promise(
      ( resolve, reject ) => {
        csv( "/diseases/trachoma/data/group-56/56-historical-prevalence.csv" )
        .then( ( results ) => {
          resolve( results );
        } );
      }
    );

    const futureDataPromise = new Promise(
      ( resolve, reject ) => {
        csv( "/diseases/trachoma/data/group-56/coverage-0.6/56-0.6-12-202001.csv" )
        .then( ( results ) => {
          resolve( results );
        } );
      }
    );

    const jsonPromise = new Promise(
      ( resolve, reject ) => {
        fetch( "/diseases/trachoma/data/group-56/coverage-0.6/56-0.6-12-202001-summary.json" )
        .then( ( response ) => { return response; } )
        .then( ( res ) => { return res.json(); } )
        .then( ( json ) => { resolve( json ); } )
      }
    );

    Promise.all( [ historicalDataPromise, futureDataPromise, jsonPromise ] )
      .then(
        ( [ historicalData, futureData, summaryData ] ) => {

          console.log(historicalData[0]['Random Generator'])

          const combinedData = combineData( historicalData, futureData );
          const convertedSummary = convertSummary( summaryData );
          const result = {
            ...scenarioData,
            results: combinedData,
            summary: convertedSummary
          };
          callbacks.resultCallback( result, isNewScenario );
        }
      );

  },

};
