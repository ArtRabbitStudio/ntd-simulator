import { observable, action, decorate } from 'mobx'
import { DISEASE_LIMF } from 'AppConstants'

class UiState {
    country = null
    disease = null
    implementationUnit = null

    constructor(rootStore) {
        this.rootStore = rootStore
    }

    setCountry(id) {
        this.country = id
    }

    setImplementationUnit(implementationUnit) {
        this.implementationUnit = implementationUnit
    }

    setDisease(id) {
        this.disease = id
    }



}

decorate(UiState, {
    country: observable,
    implementationUnit: observable,
    disease: observable,
    setCountry: action.bound,
    setImplementationUnit: action.bound,
    setDisease: action.bound,
})

export default UiState
