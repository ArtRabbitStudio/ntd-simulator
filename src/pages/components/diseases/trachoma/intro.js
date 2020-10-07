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


    <AccordionElement title="Data">
        Short introduction to Trachoma specfic data
    </AccordionElement>

    <AccordionElement title="Model and Methodology">
        Short introduction to Trachoma specfic model
    </AccordionElement>


   
    </section>

  )
}
