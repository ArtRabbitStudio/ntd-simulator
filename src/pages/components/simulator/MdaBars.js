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
  console.log(props.data);
  const { simParams2, dispatchSimParams } = useStore();
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

  const [simParams, setSimParams] = useState(simParams2);
  const [simInProgress, setSimInProgress] = useState(false);

  const [editingMDAs, setEditingMDAs] = useState(false);
  const [curMDARound, setCurMDARound] = useState(-1);
  const [doseSettingsOpen, setDoseSettingsOpen] = useState(false);

  const [simMDAtime, setSimMDAtime] = useState(
    props.data.time ? props.data.time : []
  );
  const [simMDAcoverage, setSimMDAcoverage] = useState(
    props.data.coverage ? props.data.coverage : []
  );
  const [simMDAadherence, setSimMDAadherence] = useState(
    props.data.adherence ? props.data.adherence : []
  );
  const [simMDAactive, setSimMDAactive] = useState(
    props.data.active ? props.data.active : []
  );

  /*   useEffect(() => {
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
  }, [simMDAtime, simMDAcoverage, simMDAadherence, simMDAactive]); */
  return (
    <>
      <div className="bars">
        {simMDAtime.map((e, i) => (
          <div
            key={`bar${i}`}
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
