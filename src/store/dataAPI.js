import { computed, decorate } from "mobx";
import centroid from "@turf/centroid";
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
} from "lodash/fp";
import {
  merge,
  min,
  max,
  zip,
  mapValues,
  last,
  transform,
  findIndex,
} from "lodash";
import { color, extent, scaleSymlog, interpolateHcl } from "d3";

import {
  DISEASE_LIMF,
  DISEASE_TRACHOMA,
  DISEASE_STH_ROUNDWORM,
  DISEASE_STH_WHIPWORM,
  DISEASE_STH_HOOKWORM,
  DISEASE_SCH_MANSONI
} from 'AppConstants';

//const seq5 = ["#BA455E", "#CB7386", "#DDA2AF", "#EED0D7", "#ffffff"];
//const seq5b = ["#A91636", "#BA455E", "#CB7386", "#DDA2AF", "#FFFFFF"];
//const div3 = ["#32C2A2", "#ededed", "#fe4c73"];
//const div5 = ["#32C2A2", "#84DAC7", "#ededed", "#FFB2C3", "#fe4c73"];
//const div7 = [ "#32C2A2", "#ADE6DA", "#D6F3EC", "#0000ff", "#DDA2AF", "#CB7386", "#BA455E" ];

const emptyFeatureCollection = { type: "FeatureCollection", features: [] };

// helper that groups columns of the csv into object properties
const groupProps = (obj, pattern) =>
  flow(
    pickByFP((value, key) => new RegExp(pattern).test(key)),
    mapKeys((key) => key.replace(/[^\d]/g, ""))
  )(obj);

const roundPrevalence = (p) => (isFinite(p) ? round((p * 100 * 100))/100 : null);

const buildScales = (stats, data) => {
  //   const prev = scaleSequential(interpolateReds)
  //     .domain([0, stats.prevalence.max])
  //     .nice(5)

  const prev = scaleSymlog()
    .domain([0,1, stats.prevalence.max])
    .range(["#fff","#FAEAE1", "#D86422"])
    .nice();

  const mp = max(stats.performance.map((x) => Math.abs(x)));

  const perf = scaleSymlog()
    .domain([-mp, 0.1, mp])
    .range(["#4dac26", "#fff", "#d01c8b"])
    .interpolate(interpolateHcl)
    .nice();

  //   const perfDiv1 = scaleDiverging([-mp, 0, mp], t => interpolateRdBu(1 - t))
  //   const perfDiv2 = scaleDiverging()
  //     .domain([-mp, 0, mp])
  //     .interpolator(t =>
  //       piecewise(interpolateHcl, ['#32C2A2', '#D6F3EC', '#A91636'])(t)
  //     )

  //   const perfQuantize = scaleQuantize()
  //     .domain([-mp, mp])
  //     .range(steps5)

  //   const perfTresh = scaleThreshold()
  //     .domain([-mp / 2, mp / 2])
  //     .range(steps3)

  //   console.log('>>> build stats', stats)

  return { prev, perf };
};

const defaultScales = {
  prev: () => "#000000",
  perf: () => "#000000",
};

// calculates min/max values for prevalence and performance
function generateStats(data,disease) {

  let prevExtent = []
  switch ( disease ) {
    case DISEASE_LIMF:
      prevExtent = flow(
        values,
        map(({ prevalence }) => {
          const pValues = values(prevalence);
          return [min(pValues), max(pValues)];
        })
      )(data);
      break
    case DISEASE_TRACHOMA:
      prevExtent = flow(
        values,
        map(({ prevalence }) => {
          const pValues = values(prevalence);
          return [pValues[17], pValues[19]];
        })
      )(data);
      break
    case DISEASE_STH_ROUNDWORM:
    case DISEASE_STH_WHIPWORM: 
    case DISEASE_STH_HOOKWORM: 
    case DISEASE_SCH_MANSONI: 
      prevExtent = flow(
        values,
        map(({ prevalence }) => {
          const pValues = values(prevalence);
          return [pValues[15], pValues[18]];
        })
      )(data);
      break
    default:
      prevExtent = []
      break
  }


  const [minN, maxN] = zip(...prevExtent);


  // create performance stats
  const performances = flow(map("performance"))(data);

  const stats = {
    // TODO: use array for prevalence extent (more consistent)
    prevalence: { min: min(minN) ?? 0, max: max(maxN) ?? 0 },
    performance: extent(performances),
  };

  //   console.log('>>> generate stats', data.length, data, stats)

  return stats;
}

