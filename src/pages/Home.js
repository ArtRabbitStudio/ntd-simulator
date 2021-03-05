import React, { useEffect } from 'react';
import { Typography, Link } from '@material-ui/core';
import { useUIState } from 'hooks/stateHooks'

import { Layout } from 'layout';
import { makeStyles } from '@material-ui/core/styles';

import Head from 'pages/components/Head';
import TextContents from 'pages/components/TextContents';
import AccordionElement from 'pages/components/AccordionElement';
import SelectDisease from 'pages/components/SelectDisease';
import Logo from 'images/ntd-logo.svg';
import BG from 'images/africa.jpg';
import { useTranslation } from "react-i18next";

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
  marginBottom: {
    marginBottom: theme.spacing(2)
  },
  "@global": {
		body: {
      backgroundColor:'white',
      backgroundImage: `url(${BG})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right top',
      backgroundSize: '70% auto'

    }},
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
      {i18n.language==="en" ?
      <button onClick={()=>handleClick("de")} className={classes.langToggle}>German</button> : <button onClick={()=>handleClick("en")} className={classes.langToggle}>English</button>
      }
      <Head classAdd={classes.cardTransparent}
        title={t('appTitle')}
        intro={t('appDesc')}
        //intro="The projections on this website provide guidance on the impact of more frequent, longer or higher coverage treatment strategies on achieving 2030 goals"
      />



      <SelectDisease />

      <section className={`${classes.section} ${classes.cardTransparent}`}>
        <Typography variant="h3" component="h6" className={`${classes.headline} ${classes.marginBottom}`}>Before you start</Typography>
        <AccordionElement title="How it works">
        The projections on this website provide guidance on the
        impact of more frequent, longer or higher coverage treatment
        strategies on achieving 2030 goals.
        The projections are model based. Please note that the models used have only been validated against a certain number of settings.
        A full description of the models can be found in the About section.
        </AccordionElement>

        <AccordionElement title="Our mission">
        Many urgent policy issues concerning the control and elimination of neglected tropical diseases (NTDs) can be informed by  high-quality quantitative modelling. However, a dearth of modelling in this area prevents donors and policymakers from accessing existing expertise. We hope that our NTD Simulator can help close this knowledge gap.
        </AccordionElement>

        <AccordionElement title="What you can do">
        This website is for Programme Managers and Implementation Partners and allows you to investigate the potential impact of delays to MDAs due to COVID19 (or other scenarios). It contains estimates of the current prevalence in endemic implementation units, and estimates of the impact of different interruptions to the programme. This interface will allow you to adapt the mathematical modelling to your local knowledge and provide you with the analyses you need to prioritise where MDA needs to be reinstated.
        </AccordionElement>


        <Typography variant="h3" component="h6" className={`${classes.headline} ${classes.marginBottom} ${classes.marginTop}`}>Who's behind this?</Typography>

        <div className={` ${classes.textBlocks} ${classes.white}`}>
          <div className={`${classes.textBlock} ${classes.white}`}>
            <TextContents>
                            <Typography paragraph variant="body1" component="p">
                                The NTD Simulator was designed and built in collaboration with the <Link underline="always" color="inherit" href="https://www.ntdmodelling.org/">NTD Modelling Consortium</Link>, an international network of infectious disease modellers focussing on neglected tropical diseases.
                            </Typography>
                            <a href="https://www.ntdmodelling.org/"><img src={Logo} border="0" alt="NTD Modelling Consortium" /></a>
                            <Typography paragraph variant="body1" component="p">
                                The work of the NTD Modelling Consortium is supported by the Bill and Melinda Gates Foundation.
                            </Typography>

            </TextContents>
          </div>
        </div>
      </section>
    </Layout >
  )
}
export default Home;
