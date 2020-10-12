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

    const csvPromise = new Promise(
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

    Promise.all( [ csvPromise, jsonPromise ] )
      .then(
        ( [ results, summary ] ) => {
          const result = {
            ...scenarioData,
            results,
            summary
          };
          callbacks.resultCallback( result, isNewScenario );
        }
      );

  },

};
