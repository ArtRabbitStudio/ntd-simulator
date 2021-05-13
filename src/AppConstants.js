const DISEASE_LIMF = 'lf';
const DISEASE_TRACHOMA = 'trachoma';
const DISEASE_STH_ROUNDWORM = 'sth-roundworm';
const DISEASE_STH_WHIPWORM = 'sth-whipworm';
const DISEASE_STH_HOOKWORM = 'sth-hookworm';
const DISEASE_SCH_MANSONI = 'sch-mansoni';

const DISEASE_LABELS = {

  [DISEASE_LIMF]:               'LymphaticFilariasis',
  [DISEASE_TRACHOMA]:           'Trachoma',
  [DISEASE_STH_ROUNDWORM]:      'SoilTransmittedHelmithiasisRoundworm',
  [DISEASE_STH_WHIPWORM]:       'SoilTransmittedHelmithiasisWhipworm',
  [DISEASE_STH_HOOKWORM]:       'SoilTransmittedHelmithiasisHookworm',
  [DISEASE_SCH_MANSONI]:       'SchistosomiasisMansoni',

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
  },

  [DISEASE_TRACHOMA]: {
    historicStartYear: 2010,
    historicEndYear: 2019,
    interventionStartYear: 2020,
    startYear: 2015,
    endYear: 2031,
    defaultMetric: 'Ms',
    numberOfYears: 11 * 2,
    startMonth: 240,
    offsetBarWidthDivider: 1,
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
  }

};

const CLOUD_INFO = {
  cloud_storage_path_root: 'https://storage.googleapis.com/ntd-disease-simulator-data'
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
  CLOUD_INFO,

  NO_DATA
};

export default AppConstants;

