import { v4 as uuidv4 } from 'uuid';
import { generateMdaFutureFromScenarioSettings } from 'pages/components/simulator/helpers/iuLoader';
import { csv } from 'd3';
import { DISEASE_TRACHOMA } from 'AppConstants';

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
      mdaFuture: generateMdaFutureFromScenarioSettings( newScenarioData )
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

    // convert '02-2020' to 20.16666666666666666
    const convertDateIndex = ( key ) => {
      const [ month, year ] = key.split('-' );
      const ts = ( parseInt( year ) - 2000 ) + ( parseInt( month ) / 12 );
      return ts;
    };

    const combineData = ( historicalData, futureData ) => {
      return [ ...historicalData, ...futureData ]
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

        (acc, k ) => {

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

    const historicalDataPromise = new Promise(
      ( resolve, reject ) => {
        csv( "/data/Trachoma200/output/scenario-56/56-historical-prevalence.csv" )
        .then( ( results ) => {
          resolve( results );
        } );
      }
    );

    const futureDataPromise = new Promise(
      ( resolve, reject ) => {
        csv( "/data/Trachoma200/output/scenario-56/coverage-0.6/56-0.6-12-202001.csv" )
        .then( ( results ) => {
          resolve( results );
        } );
      }
    );

    const jsonPromise = new Promise(
      ( resolve, reject ) => {
        fetch( "/data/Trachoma200/output/scenario-56/coverage-0.6/56-0.6-12-202001-summary.json" )
        .then( ( response ) => { return response; } )
        .then( ( res ) => { return res.json(); } )
        .then( ( json ) => { resolve( json ); } )
      }
    );

    Promise.all( [ historicalDataPromise, futureDataPromise, jsonPromise ] )
      .then(
        ( [ historicalData, futureData, summaryData ] ) => {
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
