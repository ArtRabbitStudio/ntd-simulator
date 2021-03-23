import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import { useUIState } from 'hooks/stateHooks'
import { Layout } from 'layout';
import { useParams } from "react-router-dom";

import HeadWithInputs from 'pages/components/HeadWithInputs';
import { DetailLF } from 'pages/components/diseases/lf';
import { DetailTrachoma } from 'pages/components/diseases/trachoma';
import { DetaiRW } from 'pages/components/diseases/sth-roundworm';
import { DetailWW } from 'pages/components/diseases/sth-whipworm';
import { DetaiHW } from 'pages/components/diseases/sth-hookworm';
import { DetailMansoni } from 'pages/components/diseases/sch-mansoni';

import { DISEASE_LIMF, DISEASE_TRACHOMA, DISEASE_STH_ROUNDWORM, DISEASE_STH_WHIPWORM, DISEASE_STH_HOOKWORM, DISEASE_SCH_MANSONI } from 'AppConstants'


const detailsCmponents = {
  [DISEASE_LIMF]: DetailLF,
  [DISEASE_TRACHOMA]: DetailTrachoma,
  [DISEASE_STH_ROUNDWORM]: DetaiRW,
  [DISEASE_STH_WHIPWORM]: DetailWW,
  [DISEASE_STH_HOOKWORM]: DetaiHW,
  [DISEASE_SCH_MANSONI]: DetailMansoni
};

const Disease = (props) => {

  useEffect(() => {
  }, []);
  const { disease } = useParams();

  const DetailComponent = (disease !== null) ? detailsCmponents[disease] : null;

  return (

    <Layout>

      <HeadWithInputs />

      { disease && <DetailComponent />}

    </Layout>

  );
}

export default observer(Disease);
