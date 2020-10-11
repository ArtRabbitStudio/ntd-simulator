import { DISEASE_LIMF, DISEASE_TRACHOMA } from 'AppConstants';
import LFModel from 'pages/components/simulator/models/lf';
import TrachomaModel from 'pages/components/simulator/models/trachoma';

export default {
  [ DISEASE_LIMF ]: LFModel,
  [ DISEASE_TRACHOMA ]: TrachomaModel
};