// adds rank to entries for each year based on prevalence
function addRanking(data) {
  const dataMap = keyBy("id")(data);

  // create entries for each prevalence value and year
  const prevByYear = flow(
    // only take entries where all prevalence values (for every year) are numbers
    filter((x) =>
      flow(
        map(isFinite),
        everyFP((x) => x)
      )(x.prevalence)
    ),
    flatMap(({ prevalence, id }) => {
      return entries(prevalence).map(([year, prevalence]) => ({
        year,
        prevalence,
        id,
      }));
    }),
    groupBy("year")
  )(data);

  // sort entries and add ranks
  const prevByYearWithRank = transform(
    prevByYear,
    (result, value, year, data) => {
      const prevYear = (parseInt(year) - 1).toString();
      const sorted = sortByFP([
        (x) => x.prevalence,
        (x) => findIndex(result[prevYear], ["id", x.id]),
        (x) => dataMap[x.id].name,
      ])(value);
      result[year] = sorted.map((x, i) => ({
        ...x,
        year: +x.year,
        rank: i + 1,
      }));
    },
    {}
  );

  // group entries by ID
  const ranksByID = flow(
    values,
    flatten,
    groupBy("id"),
    mapValuesFP(map(omit("id")))
  )(prevByYearWithRank);

  // add rankings to entries
  const ranked = map((x) => ({
    ...x,
    ranks: ranksByID[x.id] || null,
  }))(data);

  //   console.log('>>> ranking', data.length, data, ranked)

  return ranked;
}

// creates data entries for countries, states, and UIs
function createEntries({ data, relations, key, disease }) {
  const groupRelByKey = groupBy(key)(relations);
  const entr = flow(
    map((row) => {
      const { [key]: id, Population } = row;
      const meta = groupRelByKey[id][0];

      // retrieve entity names from relations
      const name =
        key === "Country"
          ? meta.CountryName
          : key === "StateCode"
            ? meta.StateName
            : meta.IUName;
      
      const prevalence = mapValuesFP(roundPrevalence)(groupProps(row, "Prev_"));
      const prevValues = values(prevalence);
      // take specific value depending on data we're assuming it's supplied from 2010 - 2019
      let performance = 0
      switch ( disease ) {
        case DISEASE_LIMF:
          performance = round(last(prevValues) - prevValues[9]*100)/100;
          break
        case DISEASE_TRACHOMA:
          performance = round(last(prevValues) - prevValues[17]*100)/100;
          break
        case DISEASE_STH_ROUNDWORM:
        case DISEASE_STH_WHIPWORM:
        case DISEASE_STH_HOOKWORM:
        case DISEASE_SCH_MANSONI: 
          performance = round(last(prevValues) - prevValues[17]*100)/100;
          break
        default:
          break
      }
      
      // this looks at the entire range from 2000 - 2019 or first and last
      //const performance = last(prevValues) - first(prevValues);

      //    const probability = groupProps(row, 'elimination')
      //   could be enabled if needed
      const lower = groupProps(row, 'Lower')
      const upper = groupProps(row, 'Upper')

      const related = groupRelByKey[id];
      const relatedCountries = flow(groupBy("Country"), keys)(related);
      const relatedStates = flow(groupBy("StateCode"), keys)(related);
      const relatedStateNames = flow(groupBy("StateName"), keys)(related);
      const relatedIU = flow(groupBy("IUID"), keys)(related);

      const enhanced = {
        id,
        name,
        population: round(Population, 0),
        endemicity: row.Endemicity,
        prevalence,
        performance,
        // probability,
        lower,
        upper,
        relatedCountries,
        relatedStates,
        relatedStateNames,
        relatedIU,
      };
      return enhanced;
    })
  )(data);

  //   console.log('>>> create Entries', data.length, data, entr)

  return entr;
}

