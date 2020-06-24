import React, { Fragment, useState } from 'react'
import { observer } from 'mobx-react'
import {
    Box,
    Grid,
    Typography,
    FormControl,
    FormLabel,
    MenuItem,
    Select,
    Paper,
    Slider,
    ClickAwayListener,
    Tooltip,
} from "@material-ui/core";

import { makeStyles } from '@material-ui/core/styles'
import { abbrNum } from '../utils'

import { useDataAPI, useUIState } from '../hooks/stateHooks'
import { Layout } from '../layout'
import HeadWithInputs from './components/HeadWithInputs'
import SelectCountry from './components/SelectCountry'
import TextContents from './components/TextContents'

import * as SimulatorEngine from "./components/simulator/SimulatorEngine";

const useStyles = makeStyles(theme => ({
    withSlider: {
        margin: theme.spacing(0, 0, 6, 0),
        whiteSpace: "nowrap",
    },
    settings: {
        position: "relative",
        //padding: theme.spacing(4, 4, 8, 2), 
    },
    section: {
        position: "relative",
        backgroundColor: theme.palette.secondary.light,
    },
}))

const Setup = props => {
    const classes = useStyles()
    const {
        iuFeatures,
        //stateFeaturesCurrentCountry: stateFeatures,
        //stateDataCurrentCountry: stateData,
        stateScales,
    } = useDataAPI()
    const { country } = useUIState()


    const [simParams, setSimParams] = useState({
        ...SimulatorEngine.simControler.params, // params editable via UI
    });


    const handleSliderChanges = (newValue, paramPropertyName) => {
        let newObject = {};
        newObject[paramPropertyName] = newValue;
        setSimParams({
            ...simParams,
            ...newObject,
        });
    };

    const handleCoverageChange = (event, newValue) => {
        // this used to be a special occastion. If nothing changes we can use the handleSlerChanges handler instead.
        setSimParams({
            ...simParams,
            coverage: newValue, // / 100
        });
    };
    const handleFrequencyChange = (event) => {
        //setDoseSettingsOpen(false);
        setSimParams({ ...simParams, mdaSixMonths: event.target.value });
    };

    //console.log(country);

    return (
        <Layout>
            <HeadWithInputs
                title="prevalence simulator"
            />

            <SelectCountry selectIU={true} />

            <section className={classes.section}>
                <Typography variant="h6" component="h" className={classes.headline} >Setup</Typography>
                <TextContents>
                    <p>We hold the following information for IU Name.<br />This data will be used to initialise the simulation.</p>
                </TextContents>

                <div className={classes.settings}>

                    <FormControl fullWidth>
                        <FormLabel
                            component="legend"
                            htmlFor="covN"
                            className={classes.withSlider}
                        >
                            Vector: Bed Net Coverage (%)
                </FormLabel>
                        <Slider
                            value={simParams.covN}
                            id="covN"
                            min={1}
                            step={1}
                            max={100}
                            onChange={(event, newValue) => {
                                handleSliderChanges(newValue, "covN");
                            }}
                            aria-labelledby="slider"
                            marks={[
                                { value: 0, label: "0" },
                                { value: 100, label: "100" },
                            ]}
                            valueLabelDisplay="on"
                        />
                        {/*             <p style={{ marginBottom: 0 }}>
              Bed nets are assumed to have been distributed at the start of
              intervention and are assumed to be effective for the entire
              lifetime of the intervention campaign.
            </p> */}
                    </FormControl>

                    <FormControl fullWidth className={classes.formControl}>
                        <FormLabel
                            component="legend"
                            htmlFor="coverage"
                            className={classes.withSlider}
                        >
                            Intervention target coverage
                    </FormLabel>
                        <Slider
                            value={simParams.coverage}
                            min={0}
                            step={1}
                            max={100}
                            onChange={handleCoverageChange}
                            aria-labelledby="slider"
                            marks={[
                                { value: 0, label: "0" },
                                { value: 100, label: "100" },
                            ]}
                            valueLabelDisplay="on"
                        />
                    </FormControl>


                    <FormControl
                        fullWidth
                        variant="outlined"
                        className={classes.formControl}
                    >
                        <FormLabel component="legend">Intervention frequency</FormLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={simParams.mdaSixMonths}
                            onChange={handleFrequencyChange}
                        >
                            <MenuItem value={12}>Annual</MenuItem>
                            <MenuItem value={6}>Every 6 months</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl
                        fullWidth
                        variant="outlined"
                        className={classes.formControl}
                    >
                        <FormLabel
                            component="legend"
                            htmlFor="demo-simple-select-helper-label"
                        >
                            Intervention drug regimen
                </FormLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={simParams.mdaRegimen}
                            onChange={(event) => {
                                setSimParams({
                                    ...simParams,
                                    mdaRegimen: event.target.value,
                                });
                            }}
                        >
                            <MenuItem value={1}>albendazole + ivermectin</MenuItem>
                            <MenuItem value={2}>
                                albendazole + diethylcarbamazine
                  </MenuItem>
                            <MenuItem value={3}>ivermectin</MenuItem>
                            <MenuItem value={4}>
                                ivermectin + albendazole + diethylcarbamazine
                  </MenuItem>
                            <MenuItem value={5}>custom</MenuItem>
                        </Select>
                    </FormControl>


                </div>
            </section>

        </Layout>
    )
}
export default observer(Setup)
