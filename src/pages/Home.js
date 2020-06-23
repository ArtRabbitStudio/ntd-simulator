import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

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

    //const { countryFeatures, countryCentroids } = useDataAPI()


    return (
        <Layout classAdd="full-height" >
            <HeadWithInputs
                title="prevalence simulator"
            />

            <TextContents>
                <p>Intro compy, how does it work who’s behind it, link to paper etc</p>
                <p>Select a country to get started</p>
            </TextContents>

            <SelectCountry />


        </Layout >
    )
}
export default Home;
