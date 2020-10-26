import React from 'react'
import AccordionElement from 'pages/components/AccordionElement';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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
}));


export default function Intro(props) {
  const classes = useStyles();
  return (

    <section className={classes.section}>
    <Typography variant="h3" component="h6" className={`${classes.headline} ${classes.marginBottom}`}>{`About projections for ${DISEASE_LABELS['trachoma']}`}</Typography>


    {/*<AccordionElement title="Data">
        Short introduction to Trachoma specfic data
  </AccordionElement>*/}

    <AccordionElement title="Model and Methodology">
    The model is based on the modified SEIR framework for C. trachomatis transmission described by Pinsent and colleagues (<a href="https://journals.plos.org/plosntds/article?id=10.1371/journal.pntd.0006531"  rel="noopener noreferrer">Pinsent A & Hollingsworth TD (2018)
    </a>). Of particular significance, this model structure accounts for TF persisting after clearance of C. trachomatis, with people transitioning through four sequential states: Susceptible (S), infected but not yet diseased (I), infected and diseased (ID) or diseased but no longer infected (D). Here disease refers to clinical trachoma, specifically TF. The original ODE model has been adapted to a fully stochastic individual-based model with age and infection/disease status of individuals explicitly incorporated . Following the specifications of the original model, bacterial load and duration of infection and disease are assumed to decrease with each subsequent infection.
    </AccordionElement>


   
    </section>

  )
}