// merges data collection into feature collection (geo)
function mergeFeatures({ data, featureCollection, key, scales }) {
  const dataMap = keyBy("id")(data);

  const filtered = featureCollection.features
    // only take features, which are in the data
    .filter((feature) => {
      const id = feature.properties[key];
      return dataMap[id] ?? false;
    });

  const { prev, perf } = scales;
  const features = filtered.map((feature) => {
    const id = feature.properties[key];
    const featureData = dataMap[id];
    const { performance } = featureData;
    const prevalenceOverTime = featureData?.prevalence ?? {};
    const endemicity = featureData?.endemicity ?? "–";
    // const population = featureData?.population ?? '–'

    // get color from scale if prevalence value available
    const colorsByYear = mapValues(prevalenceOverTime, (prevalence) => {
      
      if ( featureData.endemicity === 'Non-endemic' ) return '#fff'
        return isFinite(prevalence) ? color(prev(prevalence)).hex() : null
      }
    );


    return merge({}, feature, {
      properties: {
        ...mapKeys((year) => `color-${year}`)(colorsByYear),
        ...mapKeys((year) => `prev-${year}`)(prevalenceOverTime),
        performance,
        "color-perf": perf(performance),
        endemicity,
      },
    });
  });

  //   console.log('>>> merge features', filtered.length, filtered, features)

  return { type: "FeatureCollection", features };
}

class DataAPI {
  constructor(rootStore) {
    this.dataStore = rootStore.dataStore;
    this.uiState = rootStore.uiState;
  }

  get rowFilter() {
    const { endemicity, regime } = this.uiState;
    return !!endemicity
      ? { Regime: regime, Endemicity: endemicity }
      : { Regime: regime };
  }

  // returns all country rows from CSV file filtered by regime
  get filteredCountryRows() {
    const { countries } = this.dataStore;

    if (countries) {
      return countries;
      //return filter(this.rowFilter)(countries)
    }

    return null;
  }

  // returns all state rows from CSV file filtered by regime
  get filteredStateRows() {
    const { states } = this.dataStore;

    if (states) {
      return states;
      //return filter(this.rowFilter)(states);
    }

    return null;
  }

  // returns all IU rows from CSV file filtered by regime
  get filteredIURows() {
    const { ius } = this.dataStore;

    if (ius) {
      return ius;
      //return filter(this.rowFilter)(ius)
    }

    return null;
  }

  // return all countries for selected regime
  get countriesCurrentRegime() {
    const countries = this.filteredCountryRows;
    const { relations } = this.dataStore;
    const { disease } = this.uiState;

    if (countries && relations) {
      return createEntries({ data: countries, relations, key: "Country", disease:disease });
    }

    return null;
  }

  // return all states for selected regime
  get statesCurrentRegime() {
    const states = this.filteredStateRows;
    const { relations } = this.dataStore;
    const { disease } = this.uiState;

    if (states && relations) {
      return createEntries({ data: states, relations, key: "StateCode",disease:disease });
    }

    return null;
  }


  get IUsCurrentRegimeByCountry() {
    const ius = this.filteredIURows;
    const { country } = this.uiState;
    const { relations } = this.dataStore;

    if (ius && country && relations) {
      const countryIUs = flow(groupBy((x) => x.relatedCountries[0] === country))(ius);
      return countryIUs;
    }
    return null;
  }

  // return all IUs for selected regime
  get IUsCurrentRegime() {
    const ius = this.filteredIURows;
    const { relations } = this.dataStore;
    const { disease } = this.uiState;

    if (ius && relations) {
      return createEntries({ data: ius, relations, key: "IUID",disease:disease });
    }

    return null;
  }

  // return all countries for selected regime, ranked by prevalence over years, and stats
  get countryData() {
    const countries = this.countriesCurrentRegime;
    const stats = this.countryStats;

    if (countries) {
      const data = addRanking(countries);
      return { data: keyBy("id")(data), stats };
    }

    return null;
  }

