import { computed, decorate } from 'mobx'
//import centroid from '@turf/centroid'

import {
    groupBy,
    keyBy,
    flow,
    values,
    flatten,
    entries,
    map,
    round,
    keys,
    filter,
    mapKeys,
    omit,
    flatMap,
    every as everyFP,
    mapValues as mapValuesFP,
    pickBy as pickByFP,
    sortBy as sortByFP,
} from 'lodash/fp'
import {
    merge,
    min,
    max,
    zip,
    mapValues,
    first,
    last,
    transform,
    findIndex,
} from 'lodash'
import { color, extent, scaleSymlog, scaleLinear, interpolateHcl } from 'd3'

import {
    DISEASE_LIMF,
} from '../constants'

const seq5 = ['#BA455E', '#CB7386', '#DDA2AF', '#EED0D7', '#ffffff']
const seq5b = ['#A91636', '#BA455E', '#CB7386', '#DDA2AF', '#FFFFFF']
const div3 = ['#32C2A2', '#ededed', '#fe4c73']
const div5 = ['#32C2A2', '#84DAC7', '#ededed', '#FFB2C3', '#fe4c73']
const div7 = [
    '#32C2A2',
    '#ADE6DA',
    '#D6F3EC',
    '#0000ff',
    '#DDA2AF',
    '#CB7386',
    '#BA455E',
]

const emptyFeatureCollection = { type: 'FeatureCollection', features: [] }

class DataAPI {
    constructor(rootStore) {
        this.dataStore = rootStore.dataStore
        this.uiState = rootStore.uiState
    }

    get selectedCountry() {
        const { country } = this.uiState
        const countryMap = this.countryData

        if (country && countryMap) {
            const selected = countryMap.data[country]
            return selected
        }

        return null
    }

    get diseases() {
        return [DISEASE_LIMF]
    }

}

decorate(DataAPI, {
    diseases: computed,
    selectedCountry: computed,
})

export default DataAPI
