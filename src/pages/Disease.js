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


const detailsCmponents = {
  lf: DetailLF,
  trachoma: DetailTrachoma,
  'sth-roundworm': DetaiRW,
  'sth-whipworm': DetailWW
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
