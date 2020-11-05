import { DISEASE_LIMF, DISEASE_TRACHOMA, DISEASE_STH_ROUNDWORM } from 'AppConstants';
import LFModel from 'pages/components/simulator/models/lf';
import TrachomaModel from 'pages/components/simulator/models/trachoma';
import STHRoundwormModel from 'pages/components/simulator/models/sth-roundworm';

export default {
  [ DISEASE_LIMF ]: LFModel,
  [ DISEASE_TRACHOMA ]: TrachomaModel,
  [ DISEASE_STH_ROUNDWORM ]: STHRoundwormModel
};

