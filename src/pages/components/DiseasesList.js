import React from 'react';
import { Grid, Container, Typography } from '@material-ui/core';
import CapsHeadline from './CapsHeadline'
import FullWidthBackground from './FullWidthBackground'
import { withStyles } from '@material-ui/core/styles';

import { DISEASE_LABELS } from 'AppConstants'

import ico1 from 'images/lf-icon.svg';
import ico2 from 'images/sch-mansoni-icon.svg';
import ico3 from 'images/trachoma-icon.svg';
import ico4 from 'images/sth-whipworm-icon.svg';
import ico5 from 'images/sth-roundworm-icon.svg';
import ico6 from 'images/sth-hookworm-icon.svg';

const styles = theme => ({
  root: {
    clear: 'both',
    padding: theme.spacing(4, 0),
  },
  column: {
    padding: theme.spacing(20, 0, 6, 0),
    textAlign: "center",
    backgroundColor: 'transparent',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center 40px',
    textDecoration: "none",
    color: "#303e4f", //theme.palette.primary.main,
    //backgroundSize: '70% auto'
    '& p': {
      maxWidth: 243,
      margin: "auto",
    },
    '&.icon-lf': {
      backgroundImage: `url(${ico1})`,
    },
    '&.icon-trachoma': {
      backgroundImage: `url(${ico3})`,
    },
    '&.icon-sth-roundworm': {
      backgroundImage: `url(${ico5})`,
    },
    '&.icon-sth-whipworm': {
      backgroundImage: `url(${ico4})`,
    },
    '&.icon-sch-mansoni': {
      backgroundImage: `url(${ico2})`,
    },
    '&.icon-sth-hookworm': {
      backgroundImage: `url(${ico6})`,
    }
  },
  grid: {
    backgroundColor: theme.palette.secondary.light,
  },

  headline: {
    display: 'block',
    margin: theme.spacing(4, 0, 1, 0),
  },
});

const DiseasesList = (props) => {

  const { classes, theme } = props

  //const classes = useStyles();

  return (
    <Container className={classes.root} maxWidth="xl" >

      <CapsHeadline text="Diseases" />

      <FullWidthBackground color={theme.palette.secondary.light}>
        <Grid container spacing={0} className={classes.grid}>

          {
            Object.keys(DISEASE_LABELS).map(function (ident) {
              return (
                <Grid key={ident} component="a" href={`/${ident}`} item md={4} sm={4} xs={12} className={`${classes.column} icon-${ident}`}>
                  <Typography variant="body1" component="p" className={classes.headline} >{DISEASE_LABELS[ident]}</Typography>
                </Grid>
              )
            })
          }

        </Grid>
      </FullWidthBackground>
    </Container >
  );
}

export default withStyles(styles, { withTheme: true })(DiseasesList);