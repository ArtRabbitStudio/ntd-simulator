import {
  Box, Button, CircularProgress, Fab, FormControl, Grid, MenuItem, Select, Tab, Tabs, Typography
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import ScenarioGraph from "../components/ScenarioGraph";
import { Layout } from "../layout";
import { useStore } from "./../store/simulatorStore";
import ChartSettings from "./components/ChartSettings";
import ConfirmationDialog from "./components/ConfirmationDialog";
import HeadWithInputs from "./components/HeadWithInputs";
import SelectCountry from "./components/SelectCountry";
import MdaBars from "./components/simulator/MdaBars";
import { loadMda, loadParams } from "./components/simulator/ParamMdaLoader";
import * as SimulatorEngine from "./components/simulator/SimulatorEngine";
import useStyles from "./components/simulator/styles";
import TextContents from "./components/TextContents";

// settings
import {
  SettingName, SettingFrequency, SettingTargetCoverage, SettingDrugRegimen, SettingBasePrevalence, SettingNumberOfRuns, SettingMosquitoType,
  SettingBedNetCoverage, SettingInsecticideCoverage, SettingPrecision, SettingSystematicAdherence, SettingSpecificScenario
} from "./components/simulator/settings";


SimulatorEngine.simControler.documentReady();

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

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
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

let countryLinks = [];

const Simulator = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const { simParams, dispatchSimParams } = useStore();

  /* MDA object */
  const [graphMetric, setGraphMetric] = useState("Ms");

  // check for stale scenarios object in LS
  const LSSessionData = JSON.parse(window.localStorage.getItem("sessionData"));
  if (
    (LSSessionData !== null &&
      LSSessionData.scenarios &&
      LSSessionData.scenarios[0] &&
      LSSessionData.scenarios[0].mda &&
      typeof LSSessionData.scenarios[0].mda2015 === "undefined") ||
    (LSSessionData !== null &&
      LSSessionData.scenarios &&
      LSSessionData.scenarios[0] &&
      LSSessionData.scenarios[0].mda &&
      typeof LSSessionData.scenarios[0].mda2015 &&
      typeof LSSessionData.scenarios[0].mda2015.active === "undefined")
  ) {
    // clear LS and relaod if stale project is found
    window.localStorage.removeItem("sessionData");
    window.localStorage.removeItem("scenarioIndex");
    console.log("reloading");
    window.location.reload();
  }

  /* Simuilation, tabs etc */
  const [simInProgress, setSimInProgress] = useState(false);
  // console.log(parseInt(window.localStorage.getItem('scenarioIndex')))
  // console.log(parseInt(window.localStorage.getItem('scenarioIndex')) + 1)
  // console.log(window.localStorage.getItem('sessionData'))
  const [tabLength, setTabLength] = useState(
    JSON.parse(window.localStorage.getItem("sessionData")) === null
      ? 0
      : JSON.parse(window.localStorage.getItem("sessionData")).scenarios.length
  );
  const [tabIndex, setTabIndex] = useState(
    JSON.parse(window.localStorage.getItem("scenarioIndex")) || 0
  );
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  useEffect(() => {
    //    console.log('tab updated', tabIndex)
    //    console.log(scenarioInputs[tabIndex])
    if (typeof scenarioInputs[tabIndex] != "undefined") {
      // set input arams if you have them
      dispatchSimParams({
        type: "everything",
        payload: scenarioInputs[tabIndex],
      });
      SimulatorEngine.ScenarioIndex.setIndex(tabIndex);
    }
  }, [tabIndex]);

  const handleAdherenceChange = (event) => {
    // todo
  };

  const [simulationProgress, setSimulationProgress] = useState(0);
  const [scenarioInputs, setScenarioInputs] = useState([]);
  const [scenarioResults, setScenarioResults] = useState(
    window.localStorage.getItem("sessionData")
      ? JSON.parse(window.localStorage.getItem("sessionData")).scenarios
      : []
  );
  const [scenarioMDAs, setScenarioMDAs] = useState([]);

  const simulatorCallback = (resultObject, newScenario) => {
    if (typeof resultObject == "number") {
      setSimulationProgress(resultObject);
    } else {
      console.log("Simulation returned results!");

      if (typeof scenarioResults[tabIndex] === "undefined") {
        //console.log('scenarioResults',resultObject)
        setScenarioResults([...scenarioResults, JSON.parse(resultObject)]);
        setScenarioInputs([
          ...scenarioInputs,
          JSON.parse(resultObject).params.inputs,
        ]);
        console.log(
          "JSON.parse(resultObject).mda2015.time,",
          JSON.parse(resultObject).mda2015.time
        );
        setScenarioMDAs([...scenarioMDAs, JSON.parse(resultObject).mda2015]);
      } else {
        let correctTabIndex = newScenario === true ? tabIndex + 1 : tabIndex;
        //console.log('scenarioResults',resultObject)
        let scenarioResultsNew = [...scenarioResults]; // 1. Make a shallow copy of the items
        let resultItem = scenarioResultsNew[correctTabIndex]; // 2. Make a shallow copy of the resultItem you want to mutate
        resultItem = JSON.parse(resultObject); // 3. Replace the property you're intested in
        scenarioResultsNew[correctTabIndex] = resultItem; // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
        setScenarioResults(scenarioResultsNew); // 5. Set the state to our new copy

        let scenarioInputsNew = [...scenarioInputs];
        let inputsItem = scenarioInputsNew[correctTabIndex];
        inputsItem = JSON.parse(resultObject).params.inputs;
        scenarioInputsNew[correctTabIndex] = inputsItem;
        setScenarioInputs(scenarioInputsNew);

        let scenarioMDAsNew = [...scenarioMDAs];
        let MDAsItem = scenarioMDAsNew[correctTabIndex];
        const returnedmda2015 = JSON.parse(resultObject);
        MDAsItem = {
          time: [...returnedmda2015.mda2015.time],
          coverage: [...returnedmda2015.mda2015.coverage],
          adherence: [...returnedmda2015.mda2015.adherence],
          bednets: [...returnedmda2015.mda2015.bednets],
          regimen: [...returnedmda2015.mda2015.regimen],
        };
        scenarioMDAsNew[correctTabIndex] = MDAsItem;
        // console.log('ccc', correctTabIndex, scenarioMDAsNew)
        setScenarioMDAs(scenarioMDAsNew);
      }
      setSimInProgress(false);
      // console.log('newScenario', newScenario)
      if (newScenario === true) {
        setTabLength(tabLength + 1);
        setTabIndex(tabLength > 5 ? 4 : tabLength);
      }
    }
  };
  /*   useEffect(() => {
      console.log('scenarioInputs', scenarioInputs)
    }, [scenarioInputs]) */
  const runCurrentScenario = async () => {
    if (!simInProgress) {
      setSimInProgress(true);
      //console.log(tabIndex, simParams)
      // populate mdaObj // populateMDA();
      const newMdaObj = await loadMda();
      SimulatorEngine.simControler.mdaObj = newMdaObj;
      const yearsToLeaveOut = 14;
      let newMdaObj2015 = {
        time: newMdaObj.time.filter(function (value, index, arr) {
          return index > yearsToLeaveOut;
        }),
        coverage: newMdaObj.coverage.filter(function (value, index, arr) {
          return index > yearsToLeaveOut;
        }),
        adherence: newMdaObj.adherence.filter(function (value, index, arr) {
          return index > yearsToLeaveOut;
        }),
        bednets: newMdaObj.bednets.filter(function (value, index, arr) {
          return index > yearsToLeaveOut;
        }),
        regimen: newMdaObj.regimen.filter(function (value, index, arr) {
          return index > yearsToLeaveOut;
        }),
        active: newMdaObj.active.filter(function (value, index, arr) {
          return index > yearsToLeaveOut;
        }),
      };
      SimulatorEngine.simControler.mdaObj2015 = newMdaObj2015;

      const newParams = await loadParams();
      SimulatorEngine.simControler.parametersJSON = newParams;
      console.log("runningScenario");

      SimulatorEngine.simControler.newScenario = false;
      SimulatorEngine.simControler.runScenario(
        simParams,
        tabIndex,
        simulatorCallback
      );
    }
  };

  const removeCurrentScenario = () => {
    if (!simInProgress) {
      // alert('todo')

      SimulatorEngine.SessionData.deleteScenario(tabIndex);
      //console.log(scenarioResults)
      //console.log(scenarioResults[tabIndex])

      let newScenarios = [...scenarioResults];
      newScenarios = newScenarios.filter(
        (item) => item !== scenarioResults[tabIndex]
      );
      setScenarioResults([...newScenarios]);

      let newScenarioInputs = [...scenarioInputs];
      newScenarioInputs = newScenarioInputs.filter(
        (item) => item !== scenarioInputs[tabIndex]
      );
      setScenarioInputs([...newScenarioInputs]);

      let newScenarioMDAs = [...scenarioMDAs];
      newScenarioMDAs = newScenarioMDAs.filter(
        (item) => item !== scenarioMDAs[tabIndex]
      );
      setScenarioMDAs(newScenarioMDAs);

      setTabLength(tabLength >= 1 ? tabLength - 1 : 0);
      setTabIndex(tabIndex >= 1 ? tabIndex - 1 : 0);
    }
  };

  // confirmation for remove scenario
  const [confirmatonOpen, setConfirmatonOpen] = useState(false);
  const confirmRemoveCurrentScenario = () => {
    if (!simInProgress) {
      setConfirmatonOpen(true);
    }
  };
  const confirmedRemoveCurrentScenario = () => {
    if (!simInProgress) {
      setConfirmatonOpen(false);
      removeCurrentScenario();
    }
  };

  const runNewScenario = async () => {
    if (!simInProgress) {
      if (tabLength < 5) {
        // populateMDA();
        setSimInProgress(true);
        // console.log('settingTabLength', tabLength + 1)
        //console.log(tabIndex, simParams)

        // populate mdaObj // populateMDA();
        const newMdaObj = await loadMda();
        SimulatorEngine.simControler.mdaObj = newMdaObj;

        const yearsToLeaveOut = 14;
        let newMdaObj2015 = {
          time: newMdaObj.time.filter(function (value, index, arr) {
            return index > yearsToLeaveOut;
          }),
          coverage: newMdaObj.coverage.filter(function (value, index, arr) {
            return index > yearsToLeaveOut;
          }),
          adherence: newMdaObj.adherence.filter(function (value, index, arr) {
            return index > yearsToLeaveOut;
          }),
          bednets: newMdaObj.bednets.filter(function (value, index, arr) {
            return index > yearsToLeaveOut;
          }),
          regimen: newMdaObj.regimen.filter(function (value, index, arr) {
            return index > yearsToLeaveOut;
          }),
          active: newMdaObj.active.filter(function (value, index, arr) {
            return index > yearsToLeaveOut;
          }),
        };
        SimulatorEngine.simControler.mdaObj2015 = newMdaObj2015;

        const newParams = await loadParams();
        SimulatorEngine.simControler.parametersJSON = newParams;
        console.log("runningScenario");

        SimulatorEngine.simControler.newScenario = true;
        SimulatorEngine.simControler.runScenario(
          simParams,
          tabLength,
          simulatorCallback
        );
        //        console.log(tabLength)
      } else {
        alert("Sorry maximum number of Scenarios is 5.");
      }
    }
  };
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const basePrevalance = urlParams.get("base_prev"); // endemicity from URL
  const country = urlParams.get("country");

  useEffect(() => {
    if (basePrevalance)
      dispatchSimParams({
        type: "endemicity",
        payload: parseInt(basePrevalance),
      });
    // console.log(simParams)
  }, [basePrevalance]);

  useEffect(() => {
    if (country)
      countryLinks = [
        {
          to: "/trends/" + country,
          name:
            "TRENDS " +
            (urlParams.get("name") ? urlParams.get("name") : country),
        },
        {
          to: "/hotspots/" + country,
          name:
            "HOTSPOTS " +
            (urlParams.get("name") ? urlParams.get("name") : country),
        },
      ];
    //console.log(countryLinks)
  }, [country]);

  useEffect(() => {
    if (typeof scenarioResults[tabIndex] === "undefined") {
      console.log("No scenarios? Running a new one...");
      runNewScenario();
    }
    /* let sessionDataJson =
          JSON.parse(window.localStorage.getItem('scenarios')) || [] */
    let scenariosArray = JSON.parse(window.localStorage.getItem("sessionData"))
      ? JSON.parse(window.localStorage.getItem("sessionData")).scenarios
      : null;
    // console.log('scenariosArray', scenariosArray)
    if (scenariosArray) {
      let paramsInputs = scenariosArray.map((item) => item.params.inputs);
      let MDAs = scenariosArray.map((item) => item.mda2015);
      setScenarioInputs(paramsInputs);
      if (typeof paramsInputs[tabIndex] != "undefined") {
        // set input params if you have them
        dispatchSimParams({
          type: "everything",
          payload: paramsInputs[tabIndex],
        });
        setScenarioMDAs(MDAs);
      }
    }
  }, []);
  return (
    <Layout>
      <HeadWithInputs title="prevalence simulator" />
      {/*       {props.location.search}
      {window.location.search} */}
      {simParams.coverage}

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
                  label={`Scenario ${i + 1}`}
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
                      <Grid item md={6} xs={12} >
                        <Typography
                          className={classes.chartTitle}
                          variant="h3"
                          component="h2"
                        >
                          {`Scenario ${i + 1}`}
                        </Typography>
                        <SettingPrecision classAdd={classes.precision} label="Precision" />
                      </Grid>
                      <Grid item md={6} xs={12} >
                        <div className={classes.rightControls}>
                          <Fab
                            color="inherit"
                            aria-label="REMOVE SCENARIO"
                            disabled={simInProgress || scenarioResults.length === 0}
                            className={classes.removeIcon}
                            onClick={confirmRemoveCurrentScenario}
                          ></Fab>

                          <ChartSettings
                            title="Edit scenario"
                            buttonText="Update Scenario"
                            action={runCurrentScenario}
                          >
                            <TextContents>
                              <Typography paragraph variant="body1" component="p">
                                What scenario do you want to simulate?
                            </Typography>
                            </TextContents>

                            <SettingName inModal={true} label="Scenario name" />
                            <SettingBedNetCoverage inModal={true} label="Bed Net Coverage" />
                            <SettingFrequency inModal={true} label="Treatment frequency" />
                            <SettingDrugRegimen inModal={true} label="Drug regimen" />
                            <SettingTargetCoverage inModal={true} label="Treatment target coverage" />
                            <SettingSystematicAdherence inModal={true} label="Systematic adherence" value={0} onChange={handleAdherenceChange} />
                            { /* no longer in use <SettingBasePrevalence inModal={true} label="Base prevalence" /> */}
                            { /* no longer in use <SettingNumberOfRuns inModal={true} label="Number of runs" /> */}
                            <SettingInsecticideCoverage inModal={true} label="Vector: Insecticide Coverage" />
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
                              onChange={(ev) => {
                                // console.log(ev.target.value)
                                setGraphMetric(ev.target.value);
                              }}
                            >
                              <MenuItem value={"Ms"}>
                                Prevalence mirofilerima
                        </MenuItem>
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
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.updateScenario}
                        disabled={
                          simInProgress || scenarioResults.length === 0
                        } /*  || scenarioInputs.length === 0 */
                        onClick={runCurrentScenario}
                      >
                        UPDATE SCENARIO
                      </Button>

                      <ScenarioGraph
                        data={result}
                        showAllResults={false}
                        metrics={[graphMetric]}
                        simInProgress={simInProgress}
                      />
                    </div>
                    {scenarioMDAs[tabIndex] && (
                      <MdaBars history={scenarioMDAs[tabIndex]} />
                    )}
                  </div>
                </div>
              </TabPanel>
            ))}



            <ConfirmationDialog
              title="Do you want to delete this scenario?"
              onClose={() => {
                setConfirmatonOpen(false);
              }}
              onConfirm={confirmedRemoveCurrentScenario}
              open={confirmatonOpen}
            />

            {simulationProgress !== 0 && simulationProgress !== 100 && (
              <div className={classes.progress}>
                <CircularProgress
                  variant="determinate"
                  value={simulationProgress}
                  color="secondary"
                />
                <span>{simulationProgress}%</span>
              </div>
            )}

          </Grid>
        </Grid>
      </section>
    </Layout>
  );
};
export default Simulator;
