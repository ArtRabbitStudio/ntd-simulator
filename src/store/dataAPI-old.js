import { computed, decorate } from 'mobx'
import centroid from '@turf/centroid'

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

            //   const probability = groupProps(row, 'elimination')
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
                // probability,
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

// merges data collection into feature collection (geo)
function mergeFeatures({ data, featureCollection, key, scales }) {
    const dataMap = keyBy('id')(data)
  
    const filtered = featureCollection.features
      // only take features, which are in the data
      .filter(feature => {
        const id = feature.properties[key]
        return dataMap[id] ?? false
      })
  
    const { prev, perf } = scales
    const features = filtered.map(feature => {
      const id = feature.properties[key]
      const featureData = dataMap[id]
      const { performance } = featureData
      const prevalenceOverTime = featureData?.prevalence ?? {}
      const endemicity = featureData?.endemicity ?? '–'
      // const population = featureData?.population ?? '–'
  
      // get color from scale if prevalence value available
      const colorsByYear = mapValues(prevalenceOverTime, prevalence =>
        isFinite(prevalence) ? color(prev(prevalence)).hex() : null
      )
  
      return merge({}, feature, {
        properties: {
          ...mapKeys(year => `color-${year}`)(colorsByYear),
          ...mapKeys(year => `prev-${year}`)(prevalenceOverTime),
          performance,
          'color-perf': perf(performance),
          endemicity,
        },
      })
    })
  
    //   console.log('>>> merge features', filtered.length, filtered, features)
  
    return { type: 'FeatureCollection', features }
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

    // return all IUs for selected regime
    get IUsCurrentRegime() {
        const ius = this.filteredIURows
        const { relations } = this.dataStore

        if (ius && relations) {
        return createEntries({ data: ius, relations, key: 'IUID' })
        }

        return null
    }

    get IUSuggestions() {
        const ius = this.IUsCurrentRegime
        console.log(ius);

        if (ius) {
            const result = flow(
                map(({ id, name }) => ({ id, name })),
                sortByFP('name')
            )(ius)
            return result
        }

        return []
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

    // return all IUs for selected regime, ranked by prevalence over years, and stats
  // if country is selected, only states of selected country will be returned


  get countryFeatures() {
    const featureCollection = this.dataStore.featuresLevel0
    const countries = this.countriesCurrentRegime
    const scales = this.countryScales

    if (featureCollection && countries) {
      return mergeFeatures({
        data: countries,
        featureCollection,
        key: 'ADMIN0ISO3',
        scales,
      })
    }

    return emptyFeatureCollection
  }

  get countryCentroids() {
    const countries = this.countryFeatures

    if (countries) {
      const centroids = {
        ...countries,
        features: countries.features.map(f => {
          const population = f.properties.population
          const c = centroid(f)
          return merge({}, c, { properties: { population } })
        }),
      }
      return centroids
    }

    return emptyFeatureCollection
  }

  get stateFeatures() {
    const featureCollection = this.dataStore.featuresLevel1
    const states = this.statesCurrentRegime
    const scales = this.stateScales

    if (featureCollection && states) {
      return mergeFeatures({
        data: states,
        featureCollection,
        key: 'ADMIN1ID',
        scales,
      })
    }

    return emptyFeatureCollection
  }

  //   TODO: connect to stateFeatures()
  get stateFeaturesCurrentCountry() {
    const featureCollection = this.dataStore.featuresLevel1
    const states = this.statesCurrentRegime
    const { country } = this.uiState
    const scales = this.stateScales

    if (featureCollection && states) {
      return mergeFeatures({
        data: filter(x => x.relatedCountries.includes(country))(states),
        featureCollection,
        key: 'ADMIN1ID',
        scales,
      })
    }

    return emptyFeatureCollection
  }

  get iuFeatures() {
    const featureCollection = this.dataStore.featuresLevel2
    const IUs = this.IUsCurrentRegime
    const scales = this.iuScales
    const { country } = this.uiState

    if (featureCollection && IUs && country) {
      return mergeFeatures({
        data: filter(x => x.relatedCountries.includes(country))(IUs),
        featureCollection,
        key: 'IU_ID',
        scales,
      })
    }

    return emptyFeatureCollection
  }
  
  get countryScales() {
    const stats = this.countryStats
    if (stats) {
      return buildScales(stats)
    }
    return defaultScales
  }

  get stateScales() {
    const stats = this.stateStats
    if (stats) {
      return buildScales(stats)
    }
    return defaultScales
  }

  get iuScales() {
    const stats = this.IUStats
    if (stats) {
      return buildScales(stats)
    }
    return defaultScales
  }

  get countryStats() {
    const countries = this.countriesCurrentRegime
    if (countries) {
      return generateStats(countries)
    }
    return null
  }

  get stateStats() {
    const states = this.statesCurrentRegime
    if (states) {
      return generateStats(states)
    }
    return null
  }

  get IUStats() {
    const IUs = this.IUsCurrentRegime
    if (IUs) {
      return generateStats(IUs)
    }
    return null
  }

}

decorate(DataAPI, {
    diseases: computed,
    selectedCountry: computed,
    countrySuggestions: computed,
    IUSuggestions: computed,
    countryFeatures: computed,
    stateFeatures: computed,
    stateFeaturesCurrentCountry: computed,
    iuFeatures: computed,
    filteredCountryRows: computed,
    filteredStateRows: computed,
    filteredIURows: computed,
    countriesCurrentRegime: computed,
    statesCurrentRegime: computed,
    IUsCurrentRegime: computed,
    rowFilter: computed,
    countrySuggestions: computed,
    regimes: computed,
    selectedCountry: computed,
    countryCentroids: computed,
})

export default DataAPI
