import { observable, action, decorate } from 'mobx'
import { DISEASE_LIMF } from '../constants'

class UiState {
    country = null
    disease = DISEASE_LIMF
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

    setDisease(event) {
        this.disease = event.target.value
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
