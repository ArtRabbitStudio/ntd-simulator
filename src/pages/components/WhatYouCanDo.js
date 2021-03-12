import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Container, Box, Typography } from '@material-ui/core';
import CapsHeadline from './CapsHeadline'
import FullWidthBackground from './FullWidthBackground'

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
    backgroundColor: theme.palette.secondary.light,
  },

  headline: {
    display: 'block',
    margin: theme.spacing(4, 0, 1, 0),
  },
});

const WhatYouCanDo = (props) => {

  const { classes, theme } = props

  return (
    <Container className={classes.root} maxWidth="xl" >

      <CapsHeadline text="What you can do" />

      <FullWidthBackground color={theme.palette.secondary.light}>
        <Grid container spacing={0} className={classes.grid}>

          <Grid item md={4} sm={4} xs={12} className={`${classes.column} ${classes.column1}`}>
            <Typography variant="h4" component="strong" className={classes.headline} >MDA delays</Typography>
            <Typography variant="body1" component="p" className={classes.description} >Investigage potential impact of delays to MDA</Typography>
          </Grid>

          <Grid item md={4} sm={4} xs={12} className={`${classes.column} ${classes.column2}`}>
            <Typography variant="h4" component="strong" className={classes.headline} >Modelling</Typography>
            <Typography variant="body1" component="p" className={classes.description} >Adapt mathematical modelling to your local knowledge</Typography>
          </Grid>

          <Grid item md={4} sm={4} xs={12} className={`${classes.column} ${classes.column3}`}>
            <Typography variant="h4" component="strong" className={classes.headline} >Scenarios</Typography>
            <Typography variant="body1" component="p" className={classes.description} >Analyse where MDA needs to be reinstated</Typography>
          </Grid>

        </Grid>
      </FullWidthBackground>
    </Container>
  );
}

export default withStyles(styles, { withTheme: true })(WhatYouCanDo);