import { observable, action, decorate } from 'mobx'

class UiState {

    country = null
    section = null
    disease = null
    implementationUnit = null

    constructor(rootStore) {
        this.rootStore = rootStore
        window.uiState = this
    }

    setCountry(id) {
        this.country = id
    }

    setSection( id ) {
        this.section = id
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
    section: observable,
    implementationUnit: observable,
    disease: observable,
    setCountry: action.bound,
    setSection: action.bound,
    setImplementationUnit: action.bound,
    setDisease: action.bound,
})

export default UiState
