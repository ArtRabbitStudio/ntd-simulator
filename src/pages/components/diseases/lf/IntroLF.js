import React from 'react'
import AccordionElement from 'pages/components/AccordionElement';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  return (

    <section className={classes.section}>
    <Typography variant="h3" component="h6" className={`${classes.headline} ${classes.marginBottom}`}>{`${t('aboutProjections')} ${DISEASE_LABELS['lf']}`}</Typography>


    {/*<AccordionElement title="Data">
        Short introduction to LF specfic data
  </AccordionElement>*/}

    <AccordionElement title={t('modelAndMethodology')}>
     {t('the')}<a href="https://parasitesandvectors.biomedcentral.com/articles/10.1186/s13071-015-1152-3" target="_blank"  rel="noopener noreferrer">{t('model')}</a>{t('modelText')}
    </AccordionElement>


   
    </section>

  )
}
