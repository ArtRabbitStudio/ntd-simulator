import React from 'react';
import { Typography } from '@material-ui/core';
import { observer } from 'mobx-react'
import { useRouteMatch,useHistory } from 'react-router-dom'

import { useDataAPI, useUIState } from 'hooks/stateHooks'

import { Layout } from 'layout';

import Intro_lf from 'pages/components/diseases/lf/intro';
import Intro_trachoma from 'pages/components/diseases/trachoma/intro';

import HeadWithInputs from 'pages/components/HeadWithInputs';
import TextContents from 'pages/components/TextContents';
import SelectCountry from 'pages/components/SelectCountry';


const Disease = (props) => {

  console.log( 'constructing Disease', props.match.params.disease );

  const { disease } = useUIState()
  const { diseases } = useDataAPI()
  const matchTop = useRouteMatch('/:section')
  const history = useHistory()

  // only show this page if it is an actual disease
  if ( !diseases.includes(matchTop.params.section) ) {
    history.replace(`/`)
  }

  const infoComponents = {
    lf:       Intro_lf,
    trachoma: Intro_trachoma
  }

  const IntroComponent = disease != null ? infoComponents[disease] : React.Fragment

  return (
    <Layout /* classAdd="full-height"*/ >
      <HeadWithInputs
        title="prevalence simulator"
      />

      

      <TextContents>
        <Typography paragraph variant="body1" component="p">Select a country to simulate outcome scenarios</Typography>
      </TextContents>
      <SelectCountry />

      <IntroComponent />
    </Layout >
  )
}
export default observer(Disease);
