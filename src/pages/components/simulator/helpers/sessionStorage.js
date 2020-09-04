import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY_SCENARIO_KEYS  = 'ntd.scenarioKeys';
const STORAGE_KEY_SCENARIO_DATA = 'ntd.scenarioData';

const getKeyForId = ( id ) => {
    return `${STORAGE_KEY_SCENARIO_DATA}:${id}`;
};

/*
const getIdForKey = ( key ) => {
  return key.split( ':' )[ 1 ];
};
*/

const sessionStorage = {

  get scenarioKeys() {
    return JSON.parse( localStorage.getItem( STORAGE_KEY_SCENARIO_KEYS ) ) || []
  },

  set scenarioKeys( newKeys ) {
    if( newKeys === [] ) {
      localStorage.removeItem( STORAGE_KEY_SCENARIO_KEYS );
      return;
    }
    localStorage.setItem( STORAGE_KEY_SCENARIO_KEYS, JSON.stringify( newKeys ) );
  },

  get scenarioCount() {
    return this.scenarioKeys.length;
  },

  newScenario: function( label = null ) {

    // REPLACEME
    label = label ? label : new Date();
    const id = uuidv4();

    console.log( `SessionStorage creating new scenario ${id} / ${label}` );

    const scenario = { id, label };

    return this.storeScenario( scenario );
  },

  storeScenario: function ( scenario ) {

    if( !scenario.id || typeof scenario.id === 'undefined' ) {
      scenario.id = uuidv4();
    }

    const storageKey = getKeyForId( scenario.id );

    console.log( `SessionStorage storing scenario ${scenario.id} "${scenario.label}" under key:`, storageKey );

    try {
      localStorage.setItem( storageKey, JSON.stringify( scenario ) );
    }

    catch( error ) {

      if ( isQuotaExceeded( error ) ) {
        throw new Error( 'SessionStorage.storeScenario: localStorage quota exceeded' );
      }

      console.error( error.message );
      return;

    }

    let existingKeys = this.scenarioKeys;

    let keyExists = existingKeys.reduce(
      ( acc, { id, label } ) => {
        return acc || ( id === scenario.id );
      },
      false
    );

    if ( !keyExists ) {
      const newKeys = [
        ...existingKeys,
        { id: scenario.id , label: scenario.label }
      ];
      this.scenarioKeys = newKeys;
    }

    return scenario;

  },

  fetchScenario: function ( idToFetch ) {

    const storageKey = getKeyForId( idToFetch );
    console.log( `SessionStorage fetching scenario "${idToFetch}" via key:`, storageKey );

    const result = JSON.parse( localStorage.getItem( storageKey ) );

    if ( !result ) {
      throw new Error( `SessionStorage couldn't find a scenario with id ${idToFetch}` );
    }

    return result;
  },

  fetchAllScenarios: function() {

    return this.scenarioKeys.map(
      ( { id, label } ) => {
        return this.fetchScenario( id );
      }
    );

  },

  removeScenario: function( idToRemove ) {

    const storageKey = getKeyForId( idToRemove );
    console.log( `SessionStorage removing scenario for id ${idToRemove} under key ${storageKey}` );
    localStorage.removeItem( storageKey );

    let newKeys = [ ...this.scenarioKeys ].filter(
      ( { id, label } ) => {
        return id !== idToRemove;
      }
    );

    this.scenarioKeys = newKeys;

    return;
  },

  removeAllScenarios: function() {

    console.log( `SessionStorage removing all scenarios` );

    return this.scenarioKeys.map(
      ( { id, label } ) => {
        return this.removeScenario( id );
      }
    );
  }

};

// crocodillon.com/blog/always-catch-localstorage-security-and-quota-exceeded-errors
const isQuotaExceeded = ( e ) => {

  var quotaExceeded = false;

  if ( e ) {

    if ( e.code ) {

      switch ( e.code ) {

        case 22:
          quotaExceeded = true;
          break;

        case 1014:
          // Firefox
          if ( e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ) {
            quotaExceeded = true;
          }
          break;

        default:
          break;

      }

    }

    else if ( e.number === -2147024882 ) {
      // Internet Explorer 8
      quotaExceeded = true;
    }

  }

  return quotaExceeded;
};

export default sessionStorage;
