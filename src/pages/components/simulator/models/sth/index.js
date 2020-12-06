import { v4 as uuidv4 } from 'uuid';
import { generateMdaFutureFromScenarioSettings } from 'pages/components/simulator/helpers/iuLoader';
import { csv } from 'd3';
import { DISEASE_STH_ROUNDWORM, DISEASE_STH_WHIPWORM, DISEASE_STH_HOOKWORM } from 'AppConstants';
import sha256 from 'fast-sha256';
import nacl from 'tweetnacl-util'

// convert '02-2020' to 20.16666666666666666
const convertDateIndex = ( key ) => {
  const year = parseFloat( key.substring( 15 ) );
//  const ts = Math.round( ( year + 0.5 ) * 12);
  return year;
};

const randomGeneratorKey = "Random Generator";

const combineData = ( historicalData, futureData ) => {

  const combined = futureData.map(
    ( item, i ) => {

      if (
        futureData.length > i // in case there's an empty line in the CSV
        && item[ randomGeneratorKey ] === historicalData[ i ][ randomGeneratorKey ]
      ) {
        // merging two objects
        return Object.assign( {}, historicalData[ i ], item );
      }

      return {};
    }
  );


  return combined.map(
    // remove redundant columns
    ( row ) => {
      delete row[ randomGeneratorKey ];
      delete row.bet;
      delete row.k;
      delete row.R0;
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

      );

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
      // don't include the k column
      if ( k === 'k' ) return acc;

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

  modelDiseaseType: null,
  modelDiseaseLabel: null,

  initModel: function( disease ) {
    this.modelDiseaseType = disease;
    this.modelDiseaseLabel = {
      [ DISEASE_STH_ROUNDWORM ]: 'STHRoundworm',
      [ DISEASE_STH_WHIPWORM ]: 'STHWhipworm',
      [ DISEASE_STH_HOOKWORM ]: 'STHHookworm'
    }[ disease ];
  },

  createNewScenario: function ( settings, mdaObj ) {
      const label = new Date().toISOString().split('T').join(' ').replace(/\.\d{3}Z/, '');
      const id = uuidv4();

      const newScenarioData = {
        id,
        label,
        type: this.modelDiseaseType,
        settings: { ...settings } // should this be here or in the initScenario?
      };

      console.log( `${this.modelDiseaseLabel} auto-created new scenario id ${newScenarioData.id}` );

      return this.initScenario( newScenarioData, mdaObj );

  },

  initScenario: function( newScenarioData, mdaObj ) {
    const startYear = 15 *12
    const endYear = 17 * 12
    let mda2015 = {time:[180,192,204]}

    if ( mdaObj ) {
      mda2015 = {
        time: [],
        coverageAdults: [],
        coverageInfants: [],
        coveragePreSAC: [],
        coverageSAC: []
      }
      mdaObj.time.forEach( (item,index) => {
        if ( item >= startYear && item <= endYear ) {
          mda2015.time.push(mdaObj.time[index])
          mda2015.coverageAdults.push(mdaObj.coverageAdults[index])
          mda2015.coverageInfants.push(mdaObj.coverageInfants[index])
          mda2015.coveragePreSAC.push(mdaObj.coveragePreSAC[index])
          mda2015.coverageSAC.push(mdaObj.coverageSAC[index])
        }
      });
    }

    const newScenario =  {
      ...newScenarioData,
      mdaFuture: generateMdaFutureFromScenarioSettings( newScenarioData, this.modelDiseaseType ),
      mda2015
    };

    console.log( `${this.modelDiseaseLabel} inited MDA future from new scenario settings`, newScenario );

    return newScenario;

  },

  runScenario: async function ( { scenarioId, scenarioState, simState, callbacks } ) {
    const isNewScenario = scenarioId ? false : true;

    const scenarioData =
      isNewScenario
        ? this.createNewScenario( simState.settings, simState.IUData.mdaObj )
        : scenarioState.scenarioData[ scenarioId ];

    console.log( `${this.modelDiseaseLabel} fetching prepped scenarioData`, scenarioData );

    /*
     * notify the UI there's potentially a long wait ahead
     */
    callbacks.pleaseWaitCallback();

    /*
     * backend API wants the following STH_MDA format:
     *
     *  "","adjusted_years","cov_infants","cov_preSAC","cov_SAC","cov_adults"
     *  "1",13,0,0,0,0
     *  "2",14,0,0,0,0
     *  "3",15,0,0,0,0
     *  "4",16,0,0,0,0
     *  "5",17,0,0,0,0
     *  "6",18,0,0,0,0
     *
     * so this takes the values from mdaFuture and
     * maps to the appropriate columns
     */

    const paramColumns = [ [ "time","coverage1","coverage2","coverage3","coverage4" ] ];

    const paramData = scenarioData.mdaFuture.time.map(
      ( time, idx ) => {
        return scenarioData.mdaFuture.active[ idx ] ? [
          ( time / 12 ),  // TODO check this
          scenarioData.mdaFuture.coverageInfants[ idx ],
          scenarioData.mdaFuture.coveragePreSAC[ idx ],
          scenarioData.mdaFuture.coverageSAC[ idx ],
          scenarioData.mdaFuture.coverageAdults[ idx ]
        ] : null;
      }
    ).filter(
      ( entry ) => {
        return entry !== null;
      }
    );
    /*
     * this & the API co-identify a given scenario/params
     * by using a SHA256 hash of a JSON-encode of this object
     */
    const apiParams = {
      disease: this.modelDiseaseType,
      iu: simState.IUData.id,
      mdaData: paramColumns.concat( paramData ),
      runs: scenarioData.settings.runs
    };

    const apiParamsJson = JSON.stringify( apiParams )

    // get a SHA-256 hash of the params to use as MDA input identifier
    const hasher = new sha256.Hash();
    hasher.update( nacl.decodeUTF8( apiParamsJson ) );
    const digest = Buffer.from( hasher.digest() ).toString( 'hex' ).substring( 0, 24 );

    console.log( `${this.modelDiseaseLabel} model using MDA file hash: ${digest}` );

    const country = simState.IUData.id.substring( 0, 3 );
    const iu = simState.IUData.id;


    /*
     * first try to fetch a pre-rendered flat JSON file
     * containing the data file URLs, created by a
     * previous run of the same scenario/params
     */
    const storagePath = `https://storage.googleapis.com/ntd-disease-simulator-data`;
    const infoJsonUrl = `${storagePath}/diseases/${this.modelDiseaseType}/data/${country}/${simState.IUData.id}/${digest}/Asc-${iu}-${digest}-info.json?ignoreCache=${Date.now()}`;
    const infoJsonResponse = await fetch( infoJsonUrl );

    /*
     * if it's not there, send the params to the API
     * and wait for a result, which will come in the same
     * format, and render out the JSON file for next time
     */
    let infoJson;

    try {

      infoJson = ( infoJsonResponse.status === 200 )

        ? await ( async () => {
              const res = await infoJsonResponse.text();
              return JSON.parse( res );
          } )()

        : await ( async () => {
              const apiUrl = "https://sth-app-api-mijgnzszia-ew.a.run.app/run";
              //const apiUrl = "http://localhost:5000/run"

              console.log( `${this.modelDiseaseLabel} didn't find static info, sending scenario params to API at ${apiUrl}:`, apiParams );

              const fetchOptions = {
                method: "POST",
                headers: { 'content-type': 'application/json; charset=UTF-8' },
                body: apiParamsJson
              };

              const response = await fetch( apiUrl, fetchOptions );
              const res = await response.text();
              return JSON.parse( res )
          } )();
    }

    catch( e ) {
      callbacks.failureCallback( e.message );
      return;
    }


    /*
     * fetch all the various data files
     */

    const dataPromiser = ( label ) => {
      return new Promise(
        ( resolve, reject ) => {
          const key = `${label}DataUrl`;
          console.log( `${this.modelDiseaseLabel} loading ${label} data ${infoJson[ key ]}` );
          csv( infoJson[ key ] )
          .then( ( results ) => {
            resolve( results );
          } );
        }
      );
    };

    const summaryPromiser = ( label ) => {
      return new Promise(
        ( resolve, reject ) => {
          const key = `${label}SummaryUrl`;
          console.log( `${this.modelDiseaseLabel} loading ${label} summary ${infoJson[ key ]}` );
          fetch( infoJson[ key ] )
          .then( ( response ) => { return response; } )
          .then( ( res ) => { return res.json(); } )
          .then( ( json ) => { resolve( json ); } )
        }
      );
    };

    const promises = [ 'historicalKKSAC', 'historicalMHISAC', 'futureKKSAC', 'futureMHISAC' ].reduce(
      ( acc, label ) => {
        acc.push( dataPromiser( label ) );
        acc.push( summaryPromiser( label ) );
        return acc;
      },
      []
    );

    Promise.all( promises ).then(
      (
        [
          historicalKKSACData, historicalKKSACSummary, historicalMHISACData, historicalMHISACSummary,
          futureKKSACData, futureKKSACSummary, futureMHISACData, futureMHISACSummary
        ]
      ) => {

        const combinedDataKK = combineData( historicalKKSACData, futureKKSACData );
        const combinedSummaryKK = combineSummaries( historicalKKSACSummary, futureKKSACSummary );
        const combinedDataMHI = combineData( historicalMHISACData, futureMHISACData );
        const combinedSummaryMHI = combineSummaries( historicalMHISACSummary, futureMHISACSummary );

        const result = {
          ...scenarioData,
          results: { KK: combinedDataKK, MHI: combinedDataMHI },
          summary: { KK: combinedSummaryKK, MHI: combinedSummaryMHI}
        };

        console.warn( "TODO implement combining MHISAC data/summary" );

        console.log( `${this.modelDiseaseLabel}.runScenario combined all data, calling resultCallback` );
        callbacks.resultCallback( result, isNewScenario );
      }
    )
    .catch(
      ( e ) => {
        console.warn( `💣 ${this.modelDiseaseLabel}.runScenario: Promise.all() caught error: `, e );
      }
    );

  },

};
