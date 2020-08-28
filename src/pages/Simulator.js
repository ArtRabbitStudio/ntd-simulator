import {
  Box,
  Button,
  IconButton,
  CircularProgress,
  Fab,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core'
import RotateLeftIcon from '@material-ui/icons/RotateLeft'

import { useTheme } from '@material-ui/styles'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import ScenarioGraph from '../components/ScenarioGraph'
import { useUIState, useDataAPI } from '../hooks/stateHooks'
import { Layout } from '../layout'
import { useStore } from './../store/simulatorStore'
import ChartSettings from './components/ChartSettings'
import ConfirmationDialog from './components/ConfirmationDialog'
import HeadWithInputs from './components/HeadWithInputs'
import SelectCountry from './components/SelectCountry'
import { removeInactiveMDArounds } from './components/simulator/helpers/removeInactiveMDArounds'
import { detectChange } from './components/simulator/helpers/detectChange'
import { obtainIUData } from './components/simulator/helpers/obtainIUData'
import { trimMdaHistory } from './components/simulator/helpers/trimMdaHistory'
import { combineFullMda } from './components/simulator/helpers/combineFullMda'
import { shallIupdateTabLabel } from './components/simulator/helpers/shallIupdateTabLabel'
import MdaRounds from './components/simulator/MdaRounds'
import { generateMdaFuture } from './components/simulator/helpers/iuLoader'
// settings
import {
  SettingBedNetCoverage,
  SettingDrugRegimen,
  SettingFrequency,
  SettingInsecticideCoverage,
  SettingMosquitoType,
  SettingName,
  SettingPrecision,
  SettingSpecificScenario,
  SettingSystematicAdherence,
  SettingTargetCoverage,
} from './components/simulator/settings'
import * as SimulatorEngine from './components/simulator/SimulatorEngine'
import useStyles from './components/simulator/styles'
import TextContents from './components/TextContents'

SimulatorEngine.simControler.documentReady()

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Typography>
  )
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

let countryLinks = []

