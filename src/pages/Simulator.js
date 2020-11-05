import React, { useEffect } from 'react'
import { observer } from 'mobx-react'

import { useUIState } from 'hooks/stateHooks'

import { Layout } from 'layout';

import HeadWithInputs from 'pages/components/HeadWithInputs';
import SelectCountry from 'pages/components/SelectCountry';
import Country from 'pages/Country';

import { IntroLF, SetupLF } from 'pages/components/diseases/lf';
import { IntroTrachoma, SetupTrachoma } from 'pages/components/diseases/trachoma';
import { IntroSTHRoundworm  , SetupSTHRoundworm } from 'pages/components/diseases/sth-roundworm';

import ScenarioManager from 'pages/components/simulator/ScenarioManager';



const introComponents = {
  lf: IntroLF,
  trachoma: IntroTrachoma,
  'sth-roundworm': IntroSTHRoundworm
};

const setupComponents = {
  lf: SetupLF,
  trachoma: SetupTrachoma,
  'sth-roundworm': SetupSTHRoundworm
};

const Simulator = ( props ) => {

  useEffect( () => {
    // console.log( "Simulator mounting" );
  }, [] );

  const { disease, country, implementationUnit, section } = useUIState();

  const IntroComponent = ( disease !== null ) ? introComponents[ disease ] : null;
  const SetupComponent = ( disease !== null ) ? setupComponents[ disease ] : null;

  return (

    <Layout>

      <HeadWithInputs title="prevalence simulator" />
    
      <SelectCountry
        selectIU={ country ? true : false }
        showCountryConfirmation={ country && implementationUnit ? true : false }
        showIUConfirmation={ country && implementationUnit && section ? true : false }
        showBack={ disease && country && implementationUnit ? true : false }
      />

      { disease && ( !country ) && <IntroComponent/> }

      { disease && country && ( !implementationUnit ) && <Country/> }

      { disease && country && implementationUnit && ( !section ) && <SetupComponent disease={disease} /> }

      { disease && country && implementationUnit && section && <ScenarioManager/> }

    </Layout>

  );
}

export default observer( Simulator );
