import { v4 as uuidv4 } from 'uuid';
import { generateMdaFutureFromScenarioSettings } from 'pages/components/simulator/helpers/iuLoader';

export default {

  createNewScenario: function ( settings ) {

      const label = new Date().toISOString().split('T').join(' ').replace(/\.\d{3}Z/, '');
      const id = uuidv4();

      const newScenarioData = {
        id,
        label,
        trachomaPayload: 'TRACHOMA PAYLOAD',
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

    console.log( 'TrachomaModel returning prepped scenarioData', scenarioData );

    /*
     * NOTE IC 20201011
     *
     * there is something really suspicious going on that makes this
     * setTimeout necessary - if this code doesn't wrap resultCallback
     * in a setTimeout then the ScenarioStoreContext.Consumer doesn't
     * get all the updates dispatched in sequence & therefore doesn't
     * process them, so data doesn't get saved, so nothing works.
     *
     * this must mean that either:
     *
     * (a) there's something weird with the combination of mobx + hooks
     *    that messes with the runloop/queue/call stack/whatever
     *
     * (b) mobx and hooks are fine together but something in the way
     *    they're set up in this app is not fine
     *
     * (c) there's something really bad about the way the SimulatorEngine
     *    callback stuff works (unlikely because consumer updates
     *    also don't happen in other situations)
     *
     * (d) i'm really missing something in one or more of the above
     *
     * (e) something else completely
     *
     * so, TODO:
     * - work out what's going on
     * - probably strip out mobx and other stuff
     */

    const callResultCallback = () => {
      callbacks.resultCallback( scenarioData, isNewScenario );
    };

    const fakeProgressTimeInMs = 1000;
    const numberSteps = 10;
    const progressIntervalInMs = fakeProgressTimeInMs / numberSteps;

    for( let i = progressIntervalInMs; i <= fakeProgressTimeInMs; i += progressIntervalInMs ) {
      setTimeout(
        () => {
          callbacks.progressCallback( i / fakeProgressTimeInMs * 100 );
        },
        i
      );
    }

    setTimeout( callResultCallback, fakeProgressTimeInMs + progressIntervalInMs );

  },

};
