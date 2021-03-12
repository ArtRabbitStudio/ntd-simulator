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
import AccordionElement from 'pages/components/AccordionElement';
import SelectDisease from 'pages/components/SelectDisease';

import { useTranslation } from "react-i18next";

import Logo from 'images/ntd-logo.svg';
import BG from 'images/graph.png';
import BG2x from 'images/graph@2x.png';
import iMission from 'images/graph-copy.png';
import iHowIW from 'images/graph-copy-2.png';

const useStyles = makeStyles(theme => ({
  langToggle: {
    position: "fixed",
    backgroundColor: theme.palette.secondary.light,
    top: "1rem",
    right: "1rem",
    zIndex: "10",
    padding: "0.5rem 1rem",
  },
  section: {
    position: "relative",
    backgroundColor: theme.palette.secondary.light,
    width: `calc(100% + ${theme.spacing(12)}px)`,
    marginLeft: -theme.spacing(6),
    padding: theme.spacing(4, 6),
  },
  selectDisease: {
    position: "relative",
    padding: theme.spacing(4, 0),
    margin: theme.spacing(0, 0, 0, 0),
    top: theme.spacing(-10),
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
  marginTop: {
    marginTop: theme.spacing(6)
  },
  textBlocks: {
    position: "relative",
    backgroundColor: theme.palette.secondary.dark,
    display: 'inline-block',
    marginBottom: 20
  },
  textBlock: {
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: theme.palette.secondary.dark,
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
  white: {
    backgroundColor: '#ffffff'
  },
  cardTransparent: {
    opacity: 0.85
  },
}));


const Home = (props) => {

  const classes = useStyles();
  const { disease: currentDisease, setImplementationUnit, setCountry, setDisease } = useUIState()

  useEffect(() => {
    setImplementationUnit(null);
    setCountry(null);
    setDisease(null);
  }, [currentDisease, setDisease, setCountry, setImplementationUnit])

  const { t, i18n } = useTranslation();
  function handleClick(lang) {
    i18n.changeLanguage(lang);
  }

  return (
    <Layout className={classes.homeimage} /* classAdd="full-height"*/ >
      { /*
      <Head classAdd={classes.cardTransparent}
        title={t('appTitle')}
        intro={t('appDesc')}
      />

      {i18n.language==="en" ?
      <button onClick={()=>handleClick("de")} className={classes.langToggle}>German</button> : <button onClick={()=>handleClick("en")} className={classes.langToggle}>English</button>
      }

      */ }

      <HeadWithInputs disableInputs={true} title={t('appTitle')} intro={t('appDesc')} showLanguages={true} classAdd={classes.cardTransparent} />

      <section className={`${classes.selectDisease}`}>
        <SelectDisease />
      </section>

      <WhatYouCanDo />


      <TextWithImage
        caption="Our mission"
        headline="Closing the knowledge gap"
        image={iMission}
        imageAlt="Our mission"
        buttonUrl="/data-and-methodolgy"
        buttonText="Here is how"
      >
        <Typography paragraph variant="body1" component="p">
          Many urgent policy issues concering the contorl and elimination of negelcted tropical diseases (NTDs) can be informed by high-quality
          quantitative modelling. A …. of modelling in this area prevents donors and poclymakers from accessing existing expertise.
        </Typography>
        <Typography paragraph variant="body1" component="p">
          We want to help close this knowledge gap.
        </Typography>
      </TextWithImage>

      <TextWithImage
        caption="How it works"
        headline="Model-based projections"
        image={iHowIW}
        imageAlt="How it works"
      >
        <Typography paragraph variant="body1" component="p">
          The projections on this website provide guidance on the impact of more frequent, longer or higher coverage treatment strategies on achiving 2030 WHO goals.
          The projections are model based.
        </Typography>
        <Typography paragraph variant="body1" component="p">
          Please note that te models used have only been validated against a certain number of settings.
          A full description of each model used can be found on the disease pages.
        </Typography>
      </TextWithImage>

      <DiseasesList />


      <section className={`${classes.section} ${classes.cardTransparent}`}>

        <Typography variant="h3" component="h6" className={`${classes.headline} ${classes.marginBottom}`}>{t('beforeStart')}</Typography>
        <AccordionElement title={t('howItWorksTitle')}>
          {t('howItWorks')}
        </AccordionElement>

        <AccordionElement title={t('ourMissionTitle')}>
          {t('ourMission')}
        </AccordionElement>

        <AccordionElement title={t('whatYouCanDoTitle')}>
          {t('whatYouCanDo')}
        </AccordionElement>


        <Typography variant="h3" component="h6" className={`${classes.headline} ${classes.marginBottom} ${classes.marginTop}`}>{t('behindThis')}</Typography>

        <div className={` ${classes.textBlocks} ${classes.white}`}>
          <div className={`${classes.textBlock} ${classes.white}`}>
            <TextContents>
              <Typography paragraph variant="body1" component="p">
                {t('theNTD1')} <Link underline="always" color="inherit" href="https://www.ntdmodelling.org/">NTD Modelling Consortium</Link>{t('theNTD2')}
              </Typography>
              <a href="https://www.ntdmodelling.org/"><img src={Logo} border="0" alt="NTD Modelling Consortium" /></a>
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
