import { Button, ClickAwayListener, Paper, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { useStore } from '../../../store/simulatorStore'
import CloseButton from '../CloseButton'
//setting
import {
  SettingBedNetCoverage,
  SettingDrugRegimen,
  SettingSystematicAdherence,
  SettingTargetCoverage,
} from './settings'
import useStyles from './styles'

//import ClickAway from "../../../hooks/clickAway";

const MdaRounds = (props) => {
  const history = props.history
  const { simParams, dispatchSimParams } = useStore()
  const classes = useStyles()
  const removeMDARound = () => {
    let newArray = [...simParams.tweakedPrediction.active]
    newArray[curMDARound] = false
    setSimMDAactive([...newArray])
    setCurMDARound(-1)
    setDoseSettingsOpen(false)
  }
  const closeRoundModal = (event) => {
    setDoseSettingsOpen(false)
    setCurMDARound(-1)
  }
  const closeRoundTooltip = (event) => {
    // this breaks things
    // setCurMDARound(-1)
  }

  const [curMDARound, setCurMDARound] = useState(-1)
  const [doseSettingsOpen, setDoseSettingsOpen] = useState(false)

  const setSimMDAcoverage = (array) => {
    console.log('curMDARound', curMDARound)
    dispatchSimParams({ type: 'tweakedBeenFiddledWith', payload: curMDARound })
    dispatchSimParams({ type: 'tweakedCoverage', payload: array })
  }
  const setSimMDAadherence = (array) => {
    dispatchSimParams({ type: 'tweakedBeenFiddledWith', payload: curMDARound })
    dispatchSimParams({ type: 'tweakedAdherence', payload: array })
  }
  const setSimMDAbednets = (array) => {
    dispatchSimParams({ type: 'tweakedBeenFiddledWith', payload: curMDARound })
    dispatchSimParams({ type: 'tweakedBednets', payload: array })
  }
  const setSimMDAregimen = (array) => {
    dispatchSimParams({ type: 'tweakedBeenFiddledWith', payload: curMDARound })
    dispatchSimParams({ type: 'tweakedRegimen', payload: array })
  }
  const setSimMDAactive = (array) => {
    dispatchSimParams({ type: 'tweakedBeenFiddledWith', payload: curMDARound })
    dispatchSimParams({ type: 'tweakedActive', payload: array })
  }

  const numberOfYears = 22
  React.useEffect(() => {
    // global mdaSixMonths change
    //    console.log(simParams.mdaSixMonths)
    if (false) {
      // this should only apply when mdaSixMonths has been deliberetaly changed
      let MDAactive = []
      for (let i = 0; i < numberOfYears; i++) {
        if (simParams.mdaSixMonths === 12 && i % 2 === 1) {
          MDAactive.push(false)
        } else {
          MDAactive.push(true) // alternate here
        }
      }
      setSimMDAactive([...MDAactive])
    }
  // eslint-disable-next-line
  }, [simParams.mdaSixMonths])

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
                  ', ' +
                  history.coverage[i] +
                  ', ' +
                  history.adherence[i] +
                  ', ' +
                  history.bednets[i] +
                  ', ' +
                  history.regimen[i] +
                  ' '
                }
              >
                <span
                  style={{
                    height: history.coverage[i],
                  }}
                ></span>
              </div>
              <div
                className={`bar history`}
                title={
                  history.time[i] +
                  ', ' +
                  history.coverage[i] +
                  ', ' +
                  history.adherence[i] +
                  ', ' +
                  history.bednets[i] +
                  ', ' +
                  history.regimen[i] +
                  ' '
                }
              >
                <span
                  style={{
                    height: history.coverage[i],
                  }}
                ></span>
              </div>
            </React.Fragment>
          ))}
        {/*         <div key="splitter" style={{ color: "red" }}>
          |
        </div> */}
        {/* prediction */}
        {simParams.tweakedPrediction.time.map((e, i) => (
          <div
            key={`bar-${i}`}
            onClick={(a) => {
              setCurMDARound(i)
            }}
            className={`bar ${
              simParams.tweakedPrediction.active[i] === false ? 'removed' : ''
            } ${i === curMDARound ? 'current' : ''}`}
            title={
              simParams.tweakedPrediction.time[i] +
              ', ' +
              simParams.tweakedPrediction.coverage[i] +
              ', ' +
              simParams.tweakedPrediction.adherence[i] +
              ', ' +
              simParams.tweakedPrediction.bednets[i] +
              ', ' +
              simParams.tweakedPrediction.regimen[i] +
              ', ' +
              simParams.tweakedPrediction.active[i] +
              ' '
            }
          >
            <span
              className={i === curMDARound ? 'current' : ''}
              style={{
                height: simParams.tweakedPrediction.coverage[i],
              }}
            ></span>

            {i === curMDARound && (
              <ClickAwayListener onClickAway={closeRoundTooltip}>
                <div className="bar-tooltip">
                  {simParams.tweakedPrediction.active[curMDARound] !==
                    false && (
                    <span className="t">
                      {simParams.tweakedPrediction.coverage[i]}%
                    </span>
                  )}
                  {simParams.tweakedPrediction.active[curMDARound] ===
                    false && <span className="t">No MDA</span>}
                  {simParams.tweakedPrediction.active[curMDARound] ===
                    false && (
                    <span
                      className="i plus"
                      onClick={(a) => {
                        setDoseSettingsOpen(true)
                      }}
                    ></span>
                  )}
                  {simParams.tweakedPrediction.active[curMDARound] !==
                    false && (
                    <span
                      className="i edit"
                      onClick={(a) => {
                        setDoseSettingsOpen(true)
                      }}
                    ></span>
                  )}
                  {simParams.tweakedPrediction.active[curMDARound] !==
                    false && (
                    <span
                      className="i remove"
                      onClick={(a) => {
                        removeMDARound()
                        a.stopPropagation()
                      }}
                    ></span>
                  )}
                </div>
              </ClickAwayListener>
            )}
          </div>
        ))}
      </div>

      {doseSettingsOpen && (
        <ClickAwayListener onClickAway={closeRoundModal}>
          <Paper
            elevation={3}
            className={classes.roundModal}
            style={{ zIndex: 999 }}
          >
            <CloseButton action={closeRoundModal} />
            {simParams.tweakedPrediction.active[curMDARound] === false && (
              <Button
                className={classes.modalButton}
                variant="contained"
                color="primary"
                style={{
                  position: 'absolute',
                  zIndex: 9999,
                  marginLeft: '3rem',
                  marginTop: '13rem',
                }}
                onClick={() => {
                  let newArray = [...simParams.tweakedPrediction.active]
                  newArray[curMDARound] = true
                  setSimMDAactive([...newArray])
                  setCurMDARound(-1)
                  // setDoseSettingsOpen(false);
                }}
              >
                Activate
              </Button>
            )}
            <div
              style={{
                opacity:
                  simParams.tweakedPrediction.active[curMDARound] === false
                    ? 0.2
                    : 1,
              }}
            >
              <Typography className={classes.title} variant="h4" component="h4">
                {/* MDA round #  */}
                {simParams.mdaSixMonths === 6
                  ? curMDARound % 2
                    ? new Date().getFullYear() + Math.floor(curMDARound / 2)
                    : new Date().getFullYear() + curMDARound / 2
                  : new Date().getFullYear() + curMDARound}
                {curMDARound % 2 ? ' - round 2' : ''}
              </Typography>

              <SettingTargetCoverage
                inModal={true}
                label="Treatment target coverage"
                classAdd="spaced"
                value={simParams.tweakedPrediction.coverage[curMDARound]}
                onChange={(event, newValue) => {
                  let newArray = [...simParams.tweakedPrediction.coverage]
                  newArray[curMDARound] = newValue
                  setSimMDAcoverage([...newArray])
                }}
              />

              <SettingBedNetCoverage
                inModal={true}
                label="Bed Net Coverage"
                classAdd="spaced"
                value={simParams.tweakedPrediction.bednets[curMDARound]}
                onChange={(event, newValue) => {
                  let newArray = [...simParams.tweakedPrediction.bednets]
                  newArray[curMDARound] = newValue
                  setSimMDAbednets([...newArray])
                }}
              />

              <SettingDrugRegimen
                inModal={true}
                label="Drug regimen"
                classAdd="spaced"
                value={simParams.tweakedPrediction.regimen[curMDARound]}
                onChange={(event) => {
                  let newArray = [...simParams.tweakedPrediction.regimen]
                  newArray[curMDARound] = event.target.value
                  setSimMDAregimen([...newArray])
                }}
              />

              <SettingSystematicAdherence
                inModal={true}
                label="Systematic adherence"
                classAdd="spaced"
                value={simParams.tweakedPrediction.adherence[curMDARound]}
                onChange={(event, newValue) => {
                  let newArray = [...simParams.tweakedPrediction.adherence]
                  newArray[curMDARound] = newValue
                  setSimMDAadherence([...newArray])
                }}
              />

              <div className={classes.modalButtons}>
                <Button
                  className={`${classes.modalButton} light`}
                  variant="contained"
                  onClick={() => {
                    removeMDARound()
                  }}
                >
                  REMOVE
                </Button>
                <Button
                  className={classes.modalButton}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setCurMDARound(-1)
                    setDoseSettingsOpen(false)
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
  )
}
export default MdaRounds
