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
                <Typography paragraph variant="body1" component="p">Intro compy, how does it work who’s behind it, link to paper etc</Typography>
                <Typography paragraph variant="body1" component="p">Select a country to get started</Typography>
            </TextContents>

            <SelectCountry />


        </Layout >
    )
}
export default Home;
