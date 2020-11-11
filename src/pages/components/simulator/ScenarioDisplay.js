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

import PropTypes from 'prop-types'
import React, { useEffect, useState, Fragment } from 'react'
import { ScenarioGraphLF } from 'pages/components/diseases/lf';
import { ScenarioGraphTrachoma } from 'pages/components/diseases/trachoma';
import { useUIState, useDataAPI } from 'hooks/stateHooks'
import { useScenarioStore } from 'store/scenarioStore'
import ChartSettings from 'pages/components/simulator/ChartSettings'
import MdaRounds from 'pages/components/simulator/MdaRounds'
import DiseaseModels from 'pages/components/simulator/models/DiseaseModels';
import ConfirmationDialog from "pages/components/ConfirmationDialog";

import { DISEASE_LIMF, DISEASE_TRACHOMA, DISEASE_STH_ROUNDWORM } from 'AppConstants';

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
import { ScenarioGraphSTHRoundworm } from '../diseases/sth-roundworm'

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
  const { disease } = useUIState();

  let defaultMetric = 'Ms'
  if ( disease === DISEASE_STH_ROUNDWORM ) {
    defaultMetric = 'KK'
  }
  const [ graphMetric, setGraphMetric ] = useState( defaultMetric )
  const [ graphTypeSimpleLocal, setGraphTypeSimpleLocal ] = useState(true)
  const [ showPrecisionConfirmation, setshowPrecisionConfirmation ] = useState(false)
  const handleGraphTypeChange = () => {
    if (graphTypeSimpleLocal) {
      setGraphTypeSimpleLocal(false)
    } else {
      setGraphTypeSimpleLocal(true)
    }

  }
  const { scenarioState, /*dispatchScenarioStateUpdate*/ } = useScenarioStore();

  const { implementationUnit } = useUIState();
  const { selectedIUData } = useDataAPI();

  
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

            { (disease === DISEASE_LIMF || disease === DISEASE_STH_ROUNDWORM) &&
              <SettingPrecision
                classAdd={classes.precision}
                inModal={true}
                showPrecisionSlider={true}
                label="Precision (runs)"
                setGraphTypeSimple={handleGraphTypeChange}
                graphTypeSimple={graphTypeSimpleLocal}
                showDialog={setshowPrecisionConfirmation}
              />
            }
            { disease === DISEASE_TRACHOMA &&
              <SettingPrecision
                classAdd={classes.precision}
                inModal={true}
                label="Precision (runs)"
                showPrecisionSlider={false}
                setGraphTypeSimple={handleGraphTypeChange}
                graphTypeSimple={graphTypeSimpleLocal}
                showDialog={setshowPrecisionConfirmation}
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

                { disease === DISEASE_LIMF &&
                  <SettingTargetCoverage
                    inModal={true}
                    label="Treatment target coverage"
                  />
                }
                { disease === DISEASE_TRACHOMA &&
                  <SettingTargetCoverage
                    inModal={true}
                    min={60}
                    max={90}
                    step={10}
                    label="Treatment target coverage"
                  />
                }

                { disease === DISEASE_STH_ROUNDWORM &&
                <Fragment>
                  <SettingTargetCoverage
                    scenarioId={ scenarioData.id }
                    inModal={true}
                    label="MDA Coverage Infants"
                    min={0}
                    max={100}
                    step={5}
                    valueKey="coverageInfants"
                    title="Proportion of infants that will be treated."
                  />
              
                  <SettingTargetCoverage
                    scenarioId={ scenarioData.id }
                    inModal={true}
                    label="MDA Coverage Preschool Children"
                    min={0}
                    max={100}
                    step={5}
                    valueKey="coveragePreSAC"
                    title="Proportion of preschool age children that will be treated."
                  />
              
                  <SettingTargetCoverage
                    scenarioId={ scenarioData.id }
                    inModal={true}
                    label="MDA Coverage School-Age Children "
                    min={0}
                    max={100}
                    step={5}
                    valueKey="coverageSAC"
                    title="Proportion of school-age children that will be treated."
                  />
                
                  <SettingTargetCoverage
                    scenarioId={ scenarioData.id }
                    inModal={true}
                    label="MDA Coverage Adults"
                    min={0}
                    max={100}
                    step={5}
                    valueKey="coverageAdults"
                    title="Proportion of adults that will be treated."
                  />
                </Fragment>
                
                
                }

                {disease === DISEASE_LIMF && 
                  <SettingSystematicAdherence
                    inModal={true}
                    label="Systematic adherence"
                  />
                }

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
                  <MenuItem value={"Ls"}>Prevalence in the mosquito population</MenuItem>
                  <MenuItem value={"Ws"}>Prevalence of worms in the lymph nodes</MenuItem>
                </Select>
              </FormControl>
              ) }
              { disease === DISEASE_STH_ROUNDWORM && (
              <FormControl
                variant="outlined"
                className={classes.formControlPrevalence}
              >
                <Select
                  labelId="metric"
                  id="metric"
                  value={graphMetric}
                  MenuProps={{ disablePortal: true }}
                  onChange={(ev) => {
                    setGraphMetric(ev.target.value);
                  }}
                >
                  <MenuItem value={"KK"}>Prevalence School Age Children</MenuItem>
                  <MenuItem value={"MHI"}>Medium Heavy Prevalence by Village</MenuItem>
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

          { disease === DISEASE_LIMF &&

            <ScenarioGraphLF
              data={scenarioData}
              graphTypeSimple={graphTypeSimpleLocal}
              showAllResults={false}
              metrics={[graphMetric]}
              simInProgress={props.simInProgress}
              simNeedsRerun={ scenarioState.scenarioData[ scenarioState.currentScenarioId ].isDirty }
              classes={classes}
              IU={implementationUnit}
              IUData={selectedIUData}
            />
        
          }         
          { disease === DISEASE_TRACHOMA &&
          
          <ScenarioGraphTrachoma
              data={scenarioData}
              graphTypeSimple={graphTypeSimpleLocal}
              showAllResults={false}
              simInProgress={props.simInProgress}
              simNeedsRerun={ scenarioState.scenarioData[ scenarioState.currentScenarioId ].isDirty }
              classes={classes}
              IU={implementationUnit}
              IUData={selectedIUData}
          />
          }

          { disease === DISEASE_STH_ROUNDWORM &&
          
          <ScenarioGraphSTHRoundworm
              data={scenarioData}
              graphTypeSimple={graphTypeSimpleLocal}
              showAllResults={false}
              metrics={[graphMetric]}
              simInProgress={props.simInProgress}
              simNeedsRerun={ scenarioState.scenarioData[ scenarioState.currentScenarioId ].isDirty }
              classes={classes}
              IU={implementationUnit}
              IUData={selectedIUData}
          />
          }
        </div>

        { props.simInProgress ? <div className={classes.mdaplaceholder}><span> </span></div> : (
          <React.Fragment>
            <div className={classes.scenarioGraph}>
              <MdaRounds disease={disease} />
            </div>
            

            <Tooltip
              title={disease === DISEASE_LIMF ? "White bars show no intervention;  blue bars show intervention, the height of the blue colour shows coverage. Historic interventions before 2019 are greyed out." 
              :
              "White bars show no intervention;  blue bars show intervention, the height of the blue colour shows coverage. Historic interventions are greyed out. Use the slider to adjust interruption and when MDA is discontinued."
              }
              aria-label="info"
            >

            <Typography
              className={`${classes.scenarioGraphLegendInterventions} ${classes.withHelp}`}
              variant="h6"
              id="interventions-label"
              component="h6"
            >
              Interventions
            </Typography>
            </Tooltip>
          

          </React.Fragment>
        ) }
        <ConfirmationDialog
          title="Setting a higher precision"
          intro="A higher precision setting leads to less uncertainty in the results. However the running time for calculating the reulsts goes up and at the highest setting it can take up to a few minutes to see results. Do you want to increase the precision?"
          onClose={() => {
            setshowPrecisionConfirmation(false);
            props.resetCurrentScenario()
          }}
          onConfirm={()=>{
            setshowPrecisionConfirmation(false);
            props.runCurrentScenario()
          }}
          open={showPrecisionConfirmation}
        />
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