const Simulator = (props) => {
  const classes = useStyles()
  const theme = useTheme()
  const { simParams, dispatchSimParams } = useStore()
  const { country, implementationUnit } = useUIState()
  const { selectedIUData } = useDataAPI()

  // console.log('simParams')
  // console.log(simParams)
  /* MDA object */
  const [graphMetric, setGraphMetric] = useState('Ms')

  // check for stale scenarios object in LS
  const LSSessionData = JSON.parse(window.localStorage.getItem('sessionData'))
  if (
    (LSSessionData !== null &&
      LSSessionData.scenarios &&
      LSSessionData.scenarios[0] &&
      LSSessionData.scenarios[0].mda &&
      typeof LSSessionData.scenarios[0].mda2015 === 'undefined') ||
    (LSSessionData !== null &&
      LSSessionData.scenarios &&
      LSSessionData.scenarios[0] &&
      LSSessionData.scenarios[0].mda &&
      typeof LSSessionData.scenarios[0].mda2015 &&
      typeof LSSessionData.scenarios[0].mda2015.active === 'undefined')
  ) {
    // clear LS and relaod if stale project is found
    window.localStorage.removeItem('sessionData')
    window.localStorage.removeItem('scenarioIndex')
    //console.log('reloading')
    window.location.reload()
  }

  /* Simulation, tabs etc */
  const [simInProgress, setSimInProgress] = useState(false)
  // console.log(parseInt(window.localStorage.getItem('scenarioIndex')))
  // console.log(parseInt(window.localStorage.getItem('scenarioIndex')) + 1)
  // console.log(window.localStorage.getItem('sessionData'))
  const [tabLength, setTabLength] = useState(
    JSON.parse(window.localStorage.getItem('sessionData')) === null
      ? 0
      : JSON.parse(window.localStorage.getItem('sessionData')).scenarios.length
  )
  const [tabIndex, setTabIndex] = useState(
    JSON.parse(window.localStorage.getItem('scenarioIndex')) || 0
  )
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue)
  }
  useEffect(() => {
    if (typeof scenarioInputs[tabIndex] != 'undefined') {
      dispatchSimParams({
        type: 'everythingbuthistoric',
        payload: {
          ...scenarioInputs[tabIndex],
          scenarioLabels: simParams.scenarioLabels,
        },
      })
      SimulatorEngine.ScenarioIndex.setIndex(tabIndex)
    }
  }, [tabIndex])

  const [simulationProgress, setSimulationProgress] = useState(0)
  const [scenarioInputs, setScenarioInputs] = useState([])
  const [scenarioResults, setScenarioResults] = useState(
    window.localStorage.getItem('sessionData')
      ? JSON.parse(window.localStorage.getItem('sessionData')).scenarios
      : []
  )
  const [scenarioMDAs, setScenarioMDAs] = useState([])

  const simulatorCallback = (resultObject, newScenario) => {
    if (typeof resultObject == 'number') {
      setSimulationProgress(resultObject)
    } else {
      //console.log('Simulation returned results!')
      dispatchSimParams({
        type: 'needsRerun',
        payload: false,
      })
      if (typeof scenarioResults[tabIndex] === 'undefined') {
        //console.log('scenarioResults',resultObject)
        setScenarioResults([...scenarioResults, JSON.parse(resultObject)])
        setScenarioInputs([
          ...scenarioInputs,
          JSON.parse(resultObject).params.inputs,
        ])
        setScenarioMDAs([...scenarioMDAs, JSON.parse(resultObject).mda2015])
      } else {
        let correctTabIndex = newScenario === true ? tabIndex + 1 : tabIndex
        //console.log('scenarioResults',resultObject)
        let scenarioResultsNew = [...scenarioResults] // 1. Make a shallow copy of the items
        let resultItem = scenarioResultsNew[correctTabIndex] // 2. Make a shallow copy of the resultItem you want to mutate
        resultItem = JSON.parse(resultObject) // 3. Replace the property you're intested in
        scenarioResultsNew[correctTabIndex] = resultItem // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
        setScenarioResults(scenarioResultsNew) // 5. Set the state to our new copy

        let scenarioInputsNew = [...scenarioInputs]
        let inputsItem = scenarioInputsNew[correctTabIndex]
        inputsItem = JSON.parse(resultObject).params.inputs
        scenarioInputsNew[correctTabIndex] = inputsItem
        setScenarioInputs(scenarioInputsNew)

        let scenarioMDAsNew = [...scenarioMDAs]
        let MDAsItem = scenarioMDAsNew[correctTabIndex]
        const returnedmda2015 = JSON.parse(resultObject)
        MDAsItem = {
          time: [...returnedmda2015.mda2015.time],
          coverage: [...returnedmda2015.mda2015.coverage],
          adherence: [...returnedmda2015.mda2015.adherence],
          bednets: [...returnedmda2015.mda2015.bednets],
          regimen: [...returnedmda2015.mda2015.regimen],
        }
        scenarioMDAsNew[correctTabIndex] = MDAsItem
        setScenarioMDAs(scenarioMDAsNew)
      }
      setSimInProgress(false)
      // console.log('newScenario', newScenario)
      if (newScenario === true) {
        setTabLength(tabLength + 1)
        setTabIndex(tabLength > 5 ? 4 : tabLength)
      }
    }
  }
  const runNewScenario = async () => {
    if (!simInProgress) {
      if (tabLength < 5) {
        setSimInProgress(true)
        const IUData = obtainIUData(simParams, dispatchSimParams)
        SimulatorEngine.simControler.iuParams = IUData.params
        const mdaHistory = IUData.mdaObj
        console.log(simParams)
        const generatedMda = generateMdaFuture(simParams)
        const mdaPrediction =
          simParams.specificPrediction !== null
            ? { ...generatedMda, ...simParams.specificPrediction }
            : generatedMda
        const fullMDA = combineFullMda(mdaHistory, mdaPrediction)
        if (
          shallIupdateTabLabel(
            simParams.specificPrediction,
            simParams.scenarioLabels[tabIndex]
          )
        ) {
          dispatchSimParams({
            type: 'scenarioLabel',
            payload: simParams.specificPrediction.label,
          })
        }

        dispatchSimParams({
          type: 'defaultPrediction',
          payload: mdaPrediction,
        })
        dispatchSimParams({
          type: 'tweakedPrediction',
          payload: mdaPrediction,
        })
        SimulatorEngine.simControler.mdaObj = removeInactiveMDArounds(fullMDA)
        SimulatorEngine.simControler.mdaObjUI = fullMDA
        SimulatorEngine.simControler.mdaObj2015 = trimMdaHistory(mdaHistory)
        SimulatorEngine.simControler.mdaObjFuture = mdaPrediction
        SimulatorEngine.simControler.iuParams = IUData.params
        console.log('runningScenario')
        console.log('mdaObj',SimulatorEngine.simControler.mdaObj)
        console.log('iuParams',SimulatorEngine.simControler.iuParams)

        SimulatorEngine.simControler.newScenario = true
        SimulatorEngine.simControler.runScenario(
          simParams,
          tabLength,
          simulatorCallback
        )
      } else {
        alert('Sorry maximum number of Scenarios is 5.')
      }
    }
  }
  const runCurrentScenario = async () => {
    //console.log(simParams)
    //console.log('runCurrentScenario', !simInProgress)
    //console.log('simParams',simParams)
    if (!simInProgress) {
      setSimInProgress(true)
      //console.log(tabIndex, simParams)
      const IUData = obtainIUData(simParams, dispatchSimParams)
      const mdaHistory = IUData.mdaObj
      //console.log('prediction pulled from simParams.tweakedPrediction')
      const generatedMda = generateMdaFuture(simParams)
      const mdaPrediction =
        simParams.specificPrediction !== null
          ? { ...generatedMda, ...simParams.specificPrediction }
          : generatedMda
      const fullMDA = combineFullMda(mdaHistory, mdaPrediction)
      if (
        shallIupdateTabLabel(
          simParams.specificPrediction,
          simParams.scenarioLabels[tabIndex]
        )
      ) {
        dispatchSimParams({
          type: 'scenarioLabel',
          payload: simParams.specificPrediction.label,
        })
      }

      dispatchSimParams({
        type: 'defaultPrediction',
        payload: mdaPrediction,
      })
      dispatchSimParams({
        type: 'tweakedPrediction',
        payload: mdaPrediction,
      })
      SimulatorEngine.simControler.mdaObj = removeInactiveMDArounds(fullMDA)
      SimulatorEngine.simControler.mdaObjUI = fullMDA
      SimulatorEngine.simControler.mdaObj2015 = trimMdaHistory(mdaHistory)
      SimulatorEngine.simControler.mdaObjFuture = mdaPrediction
      SimulatorEngine.simControler.iuParams = IUData.params
      console.log('runningScenario')
      console.log('mdaObj',SimulatorEngine.simControler.mdaObj)
      console.log('iuParams',SimulatorEngine.simControler.iuParams)

      SimulatorEngine.simControler.newScenario = false
      SimulatorEngine.simControler.runScenario(
        simParams,
        tabIndex,
        simulatorCallback
      )
    }
  }
  const resetCurrentScenario = () => {
    dispatchSimParams({
      type: 'resetScenario',
    })
  }
  const removeCurrentScenario = () => {
    if (!simInProgress) {
      SimulatorEngine.SessionData.deleteScenario(tabIndex)

      let newScenarios = [...scenarioResults]
      newScenarios = newScenarios.filter(
        (item) => item !== scenarioResults[tabIndex]
      )
      setScenarioResults([...newScenarios])

      let newScenarioInputs = [...scenarioInputs]
      newScenarioInputs = newScenarioInputs.filter(
        (item) => item !== scenarioInputs[tabIndex]
      )
      setScenarioInputs([...newScenarioInputs])

      let newScenarioMDAs = [...scenarioMDAs]
      newScenarioMDAs = newScenarioMDAs.filter(
        (item) => item !== scenarioMDAs[tabIndex]
      )
      setScenarioMDAs(newScenarioMDAs)

      setTabLength(tabLength >= 1 ? tabLength - 1 : 0)
      setTabIndex(tabIndex >= 1 ? tabIndex - 1 : 0)
    }
  }
  const [confirmatonOpen, setConfirmatonOpen] = useState(false)
  const confirmRemoveCurrentScenario = () => {
    if (!simInProgress) {
      setConfirmatonOpen(true)
    }
  }
  const confirmedRemoveCurrentScenario = () => {
    if (!simInProgress) {
      setConfirmatonOpen(false)
      removeCurrentScenario()
    }
  }

  useEffect(() => {
    if (typeof scenarioResults[tabIndex] === 'undefined') {
      //console.log('No scenarios? Running a new one...')
      runNewScenario()
    }
    let scenariosArray = JSON.parse(window.localStorage.getItem('sessionData'))
      ? JSON.parse(window.localStorage.getItem('sessionData')).scenarios
      : null
    if (scenariosArray) {
      //console.log('load simParams from LS')
      let paramsInputs = scenariosArray.map((item) => item.params.inputs)
      let mdaFuture = scenariosArray.map((item) => item.mdaFuture)
      let MDAs = scenariosArray.map((item) => item.mda2015)
      // make new default prediction from ex tweaked one - the one from "mdaFuture".
      let paramsInputsWithPrediction = paramsInputs.map((item, index) => ({
        ...item,
        defaultPrediction: {
          time: [...mdaFuture[index].time],
          coverage: [...mdaFuture[index].coverage],
          adherence: [...mdaFuture[index].adherence],
          bednets: [...mdaFuture[index].bednets],
          regimen: [...mdaFuture[index].regimen],
          active: [...mdaFuture[index].active],
          beenFiddledWith: [...mdaFuture[index].beenFiddledWith],
        },
        tweakedPrediction: {
          time: [...mdaFuture[index].time],
          coverage: [...mdaFuture[index].coverage],
          adherence: [...mdaFuture[index].adherence],
          bednets: [...mdaFuture[index].bednets],
          regimen: [...mdaFuture[index].regimen],
          active: [...mdaFuture[index].active],
          beenFiddledWith: [...mdaFuture[index].beenFiddledWith],
        },
      }))
      setScenarioInputs(paramsInputsWithPrediction)
      if (typeof paramsInputsWithPrediction[tabIndex] != 'undefined') {
        setScenarioMDAs(MDAs)
        //console.log(simParams)
        dispatchSimParams({
          type: 'everythingbuthistoric',
          payload: paramsInputsWithPrediction[tabIndex],
        })
      }
    }
  }, [])

  useEffect(() => {
    detectChange(simParams, dispatchSimParams)
  }, [
    simParams.coverage,
    // simParams.mda,
    simParams.mdaSixMonths,
    // simParams.endemicity: 10,
    simParams.covN,
    // v_to_hR: 0,
    // vecCap: 0,
    // vecComp: 0,
    // vecD: 0,
    simParams.mdaRegimen,
    simParams.rho,
    simParams.species,
    simParams.runs,
    simParams.tweakedPrediction,
    simParams.defaultPrediction,
  ])

  return (
    <Layout>
      <HeadWithInputs title="prevalence simulator" />
      {/*       {props.location.search}
      {window.location.search} */}

      <SelectCountry selectIU={true} showConfirmation={true} />

      <section className={classes.simulator}>
        <Grid container spacing={0}>
          <Grid item xs={12} className={classes.tabs}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              aria-label="Available scenarios"
              indicatorColor="secondary"
              textColor="secondary"
              variant="scrollable"
              scrollButtons="auto"
            >
              {scenarioResults.map((result, i) => (
                <Tab
                  key={`tab-element-${i}`}
                  label={
                    simParams.scenarioLabels[i]
                      ? simParams.scenarioLabels[i]
                      : `Scenario ${i + 1}`
                  }
                  {...a11yProps(i)}
                />
              ))}

              {tabLength < 5 && (
                <Tab
                  key={`tab-element-99`}
                  label={`+ Add one`}
                  disabled={simInProgress}
                  onClick={runNewScenario}
                ></Tab>
              )}
            </Tabs>
          </Grid>

          <Grid item md={12} xs={12} className={classes.chartContainer}>
            {scenarioResults.map((result, i) => (
              <TabPanel key={`scenario-result-${i}`} value={tabIndex} index={i}>
                <div className={classes.simulatorBody}>
                  <div className={classes.simulatorInnerBody}>
                    <Grid container spacing={0}>
                      <Grid item md={6} xs={12}>
                        <Typography
                          className={classes.chartTitle}
                          variant="h3"
                          component="h2"
                        >
                          {`Scenario ${i + 1}`}
                        </Typography>
                        <SettingPrecision
                          classAdd={classes.precision}
                          inModal={true}
                          label="Precision"
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <div className={classes.rightControls}>
                          <Fab
                            color="inherit"
                            aria-label="REMOVE SCENARIO"
                            disabled={
                              simInProgress || scenarioResults.length === 0
                            }
                            className={classes.removeIcon}
                            onClick={confirmRemoveCurrentScenario}
                          >
                            &nbsp;
                          </Fab>

                          <ChartSettings
                            title="Edit scenario"
                            buttonText="Update Scenario"
                            action={runCurrentScenario}
                          >
                            <TextContents>
                              <Typography
                                paragraph
                                variant="body1"
                                component="p"
                              >
                                What scenario do you want to simulate?
                              </Typography>
                            </TextContents>

                            <SettingName inModal={true} label="Scenario name" />
                            <SettingBedNetCoverage
                              inModal={true}
                              label="Bed Net Coverage"
                            />
                            <SettingFrequency
                              inModal={true}
                              label="Treatment frequency"
                            />
                            <SettingDrugRegimen
                              inModal={true}
                              label="Drug regimen"
                            />
                            <SettingTargetCoverage
                              inModal={true}
                              label="Treatment target coverage"
                            />
                            <SettingSystematicAdherence
                              inModal={true}
                              label="Systematic adherence"
                            />
                            {/* no longer in use <SettingBasePrevalence inModal={true} label="Base prevalence" /> */}
                            {/* no longer in use <SettingNumberOfRuns inModal={true} label="Number of runs" /> */}
                            <SettingInsecticideCoverage
                              inModal={true}
                              label="Insecticide Coverage"
                            />
                            <SettingMosquitoType
                              inModal={true}
                              label="Mosquito type"
                            />
                            <TextContents>
                              <Typography
                                paragraph
                                variant="body1"
                                component="p"
                              >
                                Are you interested in a specific scenario?
                              </Typography>
                            </TextContents>
                            <SettingSpecificScenario inModal={true} />
                          </ChartSettings>

                          <FormControl
                            variant="outlined"
                            className={classes.formControlPrevalence}
                          >
                            <Select
                              labelId="larvae-prevalence"
                              id="larvae-prevalence"
                              value={graphMetric}
                              MenuProps={{ disablePortal: true }}
                              onChange={(ev) => {
                                // console.log(ev.target.value)
                                setGraphMetric(ev.target.value)
                              }}
                            >
                              <MenuItem value={'Ms'}>
                                Prevalence microfilariae
                              </MenuItem>
                              <MenuItem value={'Ls'}>
                                Prevalence in the mosquito population
                              </MenuItem>
                              <MenuItem value={'Ws'}>
                                Prevalence of worms in the lymph nodes
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                      </Grid>
                    </Grid>

                    <div className={classes.scenarioGraph}>
                      {simParams.needsRerun && (
                        <div className={classes.updateScenario}>
                          <Button
                            variant="contained"
                            color="primary"
                            disabled={
                              simInProgress || scenarioResults.length === 0
                            } /*  || scenarioInputs.length === 0 */
                            onClick={runCurrentScenario}
                          >
                            UPDATE SCENARIO
                          </Button>{' '}
                          &nbsp;
                          <IconButton
                            className={classes.buttonBG}
                            variant="contained"
                            color="primary"
                            aria-label="reset scenario"
                            component="span"
                            disabled={
                              simInProgress || scenarioResults.length === 0
                            } /*  || scenarioInputs.length === 0 */
                            onClick={resetCurrentScenario}
                          >
                            <RotateLeftIcon />
                          </IconButton>
                        </div>
                      )}
                      <ScenarioGraph
                        data={result}
                        showAllResults={false}
                        metrics={[graphMetric]}
                        simInProgress={simInProgress}
                        simNeedsRerun={simParams.needsRerun}
                        simParams={simParams}
                        classes={classes}
                        IU={implementationUnit}
                        IUData={selectedIUData}
                      />
                    </div>
                    {scenarioMDAs[tabIndex] && simParams.tweakedPrediction && (
                      <MdaRounds
                        history={scenarioMDAs[tabIndex]}
                        future={simParams.tweakedPrediction}
                      />
                    )}
                    <Typography
                      className={classes.scenarioGraphLegendInterventions}
                      variant="h6"
                      component="h6"
                    >
                      Interventions
                    </Typography>
                  </div>
                </div>
              </TabPanel>
            ))}

            <ConfirmationDialog
              title="Do you want to delete this scenario?"
              onClose={() => {
                setConfirmatonOpen(false)
              }}
              onConfirm={confirmedRemoveCurrentScenario}
              open={confirmatonOpen}
            />

            {simulationProgress !== 0 && simulationProgress !== 100 && (
              <div className={classes.progress}>
                <CircularProgress
                  variant="determinate"
                  value={simulationProgress}
                  color="primary"
                />
              </div>
            )}
          </Grid>
        </Grid>
      </section>
    </Layout>
  )
}
export default Simulator
