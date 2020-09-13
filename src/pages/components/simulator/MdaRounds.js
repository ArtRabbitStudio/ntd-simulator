import { Button, ClickAwayListener, Paper, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { useSimulatorStore } from '../../../store/simulatorStore'
import { useScenarioStore, ScenarioStoreConstants } from '../../../store/scenarioStore'
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

  const { scenarioState, dispatchScenarioStateUpdate } = useScenarioStore();

  const history = scenarioState.scenarioData[ scenarioState.currentScenarioId ].mda2015;
  const future = scenarioState.scenarioData[ scenarioState.currentScenarioId ].mdaFuture;

  const { simState } = useSimulatorStore()
  const classes = useStyles()

  const closeRoundModal = (event) => {
    setDoseSettingsOpen(false)
    setCurMDARound(-1)
  }
  const closeRoundTooltip = (event) => {
    setCurMDARound(-1)
  }

  const [curMDARound, setCurMDARound] = useState(-1)
  const [doseSettingsOpen, setDoseSettingsOpen] = useState(false)

  const setMDAProperty = ( key, idx, newValue ) => {

    dispatchScenarioStateUpdate( {
      type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_MDA_FUTURE_SETTING_BY_ID_AND_IDX,
      id: scenarioState.currentScenarioId,
      idx: idx,
      key: key,
      value: newValue
    } );

  };

  const setSimMDAactive = (array) => {
   // dispatchSimState({ type: 'tweakedActive', payload: array })
  }

  const numberOfYears = 22
  React.useEffect(() => {
    // global mdaSixMonths change
    //    console.log(simState.mdaSixMonths)
    if (false) {
      // this should only apply when mdaSixMonths has been deliberetaly changed
      let MDAactive = []
      for (let i = 0; i < numberOfYears; i++) {
        if (simState.mdaSixMonths === 12 && i % 2 === 1) {
          MDAactive.push(false)
        } else {
          MDAactive.push(true) // alternate here
        }
      }
      setSimMDAactive([...MDAactive])
    }
  // eslint-disable-next-line
  }, [simState.mdaSixMonths])


  return (
    <React.Fragment>
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
          )
        )}

        { future.time.map( ( e, i ) => (
          <div
            key={`bar-${i}`}
            onClick={(a) => {
              setCurMDARound(i)
            }}
            className={`bar ${
              future.active[i] === false ? 'removed' : ''
            } ${i === curMDARound ? 'current' : ''}`}
            title={
              future.time[i] +
              ', ' +
              future.coverage[i] +
              ', ' +
              future.adherence[i] +
              ', ' +
              future.bednets[i] +
              ', ' +
              future.regimen[i] +
              ', ' +
              future.active[i] +
              ' '
            }
          >
            <span
              className={i === curMDARound ? 'current' : ''}
              style={{
                height: future.coverage[i],
              }}
            ></span>

            {i === curMDARound && (
              <ClickAwayListener onClickAway={closeRoundTooltip}>
                <div className="bar-tooltip">
                  {future.active[curMDARound] !==
                    false && (
                    <span className="t">
                      {future.coverage[i]}% coverage
                    </span>
                  )}
                  {future.active[curMDARound] ===
                    false && <span className="t">No MDA</span>}
                  {future.active[curMDARound] ===
                    false && (
                    <span
                      className="i plus"
                      onClick={(a) => {
                        setDoseSettingsOpen(true)
                      }}
                    ></span>
                  )}
                  {future.active[curMDARound] !==
                    false && (
                    <span
                      className="i edit"
                      onClick={(a) => {
                        setDoseSettingsOpen(true)
                      }}
                    ></span>
                  )}
                  {future.active[curMDARound] !==
                    false && (
                    <span
                      className="i remove"
                      onClick={ () => {
                        setMDAProperty( 'active', curMDARound, false );
                        /* TODO FIXME */
                        closeRoundModal();
                      } }
                    ></span>
                  )}
                </div>
              </ClickAwayListener>
            )}
          </div>
        ))}
      </div>

      { doseSettingsOpen && (
        <ClickAwayListener onClickAway={closeRoundModal}>
          <Paper
            elevation={3}
            className={classes.roundModal}
            style={{ zIndex: 999 }}
          >
            <CloseButton action={closeRoundModal} />
            {future.active[curMDARound] === false && (
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
                onClick={ () => { setMDAProperty( 'active', curMDARound, true ); } }
              >
                Activate
              </Button>
            )}
            <div
              style={{
                opacity:
                  future.active[curMDARound] === false
                    ? 0.2
                    : 1,
              }}
            >
              <Typography className={classes.title} variant="h4" component="h4">
                {/* MDA round #  */}
                {simState.mdaSixMonths === 6
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
                value={future.coverage[curMDARound]}
                onChange={( event, newValue ) => { setMDAProperty( 'coverage', curMDARound, newValue ); }}
              />

              <SettingBedNetCoverage
                inModal={true}
                label="Bed Net Coverage"
                classAdd="spaced"
                value={future.bednets[curMDARound]}
                onChange={( event, newValue ) => { setMDAProperty( 'bednets', curMDARound, newValue ); }}
              />

              <SettingDrugRegimen
                inModal={true}
                label="Drug regimen"
                classAdd="spaced"
                value={future.regimen[curMDARound]}
                onChange={( event, newValue ) => { setMDAProperty( 'regimen', curMDARound, event.target.value ); }}
              />

              <SettingSystematicAdherence
                inModal={true}
                label="Systematic adherence"
                classAdd="spaced"
                value={future.adherence[curMDARound]}
                onChange={( event, newValue ) => { setMDAProperty( 'adherence', curMDARound, newValue ); }}
              />

              <div className={classes.modalButtons}>
                <Button
                  className={`${classes.modalButton} light`}
                  variant="contained"
                  onClick={ () => { setMDAProperty( 'active', curMDARound, false ); } }
                >
                  DEACTIVATE
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
                  CONFIRM
                </Button>
              </div>
            </div>
          </Paper>
        </ClickAwayListener>
      ) }
    </React.Fragment>
  )
}
export default MdaRounds
