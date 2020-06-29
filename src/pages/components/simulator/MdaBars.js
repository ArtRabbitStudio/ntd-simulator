import {
  Button,
  ClickAwayListener,
  FormControl,
  FormLabel,
  Paper,
  Slider,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { useStore } from "../../../store/simulatorStore";
import CloseButton from "./../CloseButton";
import useStyles from "./styles";
//setting
import {
  SettingSystematicAdherence,
  SettingTargetCoverage,
  SettingBedNetCoverage,
  SettingDrugRegimen,
} from "./settings";

//import ClickAway from "../../../hooks/clickAway";

const MdaBars = (props) => {
  console.log(props.history);
  const history = props.history;
  const { simParams, dispatchSimParams } = useStore();
  const classes = useStyles();
  const removeMDARound = () => {
    let newArray = [...simMDAactive];
    newArray[curMDARound] = false;
    setSimMDAactive([...newArray]);
    setCurMDARound(-1);
    setDoseSettingsOpen(false);
  };
  const closeRoundModal = (event) => {
    setDoseSettingsOpen(false);
    setCurMDARound(-1);
  };
  const [simInProgress, setSimInProgress] = useState(false);

  const [editingMDAs, setEditingMDAs] = useState(false);
  const [curMDARound, setCurMDARound] = useState(-1);
  const [doseSettingsOpen, setDoseSettingsOpen] = useState(false);

  const [simMDAtime, setSimMDAtime] = useState([]);
  const [simMDAcoverage, setSimMDAcoverage] = useState([]);
  const [simMDAadherence, setSimMDAadherence] = useState([]);
  const [simMDAbednets, setSimMDAbednets] = useState([]);
  const [simMDAregimen, setSimMDAregimen] = useState([]);
  const [simMDAactive, setSimMDAactive] = useState([]);

  const populatePredictionBars = () => {
    const numberOfYears = 11 * 2;
    let MDAtime = [];
    for (let i = 0; i < numberOfYears; i++) {
      MDAtime.push(6 + 6 * i);
    }
    setSimMDAtime([...MDAtime]);
    let MDAcoverage = [];
    for (let i = 0; i < numberOfYears; i++) {
      MDAcoverage.push(simParams.coverage);
    }
    setSimMDAcoverage([...MDAcoverage]);

    let MDAadherence = [];
    for (let i = 0; i < numberOfYears; i++) {
      MDAadherence.push(simParams.rho);
    }
    setSimMDAadherence([...MDAadherence]);

    let MDAbednets = [];
    for (let i = 0; i < numberOfYears; i++) {
      MDAbednets.push(simParams.covN);
    }
    setSimMDAbednets([...MDAcoverage]);
    let MDAregimen = [];
    for (let i = 0; i < numberOfYears; i++) {
      MDAregimen.push(simParams.mdaRegimen);
    }
    setSimMDAregimen([...MDAregimen]);

    let MDAactive = [];
    for (let i = 0; i < numberOfYears; i++) {
      if (simParams.mdaSixMonths === 12 && i % 2 === 1) {
        MDAactive.push(false);
      } else {
        MDAactive.push(true); // alternate here
      }
    }
    setSimMDAactive([...MDAactive]);
    // console.log(SimulatorEngine.simControler.mdaObj)
  };
  React.useEffect(() => {
    populatePredictionBars();
  }, []);
  React.useEffect(() => {
    //    dispatchSimParams({ type: "dddd", mdaObjPred });
    /*     SimulatorEngine.simControler.mdaObj.active = [...MDAactive];
    SimulatorEngine.simControler.mdaObj2015.active = [...MDAactive]; */
  }, []);

  return (
    <>
      <div className="bars">
        {/* history */}
        {history &&
          history.time &&
          history.time.map((e, i) => (
            <React.Fragment key={`bar-hist-${i}`}>
              <div
                className={`bar history`}
                title={
                  history.time[i] +
                  ", " +
                  history.coverage[i] +
                  ", " +
                  history.adherence[i] +
                  ", " +
                  history.bednets[i] +
                  ", " +
                  history.regimen[i] +
                  " "
                }
              >
                <span
                  style={{
                    height: simMDAcoverage[i],
                  }}
                ></span>
              </div>
              <div
                className={`bar history`}
                title={
                  history.time[i] +
                  ", " +
                  history.coverage[i] +
                  ", " +
                  history.adherence[i] +
                  ", " +
                  history.bednets[i] +
                  ", " +
                  history.regimen[i] +
                  " "
                }
              >
                <span
                  style={{
                    height: simMDAcoverage[i],
                  }}
                ></span>
              </div>
            </React.Fragment>
          ))}
        {/*         <div key="splitter" style={{ color: "red" }}>
          |
        </div> */}
        {/* prediction */}
        {simMDAtime.map((e, i) => (
          <div
            key={`bar-${i}`}
            onClick={(a) => {
              setCurMDARound(i);
            }}
            className={`bar ${simMDAactive[i] === false ? "removed" : ""}`}
            title={
              simMDAtime[i] +
              ", " +
              simMDAcoverage[i] +
              ", " +
              simMDAadherence[i] +
              ", " +
              simMDAbednets[i] +
              ", " +
              simMDAregimen[i] +
              ", " +
              simMDAactive[i] +
              " "
            }
          >
            <span
              className={i === curMDARound ? "current" : ""}
              style={{
                height: simMDAcoverage[i],
              }}
            ></span>

            {i === curMDARound && (
              <div className="bar-tooltip">
                {simMDAactive[curMDARound] !== false && (
                  <span className="t">{simMDAcoverage[i]}%</span>
                )}
                {simMDAactive[curMDARound] === false && (
                  <span className="t">No MDA</span>
                )}
                {simMDAactive[curMDARound] === false && (
                  <span
                    className="i plus"
                    onClick={(a) => {
                      setDoseSettingsOpen(true);
                    }}
                  ></span>
                )}
                {simMDAactive[curMDARound] !== false && (
                  <span
                    className="i edit"
                    onClick={(a) => {
                      setDoseSettingsOpen(true);
                    }}
                  ></span>
                )}
                {simMDAactive[curMDARound] !== false && (
                  <span
                    className="i remove"
                    onClick={(a) => {
                      removeMDARound();
                      a.stopPropagation();
                    }}
                  ></span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {doseSettingsOpen && (
        <ClickAwayListener onClickAway={closeRoundModal}>
          <Paper elevation={3} className={classes.roundModal}>
            <CloseButton action={closeRoundModal} />
            {simMDAactive[curMDARound] === false && (
              <Button
                className={classes.modalButton}
                variant="contained"
                color="primary"
                disabled={simInProgress}
                style={{
                  position: "absolute",
                  zIndex: 9999,
                  marginLeft: "3rem",
                  marginTop: "13rem",
                }}
                onClick={() => {
                  let newArray = [...simMDAactive];
                  newArray[curMDARound] = true;
                  setSimMDAactive([...newArray]);
                  // setCurMDARound(-1);
                  // setDoseSettingsOpen(false);
                }}
              >
                Activate
              </Button>
            )}
            <div
              style={{
                opacity: simMDAactive[curMDARound] === false ? 0.2 : 1,
              }}
            >
              <Typography className={classes.title} variant="h4" component="h4">
                {/* MDA round #  */}
                {simParams.mdaSixMonths === 6
                  ? curMDARound % 2
                    ? new Date().getFullYear() + Math.floor(curMDARound / 2)
                    : new Date().getFullYear() + curMDARound / 2
                  : new Date().getFullYear() + curMDARound}
                {curMDARound % 2 ? " - round 2" : ""}
              </Typography>

              <SettingTargetCoverage
                inModal={true}
                label="Treatment target coverage"
                classAdd="spaced"
                value={simMDAcoverage[curMDARound]}
                onChange={(event, newValue) => {
                  let newArray = [...simMDAcoverage];
                  newArray[curMDARound] = newValue;
                  setSimMDAcoverage([...newArray]);
                }}
              />

              <SettingBedNetCoverage
                inModal={true}
                label="Bed Net Coverage"
                classAdd="spaced"
                value={50} /* todo */
                onChange={(event, newValue) => {
                  console.log("todo", newValue);
                }}
              />

              <SettingDrugRegimen
                inModal={true}
                label="Drug regimen"
                classAdd="spaced"
                value={"xIA"} /* todo */
                onChange={(event, newValue) => {
                  console.log("todo", newValue);
                }}
              />

              <SettingSystematicAdherence
                inModal={true}
                label="Systematic adherence"
                classAdd="spaced"
                value={simMDAadherence[curMDARound]}
                onChange={(event, newValue) => {
                  let newArray = [...simMDAadherence];
                  newArray[curMDARound] = newValue;
                  setSimMDAadherence([...newArray]);
                }}
              />

              <div className={classes.modalButtons}>
                <Button
                  className={`${classes.modalButton} light`}
                  variant="contained"
                  disabled={simInProgress}
                  onClick={() => {
                    removeMDARound();
                  }}
                >
                  REMOVE
                </Button>
                <Button
                  className={classes.modalButton}
                  variant="contained"
                  color="primary"
                  disabled={simInProgress}
                  onClick={() => {
                    setCurMDARound(-1);
                    setDoseSettingsOpen(false);
                  }}
                >
                  UPDATE
                </Button>
              </div>
            </div>
          </Paper>
        </ClickAwayListener>
      )}
    </>
  );
};
export default MdaBars;
