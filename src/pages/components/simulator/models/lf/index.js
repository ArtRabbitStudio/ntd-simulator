import { v4 as uuidv4 } from 'uuid';
import * as SimulatorEngine from './SimulatorEngine';

import { combineFullMda } from 'pages/components/simulator/helpers/combineFullMda';
import { trimMdaHistory } from 'pages/components/simulator/helpers/trimMdaHistory';
import { removeInactiveMDArounds } from 'pages/components/simulator/helpers/removeInactiveMDArounds';
import { generateMdaFutureFromDefaults, generateMdaFutureFromScenarioSettings } from 'pages/components/simulator/helpers/iuLoader';
import { DISEASE_LIMF } from 'AppConstants';


export default {

  createNewScenario: function ( settings ) {

      const label = new Date().toISOString().split('T').join(' ').replace(/\.\d{3}Z/, '');
      const id = uuidv4();

      const newScenarioData = {
        id,
        label,
        settings: { ...settings } // should this be here or in the initScenario?
      };

      console.log( `LFModel auto-created new scenario id ${newScenarioData.id}` );

      return this.initScenario( newScenarioData );

  },

  initScenario: function( newScenarioData ) {
    
    const newScenario =  {
      ...newScenarioData,
      mdaFuture: generateMdaFutureFromScenarioSettings( newScenarioData,DISEASE_LIMF )
    };

    console.log( 'LFModel inited MDA future from new scenario settings', newScenario );

    return newScenario;

  },

  prepScenarioAndParams: function ( scenarioId, scenarioState, simState ) {

    // get MDA history
    const IUData = simState.IUData;

    const isNewScenario = scenarioId ? false : true;

    if ( isNewScenario ) {
      SimulatorEngine.simControler.iuParams = IUData.params;
    }

    const mdaHistory = IUData.mdaObj;

    // generate MDA predictions
    const scenarioData = scenarioState.scenarioData[ scenarioId ? scenarioId : scenarioState.currentScenarioId ];

    const specificPrediction = 
      ( scenarioData && isNewScenario === false )
        ? scenarioData.settings.specificPrediction
        : simState.specificPrediction;

    const generatedMda =
      ( scenarioData && isNewScenario === false )
        ? scenarioData.mdaFuture
        : generateMdaFutureFromDefaults( simState );

    const mdaPrediction =
      ( specificPrediction !== null )
        ? { ...specificPrediction, ...generatedMda }
        : generatedMda;

    const fullMDA = combineFullMda( mdaHistory, mdaPrediction );

    SimulatorEngine.simControler.mdaObj = removeInactiveMDArounds( fullMDA );
    SimulatorEngine.simControler.mdaObjUI = fullMDA;
    SimulatorEngine.simControler.mdaObj2015 = trimMdaHistory( mdaHistory );
    SimulatorEngine.simControler.mdaObjFuture = mdaPrediction;
    SimulatorEngine.simControler.iuParams = IUData.params;
  },

  runScenario: function ( { scenarioId, scenarioState, simState, callbacks } ) {

    const isNewScenario = scenarioId ? false : true;

    this.prepScenarioAndParams( scenarioId, scenarioState, simState );

    SimulatorEngine.simControler.newScenario = isNewScenario;

    console.log( `LFModel.runScenario calling SimulatorEngine.simControler.runScenario( ${
      isNewScenario ? null : scenarioState.scenarioData[ scenarioId ].id
    }, isNewScenario: ${isNewScenario} )` );

    const currentScenarioData = scenarioId ? scenarioState.scenarioData[ scenarioId ] : null;

    if ( isNewScenario ) {
      SimulatorEngine.simControler.runScenario(
        simState.settings, // use default params
        null, // create a new ID & scenario
        callbacks
      );
    }

    else {
      SimulatorEngine.simControler.runScenario(
        currentScenarioData.settings,  // use per-scenario params
        currentScenarioData,  // use existing scenario
        callbacks
      );
    }

  },

  documentReady: SimulatorEngine.simControler.documentReady

};