  // return all states for selected regime, ranked by prevalence over years, and stats
  get stateData() {
    const states = this.statesCurrentRegime;
    const stats = this.stateStats;

    if (states) {
      const data = addRanking(states);
      return { data: keyBy("id")(data), stats };
    }

    return null;
  }

  // return all states for selected regime and country, ranked by prevalence over years, and stats
  get stateDataCurrentCountry() {
    const statesByCountry = this.stateByCountryData;
    const { country } = this.uiState;

    if (statesByCountry && country) {
      return statesByCountry[country];
    }

    return null;
  }

  // return all states for selected regime grouped by country
  // for each country, states are ranked by prevalence over years, and stats are added
  get stateByCountryData() {
    const states = this.statesCurrentRegime;
    const { disease } = this.uiState;
    if (states) {
      return flow(
        groupBy((x) => x.relatedCountries[0]),
        mapValuesFP((s) => {
          const stats = generateStats(s,disease);
          const data = addRanking(s);
          return { data: keyBy("id")(data), stats };
        })
      )(states);
    }

    return null;
  }

  // return all IUs for selected regime and country, grouped by states
  // each group is ranked by prevalence over years, and stats are added
  get iuByStateData() {
    const IUs = this.IUsCurrentRegime;
    const { country,disease } = this.uiState;

    if (IUs) {
      return flow(
        filter((x) => x.relatedCountries[0] === country),
        groupBy((x) => x.relatedStates[0]),
        mapValuesFP((ius) => {
          const stats = generateStats(ius,disease);
          const data = addRanking(ius);
          return { data: keyBy("id")(data), stats };
        })
      )(IUs);
    }

    return null;
  }

  get iuByCoutryData() {
    const IUs = this.IUsCurrentRegime;
    const { country } = this.uiState;

    if (IUs) {
      return flow(filter((x) => x.relatedCountries[0] === country))(IUs);
    }

    return null;
  }

  // return all IUs for selected regime, ranked by prevalence over years, and stats
  // if country is selected, only states of selected country will be returned
  get iuData() {
    const ius = this.IUsCurrentRegime;
    const stats = this.IUStats;

    if (ius) {
      const data = addRanking(ius);
      return { data: keyBy("id")(data), stats };
    }

    return null;
  }

  get selectedIUData() {
    const ius = this.IUsCurrentRegime;
    if (this.uiState.implementationUnit) {
    //  console.log(flow(filter((x) => x.id === this.uiState.implementationUnit))(ius))
      return flow(filter((x) => x.id === this.uiState.implementationUnit))(ius);
    }
    return 'nada';
    /*
    const stats = this.IUStats;

    if (ius) {
      const data = addRanking(ius);
      return { data: keyBy("id")(data), stats };
    }

    return null;
    */
  }

  get countryFeatures() {
    const featureCollection = this.dataStore.featuresLevel0;
    const countries = this.countriesCurrentRegime;
    const IUs = this.IUsCurrentRegime;
    const scales = this.countryScales;

    if (featureCollection && countries && IUs) {
        const IUCountries = [...new Set(IUs.map(item => item.relatedCountries[0]))];
        const IUCountryResults = flow(
          filter(({id})=> IUCountries.includes(id)),
        )(countries);
      return mergeFeatures({
        data: IUCountryResults,
        featureCollection,
        key: "ADMIN0ISO3",
        scales,
      });
    }

    return emptyFeatureCollection;
  }

  get countryCentroids() {
    const countries = this.countryFeatures;

    if (countries) {
      const centroids = {
        ...countries,
        features: countries.features.map((f) => {
          const population = f.properties.population;
          const c = centroid(f);
          return merge({}, c, { properties: { population } });
        }),
      };
      return centroids;
    }

    return emptyFeatureCollection;
  }

  get stateFeatures() {
    const featureCollection = this.dataStore.featuresLevel1;
    const states = this.statesCurrentRegime;
    const scales = this.stateScales;

    if (featureCollection && states) {
      return mergeFeatures({
        data: states,
        featureCollection,
        key: "ADMIN1ID",
        scales,
      });
    }

    return emptyFeatureCollection;
  }

