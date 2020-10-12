import {
  Box,
  Button,
  IconButton,
  Fab,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography,
  Tooltip
} from '@material-ui/core'
import RotateLeftIcon from '@material-ui/icons/RotateLeft'
import { observer } from 'mobx-react'

import SessionStorage from 'pages/components/simulator/helpers/sessionStorage'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import ScenarioGraph from 'components/ScenarioGraph'
import { useUIState, useDataAPI } from 'hooks/stateHooks'
import { useSimulatorStore } from 'store/simulatorStore'
import { useScenarioStore } from 'store/scenarioStore'
import ChartSettings from 'pages/components/simulator/ChartSettings'
import MdaRounds from 'pages/components/simulator/MdaRounds'
import DiseaseModels from 'pages/components/simulator/models/DiseaseModels';

import { DISEASE_LIMF } from 'AppConstants';

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
} from 'pages/components/simulator/settings'
import useStyles from 'pages/components/simulator/styles'
import TextContents from 'pages/components/TextContents'

window.SessionStorage = SessionStorage;

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

const ScenarioDisplay = (props) => {

  const classes = useStyles();

  const [ graphMetric, setGraphMetric ] = useState( 'Ms' )
  const [ graphTypeSimpleLocal, setGraphTypeSimpleLocal ] = useState(true)
  const handleGraphTypeChange = () => {
    if (graphTypeSimpleLocal) {
      setGraphTypeSimpleLocal(false)
    } else {
      setGraphTypeSimpleLocal(true)
    }

  }
  const { simState } = useSimulatorStore();
  const { scenarioState, /*dispatchScenarioStateUpdate*/ } = useScenarioStore();

  const { implementationUnit } = useUIState();
  const { selectedIUData } = useDataAPI();

  const { disease } = useUIState();
  const diseaseModel = DiseaseModels[ disease ];

  // 2nd-arg empty array makes this a componentDidMount equivalent - only re-run if {nothing} changes
  useEffect(

    () => {
      if ( diseaseModel && diseaseModel.documentReady ) {
        console.log( `ScenarioDisplay calling diseaseModel.documentReady for disease ${disease}` );
        diseaseModel.documentReady();
      }
    },

    // eslint-disable-next-line
    []

  );

  const scenarioId = scenarioState.currentScenarioId;
  const scenarioData = scenarioState.scenarioData[ scenarioId ];

  const scenarioDisplay = scenarioData ? (

    <div className={classes.simulatorBody}>

      <div className={classes.simulatorInnerBody}>

        <Grid container spacing={0}>
          <Grid item md={6} xs={12}>
            <Typography
              className={classes.chartTitle}
              variant="h3"
              component="h2"
            >
              {scenarioData.label}
            </Typography>

            { disease === DISEASE_LIMF &&
              <SettingPrecision
                classAdd={classes.precision}
                inModal={true}
                label="Precision (runs)"
                setGraphTypeSimple={handleGraphTypeChange}
                graphTypeSimple={graphTypeSimpleLocal}
              />
            }

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
                cancelText="Cancel Changes"
                cancel={props.resetCurrentScenario}
                action={props.runCurrentScenario}
                hideFab={false}
              >
                <TextContents>
                  <Typography paragraph variant="body1" component="p">
                    What scenario do you want to simulate?
                  </Typography>
                </TextContents>

                <SettingName
                  inModal={true}
                  label="Scenario name"
                  scenarioId={scenarioId}
                  scenarioLabel={ scenarioData.label }
                />

                { disease === DISEASE_LIMF &&
                  <SettingBedNetCoverage
                    inModal={true}
                    label="Bed Net Coverage"
                  />
                }

                <SettingFrequency inModal={true} label="Treatment frequency" />

                { disease === DISEASE_LIMF &&
                  <SettingDrugRegimen inModal={true} label="Drug regimen" />
                }

                <SettingTargetCoverage
                  inModal={true}
                  label="Treatment target coverage"
                />

                <SettingSystematicAdherence
                  inModal={true}
                  label="Systematic adherence"
                />

                { disease === DISEASE_LIMF &&
                  <SettingInsecticideCoverage
                    inModal={true}
                    label="Insecticide Coverage"
                  />
                }

                { disease === DISEASE_LIMF &&
                  <SettingMosquitoType
                    inModal={true}
                    label="Mosquito type"
                  />
                }

                <TextContents>
                  <Typography paragraph variant="body1" component="p">
                    Are you interested in a specific scenario? { scenarioState.scenarioData[ scenarioState.currentScenarioId ].specificPredictionIndex }
                  </Typography>
                </TextContents>

                <SettingSpecificScenario inModal={true} />

              </ChartSettings>

              { disease === DISEASE_LIMF && (
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
              ) }
            </div>
          </Grid>
        </Grid>

        { /* this is the update button that pops up after a precision or MDA change */ }
        <div className={classes.scenarioGraph}>
          { scenarioState.scenarioData[ scenarioState.currentScenarioId ].isDirty  && (
            <div className={classes.updateScenario}>
              <Button
                variant="contained"
                color="primary"
                disabled={
                  props.simInProgress || props.scenarioKeys.length === 0
                }
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
                }
                onClick={props.resetCurrentScenario}
              >
                <RotateLeftIcon />
              </IconButton>
            </div>
          )}

          { disease === DISEASE_LIMF ?

          <ScenarioGraph
            data={scenarioData}
            graphTypeSimple={graphTypeSimpleLocal}
            showAllResults={false}
            metrics={[graphMetric]}
            simInProgress={props.simInProgress}
            simNeedsRerun={ scenarioState.scenarioData[ scenarioState.currentScenarioId ].isDirty }
            simState={simState}
            classes={classes}
            IU={implementationUnit}
            IUData={selectedIUData}
          />

          /* HERE'S WHERE WE PUT THE TRACHOMA RESULT GRAPH COMPONENT WHEN IT'S READY */
          : scenarioData.trachomaPayload }

        </div>

        { props.simInProgress ? <div className={classes.mdaplaceholder}><span> </span></div> : (
          <React.Fragment>

            <MdaRounds />

            <Tooltip
              title="White bars show no intervention;  blue bars show intervention, the height of the blue colour shows coverage. Historic interventions before 2019 are greyed out."
              aria-label="info"
            >

            <Typography
              className={`${classes.scenarioGraphLegendInterventions} ${classes.withHelp}`}
              variant="h6"
              component="h6"
            >
              Interventions
            </Typography>
            </Tooltip>

          </React.Fragment>
        ) }

      </div>
    </div>

  ) : null;

  return (
    <div id="ScenarioDisplay">
     { scenarioDisplay }
    </div>
  );
}

export default observer( ScenarioDisplay );