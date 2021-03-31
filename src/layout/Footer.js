import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LanguageSwitch from '../pages/components/LanguageSwitch'
import { useTranslation } from "react-i18next";


const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 'auto',
  },
  footer: {
    marginTop: 'auto',
    backgroundColor: theme.palette.text.primary,
    color: theme.palette.basic.white,
  },
  container: {
    padding: theme.spacing(4, 6, 8, 6),
  },
  column: {
    padding: theme.spacing(2, 2, 2, 0),
  },
  menu: {
    display: 'block',
    listStyleType: 'none',
    padding: 0,
    margin: 0
  },
  headline: {
    color: theme.palette.basic.white,
    margin: theme.spacing(0, 0, 3, 0),
  },
  copy: {
    color: theme.palette.basic.white,
    margin: theme.spacing(3, 0, 0, 0),
  },
  logo: {
    width: 83,
    height: 'auto',
    marginRight: theme.spacing(2),
  }
}));

const Footer = (props) => {
  const { t } = useTranslation();

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <footer className={classes.footer}>
        <Container className={classes.container} maxWidth="xl" >

          <Grid container spacing={0}>

            <Grid item xs={12} className={classes.column}>
              <LanguageSwitch current={undefined} />
            </Grid>

            <Grid item md={3} sm={6} xs={12} className={classes.column}>
              <Typography variant="h6" component="h6" className={classes.headline} >{t('Connect')}</Typography>

              <Typography display="block" variant="body2"><Link href="https://twitter.com/NtdModelling" rel="noopener" target="_blank" color="inherit" variant="body2">Twitter</Link></Typography>
              <ul className={classes.menu}>
                <Typography component="li" variant="body2">
                  <Link href="https://www.ntdmodelling.org/" rel="noopener" target="_blank" color="inherit" variant="body2">{t('NTDConsortiumWebsite')}</Link>
                </Typography>
              </ul>

            </Grid>

            <Grid item md={3} sm={6} xs={12} className={classes.column}>

              <Typography variant="h6" component="h6" className={classes.headline} >{t('About')}</Typography>

              <ul className={classes.menu}>
                <Typography component="li" variant="body2">
                  <Link component={RouterLink} to="/about" color="inherit">{t('AboutTheSimulator')}</Link>
                </Typography>
                <Typography component="li" variant="body2">
                  <Link component={RouterLink} to="/about-ntd-modelling-consortium" color="inherit">{t('AboutTheNTD')}</Link>
                </Typography>
                <Typography component="li" variant="body2">
                  <Link component={RouterLink} to="/help-us-improve" color="inherit">{t('helpUsImprove')}</Link>
                </Typography>
                <Typography component="li" variant="body2">
                  <Link component={RouterLink} to="/privacy-cookies" color="inherit">{t('PrivacyCookies')}</Link>
                </Typography>
              </ul>

            </Grid>

            <Grid item md={6} sm={12} xs={12} className={classes.column}>

              <Typography variant="h6" component="h6" className={classes.headline} >{t('NTDS')}</Typography>

              <ul className={classes.menu}>
                <Typography component="li" variant="body2">
                  <Link component={RouterLink} to="/disease/lf" color="inherit">{t('LymphaticFilariasis')}</Link>
                </Typography>
                <Typography component="li" variant="body2">
                  <Link component={RouterLink} to="/disease/sch-mansoni" color="inherit">{t('SchistosomiasisMansoni')}</Link>
                </Typography>
                <Typography component="li" variant="body2">
                  <Link component={RouterLink} to="/disease/sth-roundworm" color="inherit">{t('SoilTransmittedHelmithiasisRoundworm')}</Link>
                </Typography>
                <Typography component="li" variant="body2">
                  <Link component={RouterLink} to="/disease/sth-hookworm" color="inherit">{t('SoilTransmittedHelmithiasisHookworm')}</Link>
                </Typography>
                <Typography component="li" variant="body2">
                  <Link component={RouterLink} to="/disease/sth-whipworm" color="inherit">{t('SoilTransmittedHelmithiasisWhipworm')}</Link>
                </Typography>
                <Typography component="li" variant="body2">
                  <Link component={RouterLink} to="/disease/trachoma" color="inherit">{t('Trachoma')}</Link>
                </Typography>
              </ul>

            </Grid>

            <Grid item xs={12} className={classes.column}>

              <Typography variant="h6" component="h6" className={classes.copy} >&copy; {t('NTDConsortiumBigDataInstituteOxfordUniversity')}</Typography>
              <Typography variant="h6" component="h6" className={classes.headline} >
                {t('design')}&nbsp;
                <Link href="https://www.opencultu.re/" rel="noopener" target="_blank" color="inherit">Opencultu.re</Link>
              </Typography>

            </Grid>

          </Grid>

        </Container>
      </footer>
    </div>
  )
}
export default Footer;
