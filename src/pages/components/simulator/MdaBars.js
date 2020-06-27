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
    const numberOfYears = 11;
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

  return (
    <>
      <div className="bars">
        {/* history */}
        {history &&
          history.time &&
          history.time.map((e, i) => (
            <div
              key={`bar-hist-${i}`}
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
          ))}
        <div key="splitter" style={{ color: "red" }}>
          |
        </div>
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
              <Typography className={classes.title} variant="h5" component="h4">
                {/* MDA round #  */}
                {simParams.mdaSixMonths === 6
                  ? curMDARound % 2
                    ? new Date().getFullYear() + Math.floor(curMDARound / 2)
                    : new Date().getFullYear() + curMDARound / 2
                  : new Date().getFullYear() + curMDARound}
                {curMDARound % 2 ? " (2nd round)" : ""}
              </Typography>
              <FormControl fullWidth className={classes.formControl}>
                <FormLabel
                  component="legend"
                  htmlFor="rho"
                  className={classes.withSlider}
                >
                  Coverage
                </FormLabel>
                <Slider
                  value={simMDAcoverage[curMDARound]}
                  min={1}
                  step={1}
                  max={100}
                  onChange={(event, newValue) => {
                    let newArray = [...simMDAcoverage];
                    newArray[curMDARound] = newValue;
                    setSimMDAcoverage([...newArray]);
                  }}
                  aria-labelledby="slider"
                  marks={[
                    { value: 0, label: "0" },
                    { value: 100, label: "100" },
                  ]}
                  valueLabelDisplay="auto"
                />
                {/*             <p style={{ marginBottom: 0 }}>
        Controls how randomly coverage is applied. For 0, coverage is
        completely random. For 1, the same individuals are always treated.
        </p> */}
              </FormControl>
              <FormControl fullWidth className={classes.formControl}>
                <Tooltip
                  title="Controls how randomly coverage is applied. For 0, coverage is completely random. For 1, the same individuals are always treated."
                  aria-label="info"
                >
                  <FormLabel
                    component="legend"
                    htmlFor="rho"
                    className={`${classes.withSlider} ${classes.withHelp}`}
                  >
                    Systematic adherence
                  </FormLabel>
                </Tooltip>
                <Slider
                  value={simMDAadherence[curMDARound]}
                  min={0}
                  step={0.1}
                  max={1}
                  onChange={(event, newValue) => {
                    let newArray = [...simMDAadherence];
                    newArray[curMDARound] = newValue;
                    setSimMDAadherence([...newArray]);
                  }}
                  aria-labelledby="slider"
                  valueLabelDisplay="auto"
                />
                <div className={classes.adherence}></div>
                {/*             <p style={{ marginBottom: 0 }}>
        Controls how randomly coverage is applied. For 0, coverage is
        completely random. For 1, the same individuals are always treated.
        </p> */}
              </FormControl>
              <div className={classes.modalButtons}>
                <Button
                  className={classes.modalButton}
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
