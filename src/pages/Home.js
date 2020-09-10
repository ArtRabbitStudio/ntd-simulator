import React, { useEffect } from 'react';
import { Typography, Link } from '@material-ui/core';
import { useUIState } from '../hooks/stateHooks'

import { Layout } from '../layout';
import { makeStyles } from '@material-ui/core/styles';

import HeadWithInputs from './components/HeadWithInputs';
import TextContents from './components/TextContents';
import SelectCountry from './components/SelectCountry';
import Logo from '../images/ntd-logo.svg';

const useStyles = makeStyles(theme => ({
  section: {
    position: "relative",
    backgroundColor: theme.palette.secondary.light,
    width: `calc(100% + ${theme.spacing(12)}px)`,
    marginLeft: -theme.spacing(6),
    padding: theme.spacing(4, 6),
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
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
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
}));


const Home = (props) => {

  const classes = useStyles();
  const { country: currentCountry, setImplementationUnit, setCountry } = useUIState()


  useEffect(() => {
    setImplementationUnit(null);
    setCountry(null);
  }, [currentCountry, setCountry, setImplementationUnit])



  return (
    <Layout /* classAdd="full-height"*/ >
      <HeadWithInputs
        title="prevalence simulator"
      />



      <TextContents>
        <Typography paragraph variant="body1" component="p">Select a country to simulate outcome scenarios</Typography>
      </TextContents>
      <SelectCountry />

      <section className={classes.section}>
        <Typography variant="h3" component="h6" className={classes.headline}>
          Before you start
                </Typography>
        <TextContents>
          <Typography paragraph variant="body1" component="p">

          </Typography>
        </TextContents>


        <div className={classes.textBlocks}>

          <div className={classes.textBlock}>
            <Typography variant="h6" component="h6" className={classes.headline} >How it works</Typography>
            <Typography paragraph variant="body1" component="p">The projections on this website provide guidance on the impact of more frequent, longer or higher coverage treatment strategies on achieving elimination as a public health problem. Please note that the model has only been validated against a certain number of settings, details of which can be found in <a href="https://parasitesandvectors.biomedcentral.com/articles/10.1186/s13071-015-1152-3">this paper.</a> A full model description can be found in the About section.</Typography>
          </div>
          <div className={classes.textBlock}>
            <Typography variant="h6" component="h6" className={classes.headline} >Mission</Typography>
            <Typography paragraph variant="body1" component="p">
              Many urgent policy issues concerning the control and elimination of neglected tropical diseases (NTDs) can be informed by  high-quality quantitative modelling. However, a dearth of modelling in this area prevents donors and policymakers from accessing existing expertise. We hope that our NTD Simulator can help close this knowledge gap.
                        </Typography>
          </div>
        </div>
        <div className={classes.textBlocks}>
          <div className={classes.textBlock}>
            <Typography variant="h6" component="h6" className={classes.headline} >Programme Managers</Typography>
            <Typography paragraph variant="body1" component="p">This website allows you to investigate the potential impact of delays to MDAs due to COVID19. It  contains estimates of the current prevalence of lymphatic filariasis in endemic implementation units, and estimates of the impact of different interruptions to the programme. This interface will allow you to adapt the mathematical modelling to your local knowledge and provide you with the analyses you need to prioritise where MDA needs to be reinstated.</Typography>
          </div>

          <div className={classes.textBlock}>
            <Typography variant="h6" component="h6" className={classes.headline} >Implementation Partners</Typography>
            <Typography paragraph variant="body1" component="p">This website allows you to investigate the potential impact of delays to MDAs due to COVID19. It  contains estimates of the current prevalence of lymphatic filariasis in endemic implementation units, and estimates of the impact of different interruptions to the programme. This interface will allow you to support country programme managers in prioritising the areas where MDA need to be prioritised.</Typography>
          </div>


        </div>

        <div className={classes.textBlocks}>
          <div className={classes.textBlock}>
            <TextContents>
              <Typography variant="h6" component="h6" className={classes.headline} >
                Partners
                            </Typography>
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
