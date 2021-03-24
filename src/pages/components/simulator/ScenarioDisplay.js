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
import { useTranslation } from 'react-i18next';

import AppConstants from 'AppConstants';

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
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const { disease } = useUIState();

  const defaultMetric = AppConstants.DISEASE_CONFIG[disease] ? AppConstants.DISEASE_CONFIG[disease].defaultMetric : 'Ms'

  const [graphMetric, setGraphMetric] = useState(defaultMetric)
  const [graphTypeSimpleLocal, setGraphTypeSimpleLocal] = useState(true)
  const [showPrecisionConfirmation, setshowPrecisionConfirmation] = useState(false)
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


  const diseaseModel = DiseaseModels[disease];

  // 2nd-arg empty array makes this a componentDidMount equivalent - only re-run if {nothing} changes
  useEffect(

    () => {
      if (diseaseModel && diseaseModel.documentReady) {
        console.log(`ScenarioDisplay calling diseaseModel.documentReady for disease ${disease}`);
        diseaseModel.documentReady();
      }
    },

    // eslint-disable-next-line
    []

  );


  const scenarioId = scenarioState.currentScenarioId;
  const scenarioData = scenarioState.scenarioData[scenarioId];
  const STH = (![AppConstants.DISEASE_LIMF, AppConstants.DISEASE_TRACHOMA].includes(disease));

  const scenarioDisplay = scenarioData ? (

    <div className={classes.simulatorBody}>

      <div className={classes.simulatorInnerBody}>

        <Grid container spacing={0} className={classes.controlsRow}>
          <Grid item md={6} xs={12} className={classes.leftControls}>
            <Typography
              className={classes.chartTitle}
              variant="h3"
              component="h2"
            >
              {scenarioData.label}
            </Typography>

            <Fab
              color="inherit"
              aria-label="DOWNLOAD SCENARIO"
              disabled={props.simInProgress || props.scenarioKeys.length === 0}
              className={classes.downloadIcon}
              onClick={() => alert('todo')}
            >
              &nbsp;
              </Fab>

            <Fab
              color="inherit"
              aria-label="PRINT SCENARIO"
              disabled={props.simInProgress || props.scenarioKeys.length === 0}
              className={classes.printIcon}
              onClick={() => alert('todo')}
            >
              &nbsp;
              </Fab>
          </Grid>

          <Grid item md={6} xs={12} className={classes.rightControls}>


            <Typography className={`${classes.caps} closer`} variant="h6" component="h6">
              Settings
            </Typography>

            <ChartSettings
              title={t('editScenario')}
              buttonText={t('updateScenario')}
              cancelText={t('cancelChanges')}
              cancel={props.resetCurrentScenario}
              action={props.runCurrentScenario}
              hideFab={false}
            >
              <TextContents>
                <Typography paragraph variant="body1" component="p">
                  {t('simulate')}
                </Typography>
              </TextContents>

              <SettingName
                inModal={true}
                label={t('scenarioName')}
                scenarioId={scenarioId}
                scenarioLabel={scenarioData.label}
              />

              {disease === AppConstants.DISEASE_LIMF &&
                <SettingBedNetCoverage
                  inModal={true}
                  label={t('bedNetCoverage')}
                />
              }

              <SettingFrequency inModal={true} label={t('treatmentFrequency')} disease={disease} />

              {disease === AppConstants.DISEASE_LIMF &&
                <SettingDrugRegimen inModal={true} label={t('drugRegimen')} />
              }

              {disease === AppConstants.DISEASE_LIMF &&
                <SettingTargetCoverage
                  scenarioId={scenarioData.id}
                  inModal={true}
                  label={t('treatmentTargetCoverage')}
                />
              }
              {disease === AppConstants.DISEASE_TRACHOMA &&
                <SettingTargetCoverage
                  inModal={true}
                  scenarioId={scenarioData.id}
                  min={60}
                  max={90}
                  step={10}
                  label={t('treatmentTargetCoverage')}
                />
              }

              {STH &&
                <Fragment>
                  <SettingTargetCoverage
                    scenarioId={scenarioData.id}
                    inModal={true}
                    label={t('MDACoverageInfants')}
                    min={0}
                    max={100}
                    step={5}
                    valueKey="coverageInfants"
                    title={t('InfantsTitle')}
                  />

                  <SettingTargetCoverage
                    scenarioId={scenarioData.id}
                    inModal={true}
                    label={t('MDACoveragePreschool')}
                    min={0}
                    max={100}
                    step={5}
                    valueKey="coveragePreSAC"
                    title={t('PreschoolTitle')}
                  />

                  <SettingTargetCoverage
                    scenarioId={scenarioData.id}
                    inModal={true}
                    label={t('MDACoverageSchoolAge')}
                    min={0}
                    max={100}
                    step={5}
                    valueKey="coverageSAC"
                    title={t('SchoolAgeTitle')}
                  />

                  <SettingTargetCoverage
                    scenarioId={scenarioData.id}
                    inModal={true}
                    label={t('MDACoverageAdults')}
                    min={0}
                    max={100}
                    step={5}
                    valueKey="coverageAdults"
                    title={t('AdultsTitle')}
                  />
                </Fragment>


              }

              {disease === AppConstants.DISEASE_LIMF &&
                <SettingSystematicAdherence
                  inModal={true}
                  label={t('systematicAdherence')}
                />
              }

              {disease === AppConstants.DISEASE_LIMF &&
                <SettingInsecticideCoverage
                  inModal={true}
                  label={t('insecticideCoverage')}
                />
              }

              {disease === AppConstants.DISEASE_LIMF &&
                <SettingMosquitoType
                  inModal={true}
                  label={t('mosquitoType')}
                />
              }

              <TextContents>
                <Typography paragraph variant="body1" component="p">
                  {t('specific')} {scenarioState.scenarioData[scenarioState.currentScenarioId].specificPredictionIndex}
                </Typography>
              </TextContents>

              <SettingSpecificScenario inModal={true} />

            </ChartSettings>

            <Fab
              color="inherit"
              aria-label="REMOVE SCENARIO"
              disabled={props.simInProgress || props.scenarioKeys.length === 0}
              className={classes.removeIcon}
              onClick={props.confirmRemoveCurrentScenario}
            >
              &nbsp;
              </Fab>

          </Grid>
        </Grid>
        <Grid container spacing={0} className={classes.controlsRow}>
          <Grid item md={4} xs={12} className={classes.leftControls}>

            {((disease === AppConstants.DISEASE_TRACHOMA) || (disease === AppConstants.DISEASE_LIMF || STH)) &&
              <SettingPrecision
                classAdd={classes.precision}
                inModal={true}
                showPrecisionSlider={true}
                label={t('precision')}
                setGraphTypeSimple={handleGraphTypeChange}
                graphTypeSimple={graphTypeSimpleLocal}
                showDialog={setshowPrecisionConfirmation}
              />

            }
          </Grid>
          <Grid item md={4} xs={12} className={classes.centerControls}>
            {((disease === AppConstants.DISEASE_TRACHOMA) || (disease === AppConstants.DISEASE_LIMF || STH)) &&
              <React.Fragment>
                <Fab
                  color="inherit"
                  aria-label="SET GRAPH TYPE"
                  disabled={false}
                  className={graphTypeSimpleLocal ? classes.graphTypeIconSimple : classes.graphTypeIconComplex}
                  onClick={handleGraphTypeChange}
                >
                </Fab>
                <Typography className={classes.caps} variant="h6" component="h6">
                  {t('ShowAllRuns')}
                </Typography>
              </React.Fragment>
            }
          </Grid>

          <Grid item md={4} xs={12} className={classes.rightControls}>


            {disease === AppConstants.DISEASE_LIMF && (
              <React.Fragment>
                <Typography className={classes.caps} variant="h6" component="h6">
                  {t('Show')}
                </Typography>
                <FormControl
                  variant="outlined"
                  className={`${classes.formControlPrevalence} ${classes.metricSelector}`}
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
                    <MenuItem value={"Ms"}>{t('prevalence1')}</MenuItem>
                    <MenuItem value={"Ls"}>{t('prevalence2')}</MenuItem>
                    <MenuItem value={"Ws"}>{t('prevalence3')}</MenuItem>
                  </Select>
                </FormControl>
              </React.Fragment>
            )}
            {STH && (
              <React.Fragment>
                <Typography className={classes.caps} variant="h6" component="h6">
                  {t('Show')}
                </Typography>
                <FormControl
                  variant="outlined"
                  className={`${classes.formControlPrevalence} ${classes.metricSelector}`}
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
                    <MenuItem value={"KK"}>{t('prevalence4')}</MenuItem>
                    <MenuItem value={"MHI"}>{t('prevalence5')}</MenuItem>
                  </Select>
                </FormControl>
              </React.Fragment>
            )}
          </Grid>
        </Grid>

        { /* this is the update button that pops up after a precision or MDA change */}
        <div className={classes.scenarioGraph}>
          {scenarioState.scenarioData[scenarioState.currentScenarioId].isDirty && (
            <div className={classes.updateScenario}>
              <Button
                variant="contained"
                color="primary"
                disabled={
                  props.simInProgress || props.scenarioKeys.length === 0
                }
                onClick={props.runCurrentScenario}
              >
                {t('updateScenario')}
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

          {disease === AppConstants.DISEASE_LIMF &&

            <ScenarioGraphLF
              data={scenarioData}
              graphTypeSimple={graphTypeSimpleLocal}
              showAllResults={false}
              metrics={[graphMetric]}
              simInProgress={props.simInProgress}
              simNeedsRerun={scenarioState.scenarioData[scenarioState.currentScenarioId].isDirty}
              classes={classes}
              IU={implementationUnit}
              IUData={selectedIUData}
            />

          }
          {disease === AppConstants.DISEASE_TRACHOMA &&

            <ScenarioGraphTrachoma
              data={scenarioData}
              graphTypeSimple={graphTypeSimpleLocal}
              showAllResults={false}
              simInProgress={props.simInProgress}
              simNeedsRerun={scenarioState.scenarioData[scenarioState.currentScenarioId].isDirty}
              classes={classes}
              IU={implementationUnit}
              IUData={selectedIUData}
            />
          }

          {STH &&

            <ScenarioGraphSTHRoundworm
              data={scenarioData}
              graphTypeSimple={graphTypeSimpleLocal}
              showAllResults={false}
              metrics={[graphMetric]}
              simInProgress={props.simInProgress}
              simNeedsRerun={scenarioState.scenarioData[scenarioState.currentScenarioId].isDirty}
              classes={classes}
              IU={implementationUnit}
              IUData={selectedIUData}
              disease={disease}
            />
          }
        </div>

        {props.simInProgress ? <div className={classes.mdaplaceholder}><span> </span></div> : (
          <React.Fragment>
            <div className={classes.scenarioGraph}>
              <MdaRounds disease={disease} />
            </div>


            <Tooltip
              title={AppConstants.DISEASE_CONFIG[disease].mdaTooltip}
              aria-label="info"
            >

              <Typography
                className={`${classes.scenarioGraphLegendInterventions} ${classes.withHelp}`}
                variant="h6"
                id="interventions-label"
                component="h6"
              >
                {t('interventions')}
              </Typography>
            </Tooltip>


          </React.Fragment>
        )}
        <ConfirmationDialog
          title={t('higherPrecision')}
          intro={t('increasingPrecision')}
          onClose={() => {
            setshowPrecisionConfirmation(false);
            props.resetCurrentScenario()
          }}
          onConfirm={() => {
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
      { scenarioDisplay}
    </div>
  );
}

export default observer(ScenarioDisplay);
