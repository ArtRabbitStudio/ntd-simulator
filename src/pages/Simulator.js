import {
  Box,
  Button,
  CircularProgress,
  Fab,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import ScenarioGraph from "../components/ScenarioGraph";
import { Layout } from "../layout";
import ChartSettings from "./components/ChartSettings";
import ConfirmationDialog from "./components/ConfirmationDialog";
import HeadWithInputs from "./components/HeadWithInputs";
import SelectCountry from "./components/SelectCountry";
import MdaBars from "./components/simulator/MdaBars";
import { loadMda, loadParams } from "./components/simulator/ParamMdaLoader";
import * as SimulatorEngine from "./components/simulator/SimulatorEngine";
import useStyles from "./components/simulator/styles";
import TextContents from "./components/TextContents";
import { useStore } from "./../store/simulatorStore";

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

  const [editingMDAs, setEditingMDAs] = useState(false);
  /* MDA object */
  const populateMDA = () => {
    let MDAtime = [];
    for (let i = 0; i < 40; i++) {
      MDAtime.push(6 + 6 * i);
    }
    SimulatorEngine.simControler.mdaObj.time = [...MDAtime];
    SimulatorEngine.simControler.mdaObjOrig.time = [...MDAtime];

    let MDAcoverage = [];
    for (let i = 0; i < 40; i++) {
      MDAcoverage.push(simParams.coverage);
    }
    SimulatorEngine.simControler.mdaObj.coverage = [...MDAcoverage];
    SimulatorEngine.simControler.mdaObjOrig.coverage = [...MDAcoverage];

    let MDAadherence = [];
    for (let i = 0; i < 40; i++) {
      MDAadherence.push(simParams.rho);
    }
    SimulatorEngine.simControler.mdaObj.adherence = [...MDAadherence];
    SimulatorEngine.simControler.mdaObjOrig.adherence = [...MDAadherence];

    let MDAactive = [];
    for (let i = 0; i < 40; i++) {
      if (simParams.mdaSixMonths === 12 && i % 2 === 1) {
        MDAactive.push(false);
      } else {
        MDAactive.push(true); // alternate here
      }
    }
    SimulatorEngine.simControler.mdaObj.active = [...MDAactive];
    SimulatorEngine.simControler.mdaObjOrig.active = [...MDAactive];

    console.log(
      "SimulatorEngine.simControler.mdaObj",
      SimulatorEngine.simControler.mdaObj
    );
  };
  const populateMDA4UIonly = () => {
    let MDAtime = [];
    for (let i = 0; i < 40; i++) {
      MDAtime.push(6 + 6 * i);
    }
    setSimMDAtime([...MDAtime]);
    let MDAcoverage = [];
    for (let i = 0; i < 40; i++) {
      MDAcoverage.push(simParams.coverage);
    }
    setSimMDAcoverage([...MDAcoverage]);
    let MDAadherence = [];
    for (let i = 0; i < 40; i++) {
      MDAadherence.push(simParams.rho);
    }
    setSimMDAadherence([...MDAadherence]);
    let MDAactive = [];
    for (let i = 0; i < 40; i++) {
      if (simParams.mdaSixMonths === 12 && i % 2 === 1) {
        MDAactive.push(false);
      } else {
        MDAactive.push(true); // alternate here
      }
    }
    setSimMDAactive([...MDAactive]);
    // console.log(SimulatorEngine.simControler.mdaObj)
  };
  const [graphMetric, setGraphMetric] = useState("Ms");
  const [curMDARound, setCurMDARound] = useState(-1);
  const [simMDAtime, setSimMDAtime] = useState([]);
  const [simMDAcoverage, setSimMDAcoverage] = useState([]);
  const [simMDAadherence, setSimMDAadherence] = useState([]);
  const [simMDAactive, setSimMDAactive] = useState([]);
  useEffect(() => {
    SimulatorEngine.simControler.mdaObj.time = [...simMDAtime];
    SimulatorEngine.simControler.mdaObj.coverage = [...simMDAcoverage];
    SimulatorEngine.simControler.mdaObj.adherence = [...simMDAadherence];
    SimulatorEngine.simControler.mdaObj.active = [...simMDAactive];

    SimulatorEngine.simControler.mdaObjOrig.time = [...simMDAtime];
    SimulatorEngine.simControler.mdaObjOrig.coverage = [...simMDAcoverage];
    SimulatorEngine.simControler.mdaObjOrig.adherence = [...simMDAadherence];
    SimulatorEngine.simControler.mdaObjOrig.active = [...simMDAactive];
    // console.log('MDA change', simMDAtime, simMDAcoverage, simMDAadherence)
    // console.log('mdaObjOrig', SimulatorEngine.simControler.mdaObjOrig)
  }, [simMDAtime, simMDAcoverage, simMDAadherence, simMDAactive]);

  // check for stale scenarios object in LS
  const LSSessionData = JSON.parse(window.localStorage.getItem("sessionData"));
  if (
    (LSSessionData !== null &&
      LSSessionData.scenarios &&
      LSSessionData.scenarios[0] &&
      LSSessionData.scenarios[0].mda &&
      typeof LSSessionData.scenarios[0].mdaOrig === "undefined") ||
    (LSSessionData !== null &&
      LSSessionData.scenarios &&
      LSSessionData.scenarios[0] &&
      LSSessionData.scenarios[0].mda &&
      typeof LSSessionData.scenarios[0].mdaOrig &&
      typeof LSSessionData.scenarios[0].mdaOrig.active === "undefined")
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
      setSimMDAtime(scenarioMDAs[tabIndex].time);
      setSimMDAcoverage(scenarioMDAs[tabIndex].coverage);
      setSimMDAadherence(scenarioMDAs[tabIndex].adherence);
      setSimMDAactive(scenarioMDAs[tabIndex].active);
    }
  }, [tabIndex]);

  const handlePrecisionChange = (event, newValue) => {
    // TODO
  };

  const handleCoverageChange = (event, newValue) => {
    // this used to be a special occastion. If nothing changes we can use the handleSlerChanges handler instead.
    dispatchSimParams({ type: "coverage", payload: newValue });
  };
  const handleFrequencyChange = (event) => {
    setDoseSettingsOpen(false);
    dispatchSimParams({ type: "mdaSixMonths", payload: event.target.value });
  };
  const handleSliderChanges = (newValue, paramPropertyName) => {
    dispatchSimParams({ type: paramPropertyName, payload: newValue });
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
          "JSON.parse(resultObject).mdaOrig.time,",
          JSON.parse(resultObject).mdaOrig.time
        );
        setScenarioMDAs([...scenarioMDAs, JSON.parse(resultObject).mdaOrig]);
        setSimMDAtime([...JSON.parse(resultObject).mdaOrig.time]);
        setSimMDAcoverage([...JSON.parse(resultObject).mdaOrig.coverage]);
        setSimMDAadherence([...JSON.parse(resultObject).mdaOrig.adherence]);
        setSimMDAactive([...JSON.parse(resultObject).mdaOrig.active]);
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
        const returnedMDAOrig = JSON.parse(resultObject);
        MDAsItem = {
          time: [...returnedMDAOrig.mdaOrig.time],
          coverage: [...returnedMDAOrig.mdaOrig.coverage],
          adherence: [...returnedMDAOrig.mdaOrig.adherence],
        };
        scenarioMDAsNew[correctTabIndex] = MDAsItem;
        // console.log('ccc', correctTabIndex, scenarioMDAsNew)
        setScenarioMDAs(scenarioMDAsNew);

        setSimMDAtime([...JSON.parse(resultObject).mdaOrig.time]);
        setSimMDAcoverage([...JSON.parse(resultObject).mdaOrig.coverage]);
        setSimMDAadherence([...JSON.parse(resultObject).mdaOrig.adherence]);
        setSimMDAactive([...JSON.parse(resultObject).mdaOrig.active]);
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
      SimulatorEngine.simControler.mdaObjOrig = newMdaObj;

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
      /*       setSimMDAtime(scenarioMDAs[tabIndex].time) // !!!!!!!!!! doesnt work because previous line hasn't happenned yet
            setSimMDAcoverage(scenarioMDAs[tabIndex].coverage)
            setSimMDAadherence(scenarioMDAs[tabIndex].adherence) */

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
        SimulatorEngine.simControler.mdaObjOrig = newMdaObj;

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
  const [doseSettingsOpen, setDoseSettingsOpen] = useState(false);

  const closeRoundModal = (event) => {
    setDoseSettingsOpen(false);
    setCurMDARound(-1);
  };

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
      let MDAs = scenariosArray.map((item) => item.mdaOrig);
      setScenarioInputs(paramsInputs);
      if (typeof paramsInputs[tabIndex] != "undefined") {
        // set input params if you have them
        dispatchSimParams({
          type: "everything",
          payload: paramsInputs[tabIndex],
        });
        setEditingMDAs(true);
        setScenarioMDAs(MDAs);
        setSimMDAtime(MDAs[tabIndex].time);
        setSimMDAcoverage(MDAs[tabIndex].coverage);
        setSimMDAadherence(MDAs[tabIndex].adherence);
        setSimMDAactive(MDAs[tabIndex].active);
      }
    }
  }, []);
  useEffect(() => {
    // console.log('editingMDAs', editingMDAs)
    if (scenarioResults[tabIndex]) {
      let calculNeeded =
        simParams.mdaSixMonths !==
          scenarioResults[tabIndex].params.inputs.mdaSixMonths ||
        simParams.coverage !== scenarioResults[tabIndex].params.inputs.coverage;
      console.log(
        "Shall I re-calculate MDA rounds?",
        editingMDAs && calculNeeded,
        editingMDAs,
        calculNeeded
      );
      if (calculNeeded === true) {
        setEditingMDAs(true);
      }
      if (editingMDAs && calculNeeded) {
        populateMDA4UIonly();
      } else {
        let scenariosArray = JSON.parse(
          window.localStorage.getItem("sessionData")
        )
          ? JSON.parse(window.localStorage.getItem("sessionData")).scenarios
          : null;
        // console.log('scenariosArray', scenariosArray)
        if (scenariosArray) {
          let paramsInputs = scenariosArray.map((item) => item.params.inputs);
          let MDAs = scenariosArray.map((item) => item.mdaOrig);
          setScenarioInputs(paramsInputs);
          if (typeof paramsInputs[tabIndex] != "undefined") {
            // set input params if you have them
            dispatchSimParams({
              type: "everything",
              payload: paramsInputs[tabIndex],
            });
            setEditingMDAs(true);
            setScenarioMDAs(MDAs);
            setSimMDAtime(MDAs[tabIndex].time);
            setSimMDAcoverage(MDAs[tabIndex].coverage);
            setSimMDAadherence(MDAs[tabIndex].adherence);
            setSimMDAactive(MDAs[tabIndex].active);
          }
        }
      }
    }
  }, [simParams.mdaSixMonths, simParams.coverage]);

  /*   useEffect(() => {
      console.log('change of editingMDAs', editingMDAs)
    }, [editingMDAs]) */
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
                    <Typography
                      className={classes.chartTitle}
                      variant="h3"
                      component="h2"
                    >
                      {`Scenario ${i + 1}`}
                    </Typography>

                    <FormControl className={classes.formControlChart}>
                      <FormLabel component="legend" htmlFor="precision">
                        Precision
                      </FormLabel>
                      <Slider
                        value={5}
                        min={1}
                        step={1}
                        max={10}
                        onChange={handlePrecisionChange}
                        aria-labelledby="slider"
                        valueLabelDisplay="auto"
                      />
                    </FormControl>

                    <FormControl
                      variant="outlined"
                      className={classes.formControlChart}
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
                        inputs={simMDAcoverage}
                        showAllResults={false}
                        metrics={[graphMetric]}
                        simInProgress={simInProgress}
                      />
                    </div>
                    {scenarioMDAs[0] && <MdaBars data={scenarioMDAs[0]} />}
                  </div>
                </div>
              </TabPanel>
            ))}

            <Fab
              color="inherit"
              aria-label="REMOVE SCENARIO"
              disabled={simInProgress || scenarioResults.length === 0}
              className={classes.icon}
              onClick={confirmRemoveCurrentScenario}
            ></Fab>

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

            <ChartSettings
              title="Edit scenario"
              buttonText="Update Scenario"
              action={runCurrentScenario}
              onOpen={closeRoundModal}
            >
              <TextContents>
                <Typography paragraph variant="body1" component="p">
                  What scenario do you want to simulate?
                </Typography>
              </TextContents>

              <FormControl
                fullWidth
                variant="outlined"
                className={classes.formControlText}
              >
                <TextField id="scenario-name" label="Scenario name" />
              </FormControl>

              <FormControl
                fullWidth
                variant="outlined"
                className={classes.formControl}
              >
                <FormLabel component="legend">Frequency</FormLabel>
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
              <FormControl fullWidth className={classes.formControl}>
                <FormLabel component="legend" htmlFor="coverage">
                  Target coverage
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
                  valueLabelDisplay="auto"
                />
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
                  Drug regimen
                </FormLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={simParams.mdaRegimen}
                  onChange={(event) => {
                    dispatchSimParams({
                      type: "mdaRegimen",
                      payload: event.target.value,
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

              <FormControl fullWidth className={classes.formControl}>
                <FormLabel
                  component="legend"
                  htmlFor="endemicity"
                  className={classes.withSlider}
                >
                  Base prevalence
                </FormLabel>
                <Slider
                  value={simParams.endemicity}
                  id="endemicity"
                  min={5}
                  step={0.5}
                  max={18}
                  onChange={(event, newValue) => {
                    handleSliderChanges(newValue, "endemicity");
                  }}
                  aria-labelledby="slider"
                  marks={[
                    { value: 5, label: "5%" },
                    { value: 18, label: "18%" },
                  ]}
                  valueLabelDisplay="auto"
                />
                {/*             <p style={{ marginBottom: 0 }}>
              The mf prevalence in the population before intervention occurs.
              Due to the stochastic nature of the model this is a prevalence
              averaged over many independent runs and so should be treated as an
              approximation only.{' '}
            </p> */}
              </FormControl>
              <FormControl fullWidth className={classes.formControl}>
                <FormLabel
                  component="legend"
                  htmlFor="runs"
                  className={classes.withSlider}
                >
                  Number of runs
                </FormLabel>
                <Slider
                  value={simParams.runs}
                  min={1}
                  step={1}
                  max={100}
                  onChange={(event, newValue) => {
                    handleSliderChanges(newValue, "runs");
                  }}
                  aria-labelledby="slider"
                  marks={[
                    { value: 0, label: "0" },
                    { value: 100, label: "100" },
                  ]}
                  valueLabelDisplay="auto"
                />
              </FormControl>
              <FormControl fullWidth className={classes.formControlSelect}>
                <FormLabel component="legend">Type of mosquito</FormLabel>
                <RadioGroup
                  className={classes.imageOptions}
                  row
                  aria-label="Species"
                  name="species"
                  value={simParams.species}
                  onChange={(event) => {
                    dispatchSimParams({
                      type: "species",
                      payload: Number(event.target.value),
                    });
                  }}
                >
                  <FormControlLabel
                    className={`${classes.imageOption} anopheles`}
                    value={0}
                    control={<Radio color="primary" />}
                    label="Anopheles"
                  />
                  <FormControlLabel
                    className={`${classes.imageOption} culex`}
                    value={1}
                    control={<Radio color="primary" />}
                    label="Culex"
                  />
                </RadioGroup>
              </FormControl>
              <FormControl fullWidth className={classes.formControl}>
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
                  valueLabelDisplay="auto"
                />
                {/*             <p style={{ marginBottom: 0 }}>
              Bed nets are assumed to have been distributed at the start of
              intervention and are assumed to be effective for the entire
              lifetime of the intervention campaign.
            </p> */}
              </FormControl>
              <FormControl fullWidth>
                <FormLabel
                  component="legend"
                  htmlFor="v_to_hR"
                  className={classes.withSlider}
                >
                  Vector: Insecticide Coverage (%)
                </FormLabel>
                <Slider
                  value={simParams.v_to_hR}
                  id="v_to_hR"
                  min={1}
                  step={1}
                  max={100}
                  onChange={(event, newValue) => {
                    handleSliderChanges(newValue, "v_to_hR");
                  }}
                  aria-labelledby="slider"
                  marks={[
                    { value: 0, label: "0" },
                    { value: 100, label: "100" },
                  ]}
                  valueLabelDisplay="auto"
                />
                {/*             <p style={{ marginBottom: 0 }}>
              Insecticide is assumed to reduce the vector to host ratio only.
            </p> */}
              </FormControl>
            </ChartSettings>
          </Grid>
        </Grid>
      </section>
    </Layout>
  );
};
export default Simulator;
