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
    let newArray = [...simMDAactive]
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
    setCurMDARound(-1)
  }

  const [curMDARound, setCurMDARound] = useState(-1)
  const [doseSettingsOpen, setDoseSettingsOpen] = useState(false)

  const [defaultMDAs, setDefaultMDAs] = useState(null)
  const [tweakedMDAs, setTweakedMDAs] = useState(null)

  const simMDAtime = simParams.mdaObjDefaultPrediction.time

  const [simMDAcoverage, setSimMDAcoverage] = useState(
    simParams.mdaObjDefaultPrediction.coverage
  )
  const [simMDAadherence, setSimMDAadherence] = useState(
    simParams.mdaObjDefaultPrediction.adherence
  )
  const [simMDAbednets, setSimMDAbednets] = useState(
    simParams.mdaObjDefaultPrediction.bednets
  )
  const [simMDAregimen, setSimMDAregimen] = useState(
    simParams.mdaObjDefaultPrediction.regimen
  )
  const [simMDAactive, setSimMDAactive] = useState(
    simParams.mdaObjDefaultPrediction.active
  )

  const numberOfYears = 22
  React.useEffect(() => {
    //    console.log('simParams.mdaObjDefaultPrediction has changed')
    const prediction = simParams.mdaObjDefaultPrediction
    if (prediction && prediction.time) {
      const newMDAs = {
        time: [...prediction.time],
        coverage: [...prediction.coverage],
        adherence: [...prediction.adherence],
        bednets: [...prediction.bednets],
        regimen: [...prediction.regimen],
        active: [...prediction.active],
      }
      setDefaultMDAs(newMDAs)
    }
  }, [simParams.mdaObjDefaultPrediction])

  React.useEffect(() => {
    // dispatch change if default and tweaked differ
    if (tweakedMDAs && tweakedMDAs.time && tweakedMDAs.time.length > 0) {
      const needsRerun =
        JSON.stringify(defaultMDAs) !== JSON.stringify(tweakedMDAs)
      if (needsRerun) {
        dispatchSimParams({
          type: 'needsRerun',
          payload: true,
        })
      } else {
        dispatchSimParams({
          type: 'needsRerun',
          payload: false,
        })
      }
    }
  }, [defaultMDAs, tweakedMDAs])
  React.useEffect(() => {
    // dispatch change if tweakedMDA has been updated
    if (tweakedMDAs && tweakedMDAs.time && tweakedMDAs.time.length > 0) {
      dispatchSimParams({
        type: 'mdaObjTweakedPrediction',
        payload: tweakedMDAs,
      })
    }
  }, [tweakedMDAs])

  React.useEffect(() => {
    // tweak the tweakedMDA
    const newMDAs = {
      time: [...simMDAtime],
      coverage: [...simMDAcoverage],
      adherence: [...simMDAadherence],
      bednets: [...simMDAbednets],
      regimen: [...simMDAregimen],
      active: [...simMDAactive],
    }
    setTweakedMDAs(newMDAs)
  }, [
    simMDAtime,
    simMDAcoverage,
    simMDAadherence,
    simMDAbednets,
    simMDAregimen,
    simMDAactive,
  ])

  React.useEffect(() => {
    // global coverage change
    const prediction = simParams.mdaObjDefaultPrediction
    const newArray = [...prediction.coverage.map((item) => simParams.coverage)]
    setSimMDAcoverage(newArray)
  }, [simParams.coverage])
  React.useEffect(() => {
    if (simParams.rho) {
      //console.log('MDA update - simParams.rho changed', simParams.rho)
      // global adherence change
      const prediction = simParams.mdaObjDefaultPrediction
      const newArray = [...prediction.adherence.map((item) => simParams.rho)]
      setSimMDAadherence(newArray)
    }
  }, [simParams.rho])
  React.useEffect(() => {
    // global bednets change
    if (simParams.bednets) {
      //console.log('MDA update - simParams.bednets changed', simParams.bednets)
      const prediction = simParams.mdaObjDefaultPrediction
      const newArray = [...prediction.bednets.map((item) => simParams.bednets)]
      setSimMDAbednets(newArray)
    }
  }, [simParams.bednets])
  React.useEffect(() => {
    // global regimen change
    if (simParams.regimen) {
      //console.log('MDA update - simParams.regimen changed', simParams.regimen)
      const prediction = simParams.mdaObjDefaultPrediction
      const newArray = [...prediction.regimen.map((item) => simParams.regimen)]
      setSimMDAregimen(newArray)
    }
  }, [simParams.regimen])

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
        {simMDAtime.map((e, i) => (
          <div
            key={`bar-${i}`}
            onClick={(a) => {
              setCurMDARound(i)
            }}
            className={`bar ${simMDAactive[i] === false ? 'removed' : ''} ${
              i === curMDARound ? 'current' : ''
            }`}
            title={
              simMDAtime[i] +
              ', ' +
              simMDAcoverage[i] +
              ', ' +
              simMDAadherence[i] +
              ', ' +
              simMDAbednets[i] +
              ', ' +
              simMDAregimen[i] +
              ', ' +
              simMDAactive[i] +
              ' '
            }
          >
            <span
              className={i === curMDARound ? 'current' : ''}
              style={{
                height: simMDAcoverage[i],
              }}
            ></span>

            {i === curMDARound && (
              <ClickAwayListener onClickAway={closeRoundTooltip}>
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
                        setDoseSettingsOpen(true)
                      }}
                    ></span>
                  )}
                  {simMDAactive[curMDARound] !== false && (
                    <span
                      className="i edit"
                      onClick={(a) => {
                        setDoseSettingsOpen(true)
                      }}
                    ></span>
                  )}
                  {simMDAactive[curMDARound] !== false && (
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
          <Paper elevation={3} className={classes.roundModal}>
            <CloseButton action={closeRoundModal} />
            {simMDAactive[curMDARound] === false && (
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
                  let newArray = [...simMDAactive]
                  newArray[curMDARound] = true
                  setSimMDAactive([...newArray])
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
                {curMDARound % 2 ? ' - round 2' : ''}
              </Typography>

              <SettingTargetCoverage
                inModal={true}
                label="Treatment target coverage"
                classAdd="spaced"
                value={simMDAcoverage[curMDARound]}
                onChange={(event, newValue) => {
                  let newArray = [...simMDAcoverage]
                  newArray[curMDARound] = newValue
                  setSimMDAcoverage([...newArray])
                }}
              />

              <SettingBedNetCoverage
                inModal={true}
                label="Bed Net Coverage"
                classAdd="spaced"
                value={simMDAbednets[curMDARound]}
                onChange={(event, newValue) => {
                  let newArray = [...simMDAbednets]
                  newArray[curMDARound] = newValue
                  setSimMDAbednets([...newArray])
                }}
              />

              <SettingDrugRegimen
                inModal={true}
                label="Drug regimen"
                classAdd="spaced"
                value={simMDAregimen[curMDARound]}
                onChange={(event) => {
                  let newArray = [...simMDAregimen]
                  newArray[curMDARound] = event.target.value
                  setSimMDAregimen([...newArray])
                }}
              />

              <SettingSystematicAdherence
                inModal={true}
                label="Systematic adherence"
                classAdd="spaced"
                value={simMDAadherence[curMDARound]}
                onChange={(event, newValue) => {
                  let newArray = [...simMDAadherence]
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
