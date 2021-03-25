import React, { useEffect } from 'react';
import { Typography, Link } from '@material-ui/core';
import { useUIState } from 'hooks/stateHooks'

import { Layout } from 'layout';
import { makeStyles } from '@material-ui/core/styles';

//import Head from 'pages/components/Head';
import HeadWithInputs from 'pages/components/HeadWithInputs';
import WhatYouCanDo from 'pages/components/WhatYouCanDo';
import DiseasesList from 'pages/components/DiseasesList';

import TextWithImage from 'pages/components/TextWithImage';
import TextContents from 'pages/components/TextContents';
import SelectDisease from 'pages/components/SelectDisease';
//import SupportedBy from 'pages/components/SupportedBy';
import CapsHeadline from 'pages/components/CapsHeadline'

import { useTranslation } from "react-i18next";

import Logo from 'images/ntd-logo.svg';
import BG from 'images/graph.png';
import BG2x from 'images/graph@2x.png';
import iMission from 'images/graph-copy.png';
import iHowIW from 'images/graph-copy-2.png';

const useStyles = makeStyles(theme => ({
  section: {
    position: "relative",
    width: `calc(100% + ${theme.spacing(12)}px)`,
    marginLeft: -theme.spacing(6),
    padding: theme.spacing(4, 6),
    marginTop: theme.spacing(2)
  },
  selectDisease: {
    position: "relative",
    padding: theme.spacing(4, 0),
    margin: theme.spacing(0, 0, 0, 0),
    backgroundColor: 'white',
    backgroundImage: `url(${BG})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right center',
    backgroundSize: 'contain',
    minHeight: "40vh",
    display: "flex",
    width: "100%",
    alignItems: "center",
    [theme.breakpoints.up('lg')]: {
      backgroundImage: `url(${BG2x})`,
      top: theme.spacing(0),
    },
    [theme.breakpoints.up('sm')]: {

    },
  },
  marginBottom: {
    marginBottom: theme.spacing(2)
  },
  "@global": {
    body: {
      //backgroundColor: 'white',
      //backgroundImage: `url(${BG})`,
      //backgroundRepeat: 'no-repeat',
      //backgroundPosition: 'right top',
      //backgroundSize: '70% auto'

    }
  },
  supportImage: {
    marginBottom: theme.spacing(1)
  },
  marginTop: {
    marginTop: theme.spacing(6)
  },
  textBlocks: {
    position: "relative",
    display: 'inline-block',
    marginBottom: 20,
    marginTop: 20

  },
  textBlock: {
    [theme.breakpoints.up("md")]: {
      textAlign: "left",
      float: "left",
      width: "calc(50% - 16px)",
      "&.fullwidth": {
        width: "100%",
        textAlign: "left",
      },
    },
  },
  cardTransparent: {
    opacity: 0.85
  },
  headline: {
    margin: theme.spacing(1, 0),
  }
}));


const Home = (props) => {

  const classes = useStyles();
  const { disease: currentDisease, setImplementationUnit, setCountry, setDisease } = useUIState()

  useEffect(() => {
    setImplementationUnit(null);
    setCountry(null);
    setDisease(null);
  }, [currentDisease, setDisease, setCountry, setImplementationUnit])

  const { t } = useTranslation();



  return (
    <Layout className={classes.homeimage} /* classAdd="full-height"*/ >

      { /*
      <Head classAdd={classes.cardTransparent}
        title={t('appTitle')}
        intro={t('appDesc')}
      />
             
   

      */ }

      <HeadWithInputs disableInputs={true} title={t('appTitle')} intro={t('appDesc')} showLanguages={true} classAdd={classes.cardTransparent} />

      <section className={`${classes.selectDisease}`}>
        <SelectDisease />
      </section>

      <WhatYouCanDo />


      <TextWithImage
        caption={t('ourMissionTitle')}
        headline={t('ourMissionHeadline')}
        image={iMission}
        imageAlt={t('ourMissionTitle')}
        buttonUrl="/data-and-methodolgy"
        buttonText={t('hereIsHow')}
      >
        <Typography paragraph variant="body1" component="p">{`${t('ourMission')}`}</Typography>
        <Typography paragraph variant="body1" component="p">{t('ourMissionStatement')}</Typography>
      </TextWithImage>

      <TextWithImage
        caption={t('howItWorksTitle')}
        headline={t('howItWorksHeadline')}
        image={iHowIW}
        imageAlt={t('howItWorksTitle')}
      >
        <Typography paragraph variant="body1" component="p">{t('howItWorks')}</Typography>
        <Typography paragraph variant="body1" component="p">{t('howItWorksStatement')}</Typography>
      </TextWithImage>

      <DiseasesList />

      {/*<SupportedBy />*/}


      <section className={`${classes.section}`}>
        <CapsHeadline text={t('behindThis')} />
        <Typography variant="h3" component="h3" className={classes.headline}>{t('behindThisHeadline')}</Typography>

        <div className={` ${classes.textBlocks}`}>
          <div className={`${classes.textBlock}`}>
            <TextContents>
              <Typography paragraph variant="body1" component="p">
                {t('theNTD1')} <Link underline="always" color="inherit" href="https://www.ntdmodelling.org/">NTD Modelling Consortium</Link>{t('theNTD2')}
              </Typography>
              <a href="https://www.ntdmodelling.org/"><img className={` ${classes.supportImage}`} src={Logo} border="0" alt="NTD Modelling Consortium" /></a>
              <Typography paragraph variant="body1" component="p">
                {t('theWork')}
              </Typography>

            </TextContents>
          </div>
        </div>
      </section>
    </Layout >
  )
}
export default Home;
