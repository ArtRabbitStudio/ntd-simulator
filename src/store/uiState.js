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
        console.log( 'UiState setting country', this.country );
    }

    setSection( id ) {
        this.section = id
        console.log( 'UiState setting section', this.section );
    }

    setImplementationUnit(implementationUnit) {
        this.implementationUnit = implementationUnit
        console.log( 'UiState setting implementationUnit', this.implementationUnit );
    }

    setDisease(id) {
        this.disease = id
        console.log( 'UiState setting disease', this.disease );
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