  //   TODO: connect to stateFeatures()
  get stateFeaturesCurrentCountry() {
    const featureCollection = this.dataStore.featuresLevel1;
    const states = this.statesCurrentRegime;
    const { country } = this.uiState;
    const scales = this.stateScales;

    if (featureCollection && states) {
      return mergeFeatures({
        data: filter((x) => x.relatedCountries.includes(country))(states),
        featureCollection,
        key: "ADMIN1ID",
        scales,
      });
    }

    return emptyFeatureCollection;
  }

  get iuFeatures() {
    const featureCollection = this.dataStore.featuresLevel2;
    const IUs = this.IUsCurrentRegime;
    const scales = this.iuScales;
    const { country } = this.uiState;

    if (featureCollection && IUs && country) {
      return mergeFeatures({
        data: filter((x) => x.relatedCountries.includes(country))(IUs),
        featureCollection,
        key: "IU_ID",
        scales,
      });
    }

    return emptyFeatureCollection;
  }

  get countryScales() {
    const stats = this.countryStats;
    if (stats) {
      return buildScales(stats);
    }
    return defaultScales;
  }

  get stateScales() {
    const stats = this.stateStats;
    if (stats) {
      return buildScales(stats);
    }
    return defaultScales;
  }

  get iuScales() {
    const stats = this.IUStats;
    if (stats) {
      return buildScales(stats);
    }
    return defaultScales;
  }

  get countryStats() {
    const countries = this.countriesCurrentRegime;
    const { disease } = this.uiState;
    if (countries) {
      return generateStats(countries,disease);
    }
    return null;
  }

  get stateStats() {
    const states = this.statesCurrentRegime;
    const { disease } = this.uiState;
    if (states) {
      return generateStats(states,disease);
    }
    return null;
  }

  get IUStats() {
    const IUs = this.IUsCurrentRegime;
    const { disease } = this.uiState;
    if (IUs) {
      return generateStats(IUs,disease);
    }
    return null;
  }

  get countrySuggestions() {
    const countries = this.countriesCurrentRegime;
    const IUs = this.IUsCurrentRegime;
    
    if (countries && IUs) {
      const IUCountries = [...new Set(IUs.map(item => item.relatedCountries[0]))];
      const result = flow(
        filter(({id})=> IUCountries.includes(id)),
        map(({ id, name }) => ({ id, name })),
        sortByFP("name")
      )(countries);
      return result;
    }

    return [];
  }

  get iusByCountrySuggestions() {
    const ius = this.iuByCoutryData;

    if (ius) {
      const result = flow(
        map(({ id, name, endemicity, prevalence, relatedStateNames }) => ({ id, name, endemicity, prevalence: prevalence['2020'], relatedStateName: relatedStateNames[0] })),
        sortByFP("name")
      )(ius);
      return result;
    }

    return [];
  }

  get selectedCountry() {
    const { country } = this.uiState;
    const countryMap = this.countryData;

    if (country && countryMap) {
      const selected = countryMap.data[country];
      return selected;
    }

    return null;
  }
  get diseases() {
    return [
      DISEASE_LIMF,
      DISEASE_TRACHOMA,
      /*DISEASE_STH_ROUNDWORM,
      DISEASE_STH_WHIPWORM,
      DISEASE_STH_HOOKWORM,
      DISEASE_SCH_MANSONI
      TE removed, models need updating
      */
    ];
  }

  get regimes() {
    return [];
  }
}

decorate(DataAPI, {
  countryData: computed,
  stateData: computed,
  stateDataCurrentCountry: computed,
  stateByCountryData: computed,
  iuByStateData: computed,
  iuData: computed,
  selectedIUData: computed,
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
  iusByCountrySuggestions: computed,
  regimes: computed,
  diseases: computed,
  selectedCountry: computed,
  countryCentroids: computed,
  countryScales: computed,
  stateScales: computed,
  iuScales: computed,
  countryStats: computed,
  stateStats: computed,
  IUStats: computed,
});

export default DataAPI;
