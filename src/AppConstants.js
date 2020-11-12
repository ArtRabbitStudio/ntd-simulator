export const DISEASE_LIMF = 'lf'
export const DISEASE_TRACHOMA = 'trachoma'
export const DISEASE_STH_ROUNDWORM = 'sth-roundworm'

export const DISEASE_LABELS = {
  'lf':                 'Lymphatic filariasis',
  'trachoma':           'Trachoma',
  'sth-roundworm':      'Soil-transmitted helminth (roundworm)' 
}

export const DISEASE_CONFIG = {
  'lf': {
                        historicStartYear: 2010,
                        historicEndYear: 2019,
                        interventionStartYear: 2020,
                        defaultMetric: 'Ms',
                        numberOfYears: 11 * 2,
                        startMonth: 240,
                        offsetBarWidthDivider: 2,
                        mapLegend: 'Prevalence map and trends since 2010.'

  },
  'trachoma': {
                        historicStartYear: 2017,
                        historicEndYear: 2019,
                        interventionStartYear: 2020,
                        defaultMetric: 'Ms',
                        numberOfYears: 11 * 2,
                        startMonth: 240,
                        offsetBarWidthDivider: 1,
                        mapLegend: 'Prevalence map and trends since 2017'
  },
  'sth-roundworm': {
                        historicStartYear: 2010,
                        historicEndYear: 2018,
                        interventionStartYear: 2018,
                        defaultMetric: 'KK',
                        numberOfYears: 11 * 2,
                        startMonth: 216,
                        offsetBarWidthDivider: 2,
                        mapLegend: 'Prevalence map and trends since 2017'
  }
}

export const NO_DATA = '[no data]'

