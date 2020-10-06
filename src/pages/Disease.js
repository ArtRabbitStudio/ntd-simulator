import React, { useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { observer } from 'mobx-react'
import { useRouteMatch,useHistory } from 'react-router-dom'

import { useDataAPI, useUIState } from 'hooks/stateHooks'
import AccordionElement from 'pages/components/AccordionElement';

import { Layout } from 'layout';
import { makeStyles } from '@material-ui/core/styles';

import HeadWithInputs from 'pages/components/HeadWithInputs';
import TextContents from 'pages/components/TextContents';
import SelectCountry from 'pages/components/SelectCountry';
import {
  DISEASE_LABELS
} from 'AppConstants'

const useStyles = makeStyles(theme => ({
  section: {
    position: "relative",
    backgroundColor: theme.palette.secondary.light,
    width: `calc(100% + ${theme.spacing(12)}px)`,
    marginLeft: -theme.spacing(6),
    padding: theme.spacing(4, 6),
  },
  marginBottom: {
    marginBottom: theme.spacing(2)
  },
  marginTop: {
    marginTop: theme.spacing(6)
  },
  textBlocks: {
    position: "relative",
    backgroundColor: theme.palette.secondary.dark,
    display: 'inline-block',
    marginBottom: 20
  },
  textBlock: {
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
    backgroundColor: theme.palette.secondary.dark,
    [theme.breakpoints.up("md")]: {
      textAlign: "left",
      float: "left",
      width: "calc(50% - 16px)",
      "&.fullwidth": {
        width: "100%",
        textAlign: "left",
      },
    },
  },
}));


const Disease = (props) => {

  const classes = useStyles();
  const { country: currentCountry, disease, setImplementationUnit, setCountry } = useUIState()
  const { diseases } = useDataAPI()
  const matchTop = useRouteMatch('/:section')
  const history = useHistory()

  // only show this page if it is an actual disease
  if ( !diseases.includes(matchTop.params.section) ) {
    history.replace(`/`)
  }

  useEffect(() => {
    setImplementationUnit(null);
    setCountry(null);
  }, [currentCountry, setCountry, setImplementationUnit, disease])



  return (
    <Layout /* classAdd="full-height"*/ >
      <HeadWithInputs
        title="prevalence simulator"
      />



      <TextContents>
        <Typography paragraph variant="body1" component="p">Select a country to simulate outcome scenarios</Typography>
      </TextContents>
      <SelectCountry />

      <section className={classes.section}>
        <Typography variant="h3" component="h6" className={`${classes.headline} ${classes.marginBottom}`}>{`About projections for ${DISEASE_LABELS[disease]}`}</Typography>


        <AccordionElement title="Data">
            Short introduction to disease specfic data
        </AccordionElement>

        <AccordionElement title="Model and Methodology">
            Short introduction to disease specfic model
        </AccordionElement>


       
      </section>

    </Layout >
  )
}
export default observer(Disease);
