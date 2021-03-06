import DataStore from './dataStore'
import UIState from './uiState'
import DataAPI from './dataAPI'

class RootStore {
  dataStore = new DataStore(this)
  uiState = new UIState(this)
  dataAPI = new DataAPI(this)
}

export default RootStore
