import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
//import { useDataAPI, useUIState } from '../hooks/stateHooks'

import { Layout } from '../layout';
import { makeStyles } from '@material-ui/core/styles';

import HeadWithInputs from './components/HeadWithInputs';
import TextContents from './components/TextContents';
import SelectCountry from './components/SelectCountry';

const useStyles = makeStyles(theme => ({
    section: {
        position: "relative",
        backgroundColor: theme.palette.secondary.light,
        width: `calc(100% + ${theme.spacing(12)}px)`,
        marginLeft: -theme.spacing(6),
        padding: theme.spacing(4, 6),
      },
    charts: {
        position: "relative",
        backgroundColor: theme.palette.secondary.dark,
        display: 'inline-block',
        marginBottom: 20
      },
    chart: {
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

//const selected = countrySuggestions.find(x => x.id === country)

const Home = (props) => {

    const classes = useStyles();
    const history = useHistory();


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

                <div className={classes.charts}>
                    <div className={classes.chart}>
                        <Typography variant="h6" component="h6" className={classes.headline} >Mission</Typography>
                        <Typography paragraph variant="body1" component="p">Many urgent policy issues concerning the control and elimination of neglected tropical diseases (NTDs) can only be answered through high-quality quantitative modelling. However, a dearth of modelling in this area prevents donors and policymakers from accessing existing expertise. We hope that our NTD Simulator can help close this knowledge gap.</Typography>
                    </div>
                    <div className={classes.chart}>
                        <Typography variant="h6" component="h6" className={classes.headline} >How it works</Typography>
                        <Typography paragraph variant="body1" component="p">The projections on this website provide guidance on the impact of more frequent, longer or higher coverage treatment strategies on achieving elimination as a public health problem. Please note that the model has only been validated against a certain number of settings, details of which can be found in <a href="https://parasitesandvectors.biomedcentral.com/articles/10.1186/s13071-015-1152-3">this paper.</a> A full model description can be found in the About section.</Typography>
                    </div>
                </div>
                <TextContents>
                <Typography variant="h3" component="h6" className={classes.headline}>
                Partners
                </Typography>
                <Typography paragraph variant="body1" component="p">
                    Espen (data from / in collaboration with)
                </Typography>
                <Typography paragraph variant="body1" component="p">
                    NTD Modelling Consortium (role?)
                </Typography>
                <Typography paragraph variant="body1" component="p">
                    Funders? Others?
                </Typography>
                </TextContents>
            </section>

        </Layout >
    )
}
export default Home;
