import {
  Button,
  Typography,
} from '@material-ui/core'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { makeStyles } from '@material-ui/core/styles'
import { observer } from 'mobx-react'
import React, { useEffect, useState, Fragment } from 'react'
import { useHistory } from 'react-router-dom'
import { orderBy, map } from 'lodash'
import PrevalenceMiniGraph from '../components/PrevalenceMiniGraph'
import { useDataAPI, useUIState } from '../hooks/stateHooks'
import { Layout } from '../layout'
import { useStore } from './../store/simulatorStore'
import HeadWithInputs from './components/HeadWithInputs'
import SelectCountry from './components/SelectCountry'
import TextContents from './components/TextContents'
import { loadAllIUhistoricData } from './components/simulator/ParamMdaLoader'

// settings
import {
  SettingName,
  SettingFrequency,
  SettingTargetCoverage,
  SettingDrugRegimen,
  SettingBasePrevalence,
  SettingNumberOfRuns,
  SettingMosquitoType,
  SettingBedNetCoverage,
  SettingInsecticideCoverage,
  SettingPrecision,
  SettingSystematicAdherence,
  SettingSpecificScenario,
} from './components/simulator/settings'

const useStyles = makeStyles((theme) => ({
  withSlider: {
    margin: theme.spacing(0, 0, 6, 0),
    whiteSpace: 'nowrap',
  },
  settings: {
    position: 'relative',
    padding: theme.spacing(4, 0, 0, 0),
    display: 'flex',
    flexDirection: 'column',

    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
  },
  section: {
    position: 'relative',
    backgroundColor: theme.palette.secondary.light,
    width: `calc(100% + ${theme.spacing(12)}px)`,
    marginLeft: -theme.spacing(6),
    padding: theme.spacing(4, 6),
  },
  charts: {
    position: 'relative',
    backgroundColor: theme.palette.secondary.dark,
    margin: theme.spacing(0, 0, 4, 0),
    '&:after': {
      content: `''`,
      display: 'table',
      clear: 'both',
    },
  },
  heading: {
    color: '#000',
    fontSize: 18,
    fontWeight: 500,
  },
  accordionTitle: {
    padding: theme.spacing(1, 0, 1, 0),
    color: '#000',
    fontSize: 18,
    fontWeight: 500,
  },
  chart: {
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
    backgroundColor: theme.palette.secondary.dark,
    [theme.breakpoints.up('md')]: {
      textAlign: 'left',
      float: 'left',
      width: 'calc(50% - 16px)',
      '&.fullwidth': {
        width: '100%',
        textAlign: 'left',
      },
    },
  },
  legend: {
    textTransform: 'uppercase',
    textTransform: 'uppercase',
    fontSize: 14,
    letterSpacing: 1,
    fontSize: 12,
    width: 30,
    marginBottom: 0,
    marginLeft: -3,
  },
  scenariosWrap: {
    padding: theme.spacing(4),
    margin: theme.spacing(0, 0, 3, 0),
    backgroundColor: 'white',
  },
  headline: {
    color: theme.palette.text.primary,
    margin: theme.spacing(0, 0, 3, 0),
  },
  formControlWrap: {
    padding: theme.spacing(4),
    margin: theme.spacing(0, 0, 3, 0),
    backgroundColor: 'white',

    [theme.breakpoints.up('md')]: {
      textAlign: 'center',
      float: 'left',
      width: 'calc(50% - 16px)',
      '&.fullwidth': {
        width: '100%',
        textAlign: 'left',
      },
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
  setupFormControl: {
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(0, 10, 0, 10),
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: 460,
      margin: 'auto',
      //display: "inline-block",
    },
  },
  halfFormControl: {
    [theme.breakpoints.up('md')]: {
      width: 'calc(50% - 16px)',
    },
  },
}))

const Setup = (props) => {
  const [isLoading, setIsLoading] = useState(false)

  const history = useHistory()
  const classes = useStyles()
  const { simParams, dispatchSimParams } = useStore()
  const {
    iuFeatures,
    //stateFeaturesCurrentCountry: stateFeatures,
    //stateDataCurrentCountry: stateData,
    stateScales,
  } = useDataAPI()
  const { country, implementationUnit } = useUIState()
  const { selectedIUData } = useDataAPI()

  const doWeHaveData = simParams.IUData.IUloaded === implementationUnit
  const loadData = async () => {
    await loadAllIUhistoricData(
      simParams,
      dispatchSimParams,
      implementationUnit
    )
    setIsLoading(false)
  }

  if (!doWeHaveData) {
    if (!isLoading) {
      loadData()
      setIsLoading(true)
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <HeadWithInputs title="prevalence simulator" />
        <section className={classes.section}>
          <Typography variant="h3" component="h6" className={classes.headline}>
            Loading setup
          </Typography>
        </section>
      </Layout>
    )
  }
  let mdaObjTimeFiltered = null
  if (simParams.IUData.mdaObj) {
    const startYear = 2010
    const endYear = 2019
    mdaObjTimeFiltered = {
      active: [],
      time: [],
      adherence: [],
      bednets: [],
      coverage: [],
      regimen: [],
    }
    map(simParams.IUData.mdaObj.time, (e, i) => {
      const currentYear = 2000 + (e / 12)
      if (currentYear >= startYear && currentYear <= endYear) {
        mdaObjTimeFiltered.time.push(simParams.IUData.mdaObj.time[i])
        mdaObjTimeFiltered.active.push(simParams.IUData.mdaObj.active[i])
        mdaObjTimeFiltered.adherence.push(simParams.IUData.mdaObj.adherence[i])
        mdaObjTimeFiltered.bednets.push(simParams.IUData.mdaObj.bednets[i])
        mdaObjTimeFiltered.coverage.push(simParams.IUData.mdaObj.coverage[i])
        mdaObjTimeFiltered.regimen.push(simParams.IUData.mdaObj.regimen[i])
      }
    })
  }

  const selecteIUName = selectedIUData[0] ? selectedIUData[0]['name'] : ''

  const submitSetup = (event) => {
    // pass params to simulator ..
    history.push({ pathname: `/simulator/${country}/${implementationUnit}` })
  }

  return (
    <Layout>
      <HeadWithInputs title="prevalence simulator" />
      <SelectCountry selectIU={true} />

      <section className={classes.section}>
        <Typography variant="h3" component="h6" className={classes.headline}>
          Setup
        </Typography>
        <TextContents>
          <Typography paragraph variant="body1" component="p">
            {`We hold the following information for ${selecteIUName}.`}
            <br />
            This data will be used to initialise the simulation.
          </Typography>
        </TextContents>

        <div className={classes.charts}>
          <div className={classes.chart}>
            <Typography
              variant="h6"
              component="h6"
              className={classes.headline}
            >
              Prevalence data (
              {selectedIUData[0] && selectedIUData[0].endemicity})
            </Typography>
            <PrevalenceMiniGraph data={selectedIUData[0]} />
          </div>
          <div className={classes.chart}>
            <Typography
              variant="h6"
              component="h6"
              className={classes.headline}
            >
              Espen intervention data
            </Typography>
            <div className="bars setup">
              {simParams.IUData.mdaObj &&
                mdaObjTimeFiltered.time.map((e, i) => (
                  <div
                    key={`bar-setup-${i}`}
                    className={`bar setup c${simParams.IUData.mdaObj.coverage[i]}`}
                    title={
                      simParams.IUData.mdaObj.time[i] +
                      ', ' +
                      simParams.IUData.mdaObj.coverage[i] +
                      ', ' +
                      simParams.IUData.mdaObj.adherence[i] +
                      ', ' +
                      simParams.IUData.mdaObj.bednets[i] +
                      ', ' +
                      simParams.IUData.mdaObj.regimen[i] +
                      ' '
                    }
                  >
                    <span
                      style={{
                        height: simParams.IUData.mdaObj.coverage[i],
                      }}
                    ></span>
                  </div>
                ))}
            </div>
            <div className="bars setup">
              {simParams.IUData.mdaObj &&
                mdaObjTimeFiltered.time.map((e, i) => (
                  <Typography
                    key={`bar-legend=${i}`}
                    className={classes.legend}
                    component="p"
                  >
                    {'‘' +
                      (2000 + mdaObjTimeFiltered.time[i] / 12)
                        .toString()
                        .substr(-2)}
                  </Typography>
                ))}
            </div>
          </div>
        </div>

        <TextContents>
          <Typography paragraph variant="body1" component="p">
            Based on the data we hold we are assuming that in the future…
            <br />
            You will be able to change this later.
          </Typography>
        </TextContents>

        <div className={classes.settings}>
          <div className={classes.formControlWrap}>
            <div className={classes.setupFormControl}>
              <SettingBedNetCoverage
                inModal={false}
                label="Bed Net Coverage"
                value={50}
              />
            </div>
          </div>

          <div className={classes.formControlWrap}>
            <div className={classes.setupFormControl}>
              <SettingTargetCoverage
                inModal={false}
                label="Intervention target coverage"
              />
            </div>
          </div>

          <div className={classes.formControlWrap}>
            <div className={classes.setupFormControl}>
              <SettingFrequency
                inModal={false}
                label="Intervention Frequency"
              />
            </div>
          </div>

          <div className={classes.formControlWrap}>
            <div className={classes.setupFormControl}>
              <SettingDrugRegimen
                inModal={false}
                label="Intervention drug regimen"
              />
            </div>
          </div>

          <div className={classes.formControlWrap}>
            <div className={classes.setupFormControl}>
              <Typography className={classes.accordionTitle} variant="h4" component="h3">
                Mosquito settings
              </Typography>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>Mosquito type</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <SettingMosquitoType inModal={false} label="" />
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography className={classes.heading}>Vector: Insecticide Coverage</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <SettingInsecticideCoverage
                    inModal={false}
                    label=""
                  />
                </AccordionDetails>
              </Accordion>

            </div>
          </div>


          <div className={`${classes.formControlWrap}`}>
            <div className={classes.setupFormControl}>
              <SettingSystematicAdherence
                inModal={false}
                label="Systematic adherence"
              />
            </div>
          </div>

        </div>

        <TextContents>
          <Typography paragraph variant="body1" component="p">
            Are you interested in a specific scenario?
            <br />
            You will be able to change this later.
          </Typography>
        </TextContents>
        <div className={classes.scenariosWrap}>
          <div className={`${classes.buttonsControl}`}>
            <SettingSpecificScenario inModal={false} />
          </div>
        </div>

        <Button onClick={submitSetup} variant="contained" color="primary">
          Predictions
        </Button>
      </section>
    </Layout>
  )
}
export default observer(Setup)
