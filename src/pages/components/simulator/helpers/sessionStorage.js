import { Base64 } from 'js-base64';

const STORAGE_KEY_SCENARIO_KEYS  = 'ntd.scenarioKeys';
const STORAGE_KEY_SCENARIO_DATA = 'ntd.scenarioData:';
//const STORAGE_KEY_SCENARIO_INDEX = 'ntd.scenarioIndex';

const getKeyForLabel = ( label ) => {
    return `${STORAGE_KEY_SCENARIO_DATA}${Base64.encode( label )}`;
};

const getLabelForKey = ( key ) => {
  return Base64.decode( key.split( ':' )[ 1 ] );
};

// http://crocodillon.com/blog/always-catch-localstorage-security-and-quota-exceeded-errors
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
}

const sessionStorage = {

  storeScenario: function ( scenario ) {

    if( !scenario.label || typeof scenario.label === 'undefined' ) {
      throw new Error( `Can't store scenario with no 'label' field:`, scenario );
    }

    const storageKey = getKeyForLabel( scenario.label );

    console.log( `SessionStorage storing scenario "${scenario.label}" under key:`, storageKey );

    try {
      localStorage.setItem( storageKey, JSON.stringify( scenario ) );
    }

    catch( error ) {

      if ( isQuotaExceeded( error ) ) {
        throw new Error( 'localStorage quota exceeded' );
      }

      console.error( error.message );
      return;

    }

    let existingKeys = this.scenarioKeys;

    if ( !existingKeys.includes( storageKey ) ) {
      existingKeys.push( storageKey );
      this.scenarioKeys = existingKeys;
    }

    return;

  },

  fetchScenario: function ( label ) {
    const storageKey = getKeyForLabel( label );
    console.log( `SessionStorage fetching scenario "${label}" via key:`, storageKey );
    const result = JSON.parse( localStorage.getItem( storageKey ) );
    return result;
  },

  fetchScenarioAtIndex: function ( idx ) {

    let existingKeys = this.scenarioKeys;

    if( idx >= existingKeys.length ) {
      throw new Error( `SessionStorage: can't remove scenario at index ${idx}` );
    }

    const label = getLabelForKey( existingKeys[ idx ] );
    return this.fetchScenario( label );

  },

  fetchAllScenarios: function() {
    const existingKeys = this.scenarioKeys;
    return existingKeys.map(
      ( k ) => {
        const label = getLabelForKey( k );
        return this.fetchScenario( label );
      }
    );
  },

  removeScenario: function( label ) {
    const storageKey = getKeyForLabel( label );
    console.log( `SessionStorage removing scenario for label ${label} under key ${storageKey}` );
    localStorage.removeItem( storageKey );

    let existingKeys = this.scenarioKeys;

    const newKeys = existingKeys.filter(
      ( k ) => { return k !== storageKey; }
    );

    this.scenarioKeys = newKeys;

    return;
  },

  removeScenarioAtIndex: function( idx ) {

    let existingKeys = this.scenarioKeys;

    if( idx >= existingKeys.length ) {
      throw new Error( `SessionStorage: can't remove scenario at index ${idx}` );
    }

    const label = getLabelForKey( existingKeys[ idx ] );
    console.log( `SessionStorage: removing scenario for label: "${label}"` );
    this.removeScenario( label );

    return;
  },

  get scenarioKeys() {
    return JSON.parse( localStorage.getItem( STORAGE_KEY_SCENARIO_KEYS ) ) || [];
  },

  set scenarioKeys( newKeys ) {
    localStorage.setItem( STORAGE_KEY_SCENARIO_KEYS, JSON.stringify( newKeys ) );
  },

  get scenarioCount() {
    return this.scenarioKeys.length;
  },

  get currentTabLabel() {
    let existingKeys = this.scenarioKeys;
    return existingKeys.length
      ? getLabelForKey( existingKeys[ existingKeys.length - 1 ] )
      : null;
  },

  get currentTabScenario() {
    return this.fetchScenario( this.currentTabLabel );
  }

};

export default sessionStorage;
