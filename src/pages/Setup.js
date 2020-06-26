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
  Button,
  Slider,
} from "@material-ui/core";

import { makeStyles } from '@material-ui/core/styles'
import { abbrNum } from '../utils'
import { useHistory } from 'react-router-dom'

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
    padding: theme.spacing(4, 0, 0, 0),
    display: 'flex',
    flexDirection: 'column',

    [theme.breakpoints.up('lg')]: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    }
  },
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
  },
  scenariosWrap: {
    padding: theme.spacing(4),
    margin: theme.spacing(0, 0, 3, 0),
    backgroundColor: 'white',
  },
  formControlWrap: {
    padding: theme.spacing(4),
    margin: theme.spacing(0, 0, 3, 0),
    backgroundColor: 'white',

    [theme.breakpoints.up('lg')]: {

      textAlign: 'center',
      float: 'left',
      width: 'calc(50% - 16px)'
    },

  },
  buttonsControl: {
    margin: theme.spacing(0),
    '& > button': {
      margin: theme.spacing(0, 1, 1, 0),
    },
    [theme.breakpoints.up('md')]: {
      width: '60%',
    },
  },
  formControl: {
    margin: theme.spacing(0),
    '& > label': {},
    '& > button': {
      margin: theme.spacing(0, 1, 1, 0),
    },
    [theme.breakpoints.up('md')]: {
      width: '40%',
      '&.large': {
        width: '60%'
      }
    },
    [theme.breakpoints.up('lg')]: {
      display: 'inline-block',
    },
  },
}))

const Setup = props => {
  const history = useHistory()
  const classes = useStyles()
  const {
    iuFeatures,
    //stateFeaturesCurrentCountry: stateFeatures,
    //stateDataCurrentCountry: stateData,
    stateScales,
  } = useDataAPI()
  const { country, implementationUnit } = useUIState()


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

  const submitSetup = (event) => {
    // pass params to simulator ..
    history.push({ pathname: `/simulator/${country}/${implementationUnit}` })
  };

  //console.log(country);

  return (
    <Layout>
      <HeadWithInputs
        title="prevalence simulator"
      />

      <SelectCountry selectIU={true} />

      <section className={classes.section}>
        <Typography variant="h3" component="h6" className={classes.headline} >Setup</Typography>
        <TextContents>
          <Typography paragraph variant="body1" component="p">We hold the following information for IU Name.<br />This data will be used to initialise the simulation.</Typography>
        </TextContents>

        <div className={classes.charts}>
          <Typography paragraph variant="body1" component="p">Espen survey data</Typography>
          <Typography paragraph variant="body1" component="p">Espen intervetion data</Typography>
        </div>

        <TextContents>
          <Typography paragraph variant="body1" component="p">
            Based on the data we hold we are assuming that in the future…<br />
                        You will be able to change this later.
                    </Typography>
        </TextContents>

        <div className={classes.settings}>

          <div className={classes.formControlWrap}>
            <FormControl fullWidth className={classes.formControl}>
              <FormLabel
                component="legend"
                htmlFor="covN"
                className={classes.withSlider}
              >
                Bed Net Coverage (%)
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
            </FormControl>
          </div>

          <div className={classes.formControlWrap}>
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
          </div>

          <div className={classes.formControlWrap}>
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
          </div>

          <div className={classes.formControlWrap}>
            <FormControl
              fullWidth
              variant="outlined"
              className={classes.formControl}
            >
              <FormLabel
                component="legend"
                htmlFor="demo-simple-select-helper-label"
              >
                Drug regimen
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


        </div>

        <TextContents>
          <Typography paragraph variant="body1" component="p">
            Are you interested in a specific scenario?<br />
                        You will be able to change this later.
                    </Typography>
        </TextContents>
        <div className={classes.scenariosWrap}>
          <div className={`${classes.buttonsControl}`}>
            <Button variant="contained" color="primary">2 year COVID Interruption</Button>
            <Button variant="contained">Scenario three</Button>
            <Button variant="contained">Treatment stop</Button>
          </div>
        </div>

        <Button onClick={submitSetup} variant="contained" color="primary">Predictions</Button>


      </section>

    </Layout>
  )
}
export default observer(Setup)
