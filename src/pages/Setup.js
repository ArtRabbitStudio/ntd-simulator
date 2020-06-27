import { Button, FormControl, FormLabel, MenuItem, Select, Slider, Typography, } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDataAPI, useUIState } from "../hooks/stateHooks";
import { Layout } from "../layout";
import { useStore } from "./../store/simulatorStore";
import HeadWithInputs from "./components/HeadWithInputs";
import SelectCountry from "./components/SelectCountry";
import TextContents from "./components/TextContents";
import { loadMda, loadParams } from "./components/simulator/ParamMdaLoader";

// settings
import {
  SettingName, SettingFrequency, SettingTargetCoverage, SettingDrugRegimen, SettingBasePrevalence, SettingNumberOfRuns, SettingMosquitoType,
  SettingBedNetCoverage, SettingInsecticideCoverage, SettingPrecision, SettingSystematicAdherence, SettingSpecificScenario
} from "./components/simulator/settings";

const useStyles = makeStyles((theme) => ({
  withSlider: {
    margin: theme.spacing(0, 0, 6, 0),
    whiteSpace: "nowrap",
  },
  settings: {
    position: "relative",
    padding: theme.spacing(4, 0, 0, 0),
    display: "flex",
    flexDirection: "column",

    [theme.breakpoints.up("lg")]: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
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
    backgroundColor: "white",
  },
  formControlWrap: {
    padding: theme.spacing(4),
    margin: theme.spacing(0, 0, 3, 0),
    backgroundColor: "white",

    [theme.breakpoints.up("lg")]: {
      textAlign: "center",
      float: "left",
      width: "calc(50% - 16px)",
      "&.fullwidth": {
        width: "100%",
        textAlign: "left",
      },
    },
  },
  buttonsControl: {
    margin: theme.spacing(0),
    "& > button": {
      margin: theme.spacing(0, 1, 1, 0),
    },
    [theme.breakpoints.up("md")]: {
      width: "60%",
    },
  },
  setupFormControl: {
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(0, 10, 0, 10),
    },
    [theme.breakpoints.up("lg")]: {
      maxWidth: 460,
      margin: 'auto'
      //display: "inline-block",
    },
  },
  halfFormControl: {
    [theme.breakpoints.up("lg")]: {
      width: "calc(50% - 16px)",
    },
  },
}));



const Setup = (props) => {
  const [isLoading, setIsLoading] = useState(false)

  const history = useHistory();
  const classes = useStyles();
  const { simParams, dispatchSimParams } = useStore();
  const {
    iuFeatures,
    //stateFeaturesCurrentCountry: stateFeatures,
    //stateDataCurrentCountry: stateData,
    stateScales,
  } = useDataAPI();
  const { country, implementationUnit } = useUIState();



  const doWeHaveData = simParams.IUData.IUloaded === implementationUnit;
  if (!doWeHaveData) {
    console.log('we need to load new data');
    const loadData = async () => {
      const newMdaObj = await loadMda();
      const newParams = await loadParams();
      dispatchSimParams({
        type: "IUData", payload: {
          IUloaded: implementationUnit,
          mdaObj: newMdaObj,
          params: newParams
        }
      });
      //console.log(newMdaObj);
      //console.log(newParams);
    }
    loadData();
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


  const handleAdherenceChange = (event) => {
    // todo
    //alert('todo')
  };

  const submitSetup = (event) => {
    // pass params to simulator ..
    history.push({ pathname: `/simulator/${country}/${implementationUnit}` });
  };

  //console.log(country);

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
            We hold the following information for IU Name.
            <br />
            This data will be used to initialise the simulation.
          </Typography>
        </TextContents>

        <div className={classes.charts}>
          <Typography paragraph variant="body1" component="p">
            Espen survey data
          </Typography>
          <Typography paragraph variant="body1" component="p">
            Espen intervetion data
          </Typography>
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
              <SettingBedNetCoverage inModal={false} label="Bed Net Coverage" />
            </div>
          </div>

          <div className={classes.formControlWrap}>
            <div className={classes.setupFormControl}>
              <SettingTargetCoverage inModal={false} label="Intervention target coverage" />
            </div>
          </div>

          <div className={classes.formControlWrap}>
            <div className={classes.setupFormControl}>
              <SettingFrequency inModal={false} label="Intervention Frequency" />
            </div>
          </div>

          <div className={classes.formControlWrap}>
            <div className={classes.setupFormControl}>
              <SettingDrugRegimen inModal={false} label="Intervention drug regimen" />
            </div>
          </div>

          <div className={classes.formControlWrap}>
            <div className={classes.setupFormControl}>
              <SettingMosquitoType inModal={false} label="Mosquito type" />
            </div>
          </div>

          <div className={classes.formControlWrap}>
            <div className={classes.setupFormControl}>
              <SettingInsecticideCoverage inModal={false} label="Vector: Insecticide Coverage" />
            </div>
          </div>

          <div className={`${classes.formControlWrap} fullwidth`}>
            <div className={classes.halfFormControl}>
              <div className={classes.setupFormControl}>
                <SettingSystematicAdherence inModal={false} label="Systematic adherence" value={0} onChange={handleAdherenceChange} />
              </div>
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
  );
};
export default observer(Setup);
