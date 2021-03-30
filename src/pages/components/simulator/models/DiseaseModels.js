import {
  DISEASE_LIMF,
  DISEASE_TRACHOMA,
  DISEASE_STH_ROUNDWORM,
  DISEASE_STH_WHIPWORM,
  DISEASE_STH_HOOKWORM,
  DISEASE_SCH_MANSONI
} from 'AppConstants';

import LFModel from 'pages/components/simulator/models/lf';
import CombinedModel from 'pages/components/simulator/models/combined';

export default {
  [ DISEASE_LIMF ]: LFModel,
  [ DISEASE_TRACHOMA ]: CombinedModel,
  [ DISEASE_STH_ROUNDWORM ]: CombinedModel,
  [ DISEASE_STH_WHIPWORM ]: CombinedModel,
  [ DISEASE_STH_HOOKWORM ]: CombinedModel,
  [ DISEASE_SCH_MANSONI ]: CombinedModel,
};
