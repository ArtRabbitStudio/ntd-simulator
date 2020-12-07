import {
  DISEASE_LIMF,
  DISEASE_TRACHOMA,
  DISEASE_STH_ROUNDWORM,
  DISEASE_STH_WHIPWORM,
  DISEASE_STH_HOOKWORM,
  DISEASE_SCH_MANSONI
} from 'AppConstants';

import LFModel from 'pages/components/simulator/models/lf';
import TrachomaModel from 'pages/components/simulator/models/trachoma';
import STHModel from 'pages/components/simulator/models/sth'

export default {
  [ DISEASE_LIMF ]: LFModel,
  [ DISEASE_TRACHOMA ]: TrachomaModel,
  [ DISEASE_STH_ROUNDWORM ]: STHModel,
  [ DISEASE_STH_WHIPWORM ]: STHModel,
  [ DISEASE_STH_HOOKWORM ]: STHModel,
  [ DISEASE_SCH_MANSONI ]: STHModel,
};
