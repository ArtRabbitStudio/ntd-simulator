import React from 'react';
import { Grid, Container, Box, Typography } from '@material-ui/core';
import CapsHeadline from './CapsHeadline'
import FullWidthBackground from './FullWidthBackground'
import { withStyles } from '@material-ui/core/styles';


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
  column4: {
    backgroundImage: `url(${ico4})`,
  },
  column5: {
    backgroundImage: `url(${ico5})`,
  },
  column6: {
    backgroundImage: `url(${ico6})`,
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
    <FullWidthBackground color={theme.palette.secondary.light}>
      <Container className={classes.root} maxWidth="xl" >

        <CapsHeadline text="Diseases" />

        <Grid container spacing={0} className={classes.grid}>

          <Grid item md={4} sm={4} xs={12} className={`${classes.column} ${classes.column1}`}>
            <Typography variant="body1" component="p" className={classes.headline} >Lymphatic Filariasis</Typography>
          </Grid>

          <Grid item md={4} sm={4} xs={12} className={`${classes.column} ${classes.column2}`}>
            <Typography variant="body1" component="p" className={classes.headline} >Schistosomiasis Mansoni</Typography>
          </Grid>

          <Grid item md={4} sm={4} xs={12} className={`${classes.column} ${classes.column3}`}>
            <Typography variant="body1" component="p" className={classes.headline} >Trachoma</Typography>
          </Grid>

          <Grid item md={4} sm={4} xs={12} className={`${classes.column} ${classes.column4}`}>
            <Typography variant="body1" component="p" className={classes.headline} >Soil-transmitted helmithiasis Whipworm</Typography>
          </Grid>

          <Grid item md={4} sm={4} xs={12} className={`${classes.column} ${classes.column5}`}>
            <Typography variant="body1" component="p" className={classes.headline} >Soil-transmitted helmithiasis Roundworm</Typography>
          </Grid>

          <Grid item md={4} sm={4} xs={12} className={`${classes.column} ${classes.column6}`}>
            <Typography variant="body1" component="p" className={classes.headline} >Soil-transmitted helmithiasis Hookworm</Typography>
          </Grid>

        </Grid>
      </Container>
    </FullWidthBackground>
  );
}

export default withStyles(styles, { withTheme: true })(DiseasesList);