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


// helper that groups columns of the csv into object properties
const groupProps = (obj, pattern) =>
    flow(
        pickByFP((value, key) => new RegExp(pattern).test(key)),
        mapKeys(key => key.replace(/[^\d]/g, ''))
    )(obj)

const roundPrevalence = p => (isFinite(p) ? round(p * 100, 2) : null)

// creates data entries for countries, states, and UIs
function createEntries({ data, relations, key }) {
    const groupRelByKey = groupBy(key)(relations)

    const entr = flow(
        map(row => {
            const { [key]: id, Population } = row
            const meta = groupRelByKey[id][0]

            // retrieve entity names from relations
            const name =
                key === 'Country'
                    ? meta.CountryName
                    : key === 'StateCode'
                        ? meta.StateName
                        : meta.IUName

            const prevalence = mapValuesFP(roundPrevalence)(groupProps(row, 'Prev_'))
            const prevValues = values(prevalence)
            const performance = last(prevValues) - first(prevValues)

            const probability = groupProps(row, 'elimination')
            //   could be enabled if needed
            //   const lower = groupProps(row, 'Lower')
            //   const upper = groupProps(row, 'Upper')

            const related = groupRelByKey[id]
            const relatedCountries = flow(groupBy('Country'), keys)(related)
            const relatedStates = flow(groupBy('StateCode'), keys)(related)
            const relatedIU = flow(groupBy('IUID'), keys)(related)

            const enhanced = {
                id,
                name,
                population: round(Population, 0),
                endemicity: row.Endemicity,
                prevalence,
                performance,
                probability,
                // lower,
                // upper,
                relatedCountries,
                relatedStates,
                relatedIU,
            }
            return enhanced
        })
    )(data)

    //   console.log('>>> create Entries', data.length, data, entr)

    return entr
}

class DataAPI {
    constructor(rootStore) {
        this.dataStore = rootStore.dataStore
        this.uiState = rootStore.uiState
    }

    get rowFilter() {
        const { endemicity, regime } = this.uiState
        return !!endemicity
            ? { Regime: regime, Endemicity: endemicity }
            : { Regime: regime }
    }

    // returns all country rows from CSV file filtered by regime
    get filteredCountryRows() {
        const { countries } = this.dataStore

        if (countries) {
            return countries;
            //return filter(this.rowFilter)(countries)
        }

        return null
    }

    // return all countries for selected regime
    get countriesCurrentRegime() {
        const countries = this.filteredCountryRows
        const { relations } = this.dataStore

        if (countries && relations) {
            return createEntries({ data: countries, relations, key: 'Country' })
        }

        return null
    }

    get countrySuggestions() {
        const countries = this.countriesCurrentRegime

        if (countries) {
            const result = flow(
                map(({ id, name }) => ({ id, name })),
                sortByFP('name')
            )(countries)
            return result
        }

        return []
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
    countrySuggestions: computed,
})

export default DataAPI
