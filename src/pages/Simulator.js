import React, { useEffect } from 'react'
import { observer } from 'mobx-react'

import { useUIState } from 'hooks/stateHooks'

import { Layout } from 'layout';

import HeadWithInputs from 'pages/components/HeadWithInputs';
import SelectCountry from 'pages/components/SelectCountry';
import Country from 'pages/Country';
import Continent from 'pages/Continent';

import { IntroLF, SetupLF } from 'pages/components/diseases/lf';
import { IntroTrachoma, SetupTrachoma } from 'pages/components/diseases/trachoma';
import { IntroSTHRoundworm, SetupSTHRoundworm } from 'pages/components/diseases/sth-roundworm';
import { IntroSTHWhipworm } from 'pages/components/diseases/sth-whipworm';
import { IntroSTHHookworm } from 'pages/components/diseases/sth-hookworm';
import { IntroSCHMansoni } from 'pages/components/diseases/sch-mansoni';

import ScenarioManager from 'pages/components/simulator/ScenarioManager';
import { useTranslation } from "react-i18next";

import AppConstants from 'AppConstants';



const introComponents = {
  [ AppConstants.DISEASE_LIMF ]: IntroLF,
  [ AppConstants.DISEASE_TRACHOMA ]: IntroTrachoma,
  [ AppConstants.DISEASE_STH_ROUNDWORM ]: IntroSTHRoundworm,
  [ AppConstants.DISEASE_STH_WHIPWORM ]: IntroSTHWhipworm,
  [ AppConstants.DISEASE_STH_HOOKWORM ]: IntroSTHHookworm,
  [ AppConstants.DISEASE_SCH_MANSONI ]: IntroSCHMansoni
};

const setupComponents = {
  [ AppConstants.DISEASE_LIMF ]: SetupLF,
  [ AppConstants.DISEASE_TRACHOMA ]: SetupTrachoma,
  [ AppConstants.DISEASE_STH_ROUNDWORM ]: SetupSTHRoundworm,
  [ AppConstants.DISEASE_STH_WHIPWORM ]: SetupSTHRoundworm,
  [ AppConstants.DISEASE_STH_HOOKWORM ]: SetupSTHRoundworm,
  [ AppConstants.DISEASE_SCH_MANSONI ]: SetupSTHRoundworm,
};

const Simulator = (props) => {

  useEffect(() => {
    // console.log( "Simulator mounting" );
  }, []);

  const { disease, country, implementationUnit, section } = useUIState();

  const IntroComponent = (disease !== null) ? introComponents[disease] : null;
  const SetupComponent = (disease !== null) ? setupComponents[disease] : null;

  const { t } = useTranslation();

  return (

    <Layout>

      <HeadWithInputs title={t('prevalenceSimulator')} />

      <SelectCountry
        selectIU={country ? true : false}
        showCountryConfirmation={country && implementationUnit ? true : false}
        countyAndIUSet={country && implementationUnit}
        showIUConfirmation={country && implementationUnit && section ? true : false}
        showBackToCountry={disease && country && implementationUnit ? true : false}
        showBackToContinent={disease && country && !implementationUnit ? true : false}
      />

    { disease && (!country) && (!implementationUnit) && <Continent />}

      { disease && country && (!implementationUnit) && <Country />}

      { disease && country && implementationUnit && (!section) && <SetupComponent disease={disease} />}

      { disease && country && implementationUnit && section && <ScenarioManager />}

      { disease && <IntroComponent />}

    </Layout>

  );
}

export default observer(Simulator);
