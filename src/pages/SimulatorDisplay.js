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

import SessionStorage from './components/simulator/helpers/sessionStorage'
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

window.SessionStorage = SessionStorage;

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

let renderCount = 0;

const SimulatorDisplay = (props) => {

  console.log( `SimulatorDisplay render() #${++renderCount}` );
  console.log( props );

  const classes = useStyles();

  const [ graphMetric, setGraphMetric ] = useState( 'Ms' )

  const { simParams, dispatchSimParams } = useStore();
  const { implementationUnit } = useUIState();
  const { selectedIUData } = useDataAPI();

  // 2nd-arg empty array makes this a componentDidMount equivalent - only re-run if {nothing} changes
  useEffect(
    () => {
    },
    []
  );

  const resetCurrentScenario = () => {
    dispatchSimParams({
      type: 'resetScenario',
    })
  }
  const scenarioDisplay = props.scenarioData ? (
        <div className={classes.simulatorBody}>
          <div className={classes.simulatorInnerBody}>
            <Grid container spacing={0}>
              <Grid item md={6} xs={12}>
                <Typography
                  className={classes.chartTitle}
                  variant="h3"
                  component="h2"
                >
                  {props.scenarioData.label}
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
                    disabled={props.simInProgress || props.scenarioKeys.length === 0}
                    className={classes.removeIcon}
                    onClick={props.confirmRemoveCurrentScenario}
                  >
                    &nbsp;
                  </Fab>

                  <ChartSettings
                    title="Edit scenario"
                    buttonText="Update Scenario"
                    action={props.runCurrentScenario}
                  >
                    <TextContents>
                      <Typography paragraph variant="body1" component="p">
                        What scenario do you want to simulate?
                      </Typography>
                    </TextContents>

                    <SettingName
                      inModal={true}
                      label="Scenario name"
                      scenarioId={props.scenarioId}
                      scenarioLabel={
                        simParams.scenarioLabels[ props.scenarioId ]
                           ? simParams.scenarioLabels[ props.scenarioId ]
                           : props.scenarioData.label
                      }
                    />
                    <SettingBedNetCoverage
                      inModal={true}
                      label="Bed Net Coverage"
                    />
                    <SettingFrequency inModal={true} label="Treatment frequency" />
                    <SettingDrugRegimen inModal={true} label="Drug regimen" />
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
                    <SettingMosquitoType inModal={true} label="Mosquito type" />
                    <TextContents>
                      <Typography paragraph variant="body1" component="p">
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
                        setGraphMetric(ev.target.value);
                      }}
                    >
                      <MenuItem value={"Ms"}>Prevalence microfilariae</MenuItem>
                      <MenuItem value={"Ls"}>
                        Prevalence in the mosquito population
                      </MenuItem>
                      <MenuItem value={"Ws"}>
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
                      props.simInProgress || props.scenarioKeys.length === 0
                    } /*  || scenarioInputs.length === 0 */
                    onClick={props.runCurrentScenario}
                  >
                    UPDATE SCENARIO
                  </Button>{" "}
                  &nbsp;
                  <IconButton
                    className={classes.buttonBG}
                    variant="contained"
                    color="primary"
                    aria-label="reset scenario"
                    component="span"
                    disabled={
                      props.simInProgress || props.scenarioKeys.length === 0
                    } /*  || scenarioInputs.length === 0 */
                    onClick={resetCurrentScenario}
                  >
                    <RotateLeftIcon />
                  </IconButton>
                </div>
              )}

              <ScenarioGraph
                data={props.scenarioData}
                showAllResults={false}
                metrics={[graphMetric]}
                simInProgress={props.simInProgress}
                simNeedsRerun={simParams.needsRerun}
                simParams={simParams}
                classes={classes}
                IU={implementationUnit}
                IUData={selectedIUData}
              />
            </div>

            {props.scenarioMDAs[props.scenarioId] && simParams.tweakedPrediction && (
              <MdaRounds
                history={props.scenarioMDAs[props.scenarioId]}
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

  ) : null;

  return (
    <div id="SimulatorDisplay">
     { scenarioDisplay }
    </div>
  );
}

export default SimulatorDisplay;
