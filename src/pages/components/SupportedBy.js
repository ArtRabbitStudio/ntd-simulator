import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Container } from '@material-ui/core';
import CapsHeadline from './CapsHeadline'
import FullWidthBackground from './FullWidthBackground'

import logo1 from 'images/logo_ntd.png';
import logo2 from 'images/logo_oxford.png';
import logo3 from 'images/logo_gates.png';

const styles = theme => ({
  root: {
    clear: 'both',
    padding: theme.spacing(4, 0),
  },
  grid: {
    padding: theme.spacing(4, 0),
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    '& figure': {
      maxWidth: 243,
      alignSelf: "stretch",
      background: theme.palette.basic.white,
      padding: theme.spacing(2),
      display: "flex",
      alignItems: "center",
    },
    '& img': {
      maxWidth: "100%",
      height: "auto"
    }
  },

  headline: {
  },
});

const SupportedBy = (props) => {

  const { classes, theme } = props

  return (
    <Container className={classes.root} maxWidth="xl" >

      <CapsHeadline text="This project is faciliated and supported by" />

      <FullWidthBackground color={theme.palette.secondary.light}>
        <Grid container spacing={0} className={classes.grid}>

          <figure><img src={logo1} alt="NTD Modelling consortium" /></figure>
          <figure><img src={logo2} alt="BIG DATA Institute Oxford" /></figure>
          <figure><img src={logo3} alt="Bill&amp;Melinda Gates foundation" /></figure>

        </Grid>
      </FullWidthBackground>
    </Container>
  );
}

export default withStyles(styles, { withTheme: true })(SupportedBy);