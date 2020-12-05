export const DISEASE_LIMF = 'lf'
export const DISEASE_TRACHOMA = 'trachoma'
export const DISEASE_STH_ROUNDWORM = 'sth-roundworm'
export const DISEASE_STH_WHIPWORM = 'sth-whipworm'

export const DISEASE_LABELS = {
  'lf':                 'Lymphatic filariasis',
  'trachoma':           'Trachoma',
  'sth-roundworm':      'Soil-transmitted helminth (roundworm)',
  'sth-whipworm':       'Soil-transmitted helminth (whipworm)',
}

export const DISEASE_CONFIG = {
  'lf': {
                        historicStartYear: 2010,
                        historicEndYear: 2019,
                        interventionStartYear: 2020,
                        startYear: 2015,
                        endYear: 2031,
                        defaultMetric: 'Ms',
                        numberOfYears: 11 * 2,
                        startMonth: 240,
                        offsetBarWidthDivider: 2,
                        mapLegend: 'Prevalence map and trends since 2010.',
                        mdaTooltip: 'Light blue bars show no intervention;  blue bars show intervention, the height of the blue colour shows coverage. Historic interventions before 2019 are greyed out.'
  },
  'trachoma': {
                        historicStartYear: 2017,
                        historicEndYear: 2019,
                        interventionStartYear: 2020,
                        startYear: 2017,
                        endYear: 2031,
                        defaultMetric: 'Ms',
                        numberOfYears: 11 * 2,
                        startMonth: 240,
                        offsetBarWidthDivider: 1,
                        mapLegend: 'Prevalence map and trends since 2017',
                        mdaTooltip: 'Light blue bars show no intervention;  blue bars show intervention, the height of the blue colour shows coverage. Historic interventions are greyed out. Use the slider to adjust interruption and when MDA is discontinued.'

  },
  'sth-roundworm': {
                        historicStartYear: 2010,
                        historicEndYear: 2018,
                        interventionStartYear: 2018,
                        startYear: 2015,
                        endYear: 2030,
                        defaultMetric: 'KK',
                        numberOfYears: 12 * 2,
                        startMonth: 216,
                        offsetBarWidthDivider: 2,
                        mapLegend: 'Prevalence map and trends since 2017',
                        mdaTooltip: 'Light blue bars show no intervention;  blue bars show intervention, the height of the blue colour shows coverage. Historic interventions before 2018 are greyed out.'

  },
  'sth-whipworm': {
                        historicStartYear: 2010,
                        historicEndYear: 2018,
                        interventionStartYear: 2018,
                        startYear: 2015,
                        endYear: 2030,
                        defaultMetric: 'KK',
                        numberOfYears: 12 * 2,
                        startMonth: 216,
                        offsetBarWidthDivider: 2,
                        mapLegend: 'Prevalence map and trends since 2017',
                        mdaTooltip: 'Light blue bars show no intervention;  blue bars show intervention, the height of the blue colour shows coverage. Historic interventions before 2018 are greyed out.'

  }
}

export const NO_DATA = '[no data]'

