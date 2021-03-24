import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Container, Box, Typography } from '@material-ui/core';
import CapsHeadline from './CapsHeadline'
import FullWidthBackground from './FullWidthBackground'
import { useTranslation } from "react-i18next";

import ico1 from 'images/mda-delays.svg';
import ico2 from 'images/modelling.svg';
import ico3 from 'images/scenarios.svg';

const styles = theme => ({
  root: {
    clear: 'both',
    padding: theme.spacing(4, 0),
  },
  column: {
    padding: theme.spacing(14, 0, 6, 0),
    textAlign: "center",
    backgroundColor: 'transparent',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center 40px',
    //backgroundSize: '70% auto'
    '& p': {
      maxWidth: 243,
      margin: "auto",
    }
  },
  column1: {
    backgroundImage: `url(${ico1})`,
  },
  column2: {
    backgroundImage: `url(${ico2})`,
  },
  column3: {
    backgroundImage: `url(${ico3})`,
  },
  grid: {
  },

  headline: {
    display: 'block',
    margin: theme.spacing(4, 0, 1, 0),
  },
});

const WhatYouCanDo = (props) => {
  const { t } = useTranslation();
  const { classes, theme } = props

  return (
    <Container className={classes.root} maxWidth="xl" >

      <CapsHeadline text={t('whatYouCanDoTitle')} />

      <FullWidthBackground color={theme.palette.secondary.light}>
        <Grid container spacing={0} className={classes.grid}>

          <Grid item md={4} sm={4} xs={12} className={`${classes.column} ${classes.column1}`}>
            <Typography variant="h4" component="strong" className={classes.headline} >{t('whatYouCanDoMDATitle')}</Typography>
            <Typography variant="body1" component="p" className={classes.description} >{t('whatYouCanDoMDA')}</Typography>
          </Grid>

          <Grid item md={4} sm={4} xs={12} className={`${classes.column} ${classes.column2}`}>
            <Typography variant="h4" component="strong" className={classes.headline} >{t('whatYouCanDoModellingTitle')}</Typography>
            <Typography variant="body1" component="p" className={classes.description} >{t('whatYouCanDoModelling')}</Typography>
          </Grid>

          <Grid item md={4} sm={4} xs={12} className={`${classes.column} ${classes.column3}`}>
            <Typography variant="h4" component="strong" className={classes.headline} >{t('whatYouCanDoScenariosTitle')}</Typography>
            <Typography variant="body1" component="p" className={classes.description} >{t('whatYouCanDoScenarios')}</Typography>
          </Grid>

        </Grid>
      </FullWidthBackground>
    </Container>
  );
}

export default withStyles(styles, { withTheme: true })(WhatYouCanDo);