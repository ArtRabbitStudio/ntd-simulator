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


export default function IntroLF(props) {
  const classes = useStyles();
  return (

    <section className={classes.section}>
    <Typography variant="h3" component="h6" className={`${classes.headline} ${classes.marginBottom}`}>{`About projections for ${DISEASE_LABELS['lf']}`}</Typography>


    {/*<AccordionElement title="Data">
        Short introduction to LF specfic data
  </AccordionElement>*/}

    <AccordionElement title="Model and Methodology">
      The <a href="https://parasitesandvectors.biomedcentral.com/articles/10.1186/s13071-015-1152-3" target="_blank"  rel="noopener noreferrer">model</a> is a stochastic micro-simulation of individuals with worm burden, microfilaraemia and other demographic parameters relating to age and risk of exposure. Humans are modelled individually, with their own male and female worm burden. The concentration of mf in the peripheral blood is modelled for each individual deterministically and increases according to the number of fertile female worms as well as decreasing at constant rate. The total mf density in the population contributes towards the current density of L3 larvae in the human-biting mosquito population, where the distribution of L3 amongst the human-biting mosquito population is completely homogeneous. An empirically derived relationship is used for the uptake of mf by a mosquito, where both Culex and Anopheles uptake curves are implemented depending on setting. The model dynamics are therefore divided into the individual human dynamics, including age and turnover; worm dynamics inside the host; microfilariae dynamics inside the host and larvae dynamics inside the mosquito.
    </AccordionElement>


   
    </section>

  )
}
