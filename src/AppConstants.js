const DISEASE_LIMF = 'lf';
const DISEASE_TRACHOMA = 'trachoma';
const DISEASE_STH_ROUNDWORM = 'sth-roundworm';
const DISEASE_STH_WHIPWORM = 'sth-whipworm';
const DISEASE_STH_HOOKWORM = 'sth-hookworm';
const DISEASE_SCH_MANSONI = 'sch-mansoni';

const DISEASE_LABELS = {

  [DISEASE_LIMF]:               'Lymphatic filariasis',
  [DISEASE_TRACHOMA]:           'Trachoma',
  [DISEASE_STH_ROUNDWORM]:      'Soil-transmitted helminth (roundworm)',
  [DISEASE_STH_WHIPWORM]:       'Soil-transmitted helminth (whipworm)',
  [DISEASE_STH_HOOKWORM]:       'Soil-transmitted helminth (hookworm)',
  [DISEASE_SCH_MANSONI]:       'Schistosomiasis Mansoni',

};

const DISEASE_CONFIG = {

  [DISEASE_LIMF]: {
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

  [DISEASE_TRACHOMA]: {
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

  [DISEASE_STH_ROUNDWORM]: {
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

  [DISEASE_STH_WHIPWORM]: {
    historicStartYear: 2010,
    historicEndYear: 2018,
    interventionStartYear: 2018,
    startYear: 2015,
    endYear: 2030,
    defaultMetric: 'KK',
    numberOfYears: 12 * 2,
    startMonth: 216,
    offsetBarWidthDivider: 2,
    mapLegend: 'Prevalence map and trends since 2017'
  },

  [DISEASE_STH_HOOKWORM]: {
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

  [DISEASE_SCH_MANSONI]: {
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

};

const NO_DATA = '[no data]';

const AppConstants = {

  DISEASE_LIMF,
  DISEASE_TRACHOMA,
  DISEASE_STH_ROUNDWORM,
  DISEASE_STH_WHIPWORM,
  DISEASE_STH_HOOKWORM,
  DISEASE_SCH_MANSONI,

  DISEASE_CONFIG,
  DISEASE_LABELS,

  NO_DATA
};


export {
  DISEASE_LIMF,
  DISEASE_TRACHOMA,
  DISEASE_STH_ROUNDWORM,
  DISEASE_STH_WHIPWORM,
  DISEASE_STH_HOOKWORM,
  DISEASE_SCH_MANSONI,

  DISEASE_CONFIG,
  DISEASE_LABELS,

  NO_DATA
};

export default AppConstants;

