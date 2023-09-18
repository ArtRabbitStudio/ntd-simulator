import { Button, ClickAwayListener, Paper, Typography, Box } from '@material-ui/core'
import React, { useState } from 'react'
import { scaleLinear } from 'd3'
import { useSimulatorStore } from 'store/simulatorStore'
import { useScenarioStore, ScenarioStoreConstants } from 'store/scenarioStore'
import CloseButton from 'pages/components/CloseButton'
import AutoSizer from 'react-virtualized-auto-sizer'
import MdaRoundsSlider from 'pages/components/simulator/MdaRoundsSlider'
import MdaRoundBar from 'pages/components/simulator/MdaRoundBar'
import { calculateTime } from 'utils'

import { useTranslation } from 'react-i18next';
//setting
import {
  SettingBedNetCoverage,
  SettingDrugRegimen,
  SettingSystematicAdherence,
  SettingTargetCoverage,
} from 'pages/components/simulator/settings'
import useStyles from 'pages/components/simulator/styles'

import {
  DISEASE_CONFIG,
  DISEASE_LIMF,
  DISEASE_TRACHOMA,
  DISEASE_STH_ROUNDWORM,
  DISEASE_STH_WHIPWORM,
  DISEASE_STH_HOOKWORM,
  DISEASE_SCH_MANSONI
} from 'AppConstants';

//import ClickAway from "hooks/clickAway";


const MdaRounds = (props) => {
  const { t } = useTranslation();
  const disease = props.disease
  const { scenarioState, dispatchScenarioStateUpdate } = useScenarioStore();

  const history = scenarioState.scenarioData[scenarioState.currentScenarioId].mda2015;
  const future = scenarioState.scenarioData[scenarioState.currentScenarioId].mdaFuture;

  const { simState } = useSimulatorStore()
  const classes = useStyles()

  const closeRoundModal = (event) => {
    setDoseSettingsOpen(false)
    //    setCurMDARound(-1)
  }


  const [curMDARound, setCurMDARound] = useState(-1)
  const [doseSettingsOpen, setDoseSettingsOpen] = useState(false)
  // const [toolTipOpen, setToolTipOpen] = useState(false)

  const closeRoundTooltip = (event) => {
    setCurMDARound(-1)
    //setToolTipOpen(false)
  }

  const setMDAProperty = (key, idx, newValue) => {
    //console.log('dispatchScenarioStateUpdate',key,idx,newValue)
    dispatchScenarioStateUpdate({
      type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_MDA_FUTURE_SETTING_BY_ID_AND_IDX,
      id: scenarioState.currentScenarioId,
      idx: idx,
      key: key,
      value: newValue
    });

  };

  const setMDARange = (start, end) => {

    dispatchScenarioStateUpdate({
      type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_MDA_FUTURE_SETTING_BY_ID_AND_START_END,
      id: scenarioState.currentScenarioId,
      start: start,
      end: end
    });

  };

  const setSimMDAactive = (array) => {
    // dispatchSimState({ type: 'tweakedActive', payload: array })
  }

  const outputTitle = (time, coverage, adherence, bednets, regimen, active, coverageInfants, coveragePreSAC, coverageSAC, coverageAdults) => {
    if (!active || (coverage === 0 && coverageInfants === 0 && coveragePreSAC === 0 && coverageSAC === 0 && coverageAdults === 0)) {
      return `${calculateTime(time,t)}: ${t('noIntervention')}`
    } else {
      switch (disease) {
        case DISEASE_STH_ROUNDWORM:
        case DISEASE_STH_WHIPWORM:
        case DISEASE_STH_HOOKWORM:
        case DISEASE_SCH_MANSONI:
          return `${calculateTime(time,t)}: ${t('coverage')} ${coverageInfants}% - ${coveragePreSAC}% - ${coverageSAC}% - ${coverageAdults}%`
        default:
          return `${calculateTime(time,t)}: ${t('coverage')} ${coverage}%`
      }

    }

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


  const outputMDATime = (curMDARound) => {
    //console.log('outputMDATime disease',disease)
    const startYear = DISEASE_CONFIG[disease] ? DISEASE_CONFIG[disease].interventionStartYear : 2020
    const year = startYear + (curMDARound / 2)
    if (year % 1 === 0) {
      return year
    } else {
      return Math.floor(year) + ' - ' + t('round2')
    }
  }

  const startYear = DISEASE_CONFIG[disease] ? DISEASE_CONFIG[disease].startYear : 2015
  const endYear = DISEASE_CONFIG[disease] ? DISEASE_CONFIG[disease].endYear : 2030
  const numberOfFutreTimeBars = future.time.length
  //const barWidth = 101.5 / numberOfBars
  const actualBar = 10

  const mapActiveToTime = future.active.filter((val, index) => {
    if (future.time[index] !== undefined) {
      return true
    }
    return false
  })

  const STH = (disease === DISEASE_STH_ROUNDWORM || disease === DISEASE_STH_WHIPWORM || disease === DISEASE_STH_HOOKWORM || disease === DISEASE_SCH_MANSONI)
  const LFandSTH = (disease === DISEASE_LIMF || STH)
  const LFandTrachoma = (disease === DISEASE_LIMF || disease === DISEASE_TRACHOMA)

  const lPad = 50
  const rPad = 32
  const barsWidth = props.width - lPad - rPad

  const domainX = [startYear - 2000, endYear - 2000]
  const x = scaleLinear().domain(domainX).range([0, barsWidth])
  const sliderLength = ((x((future.time[future.time.length - 1] / 12)) - x(future.time[0] / 12))) + lPad - rPad - (actualBar / 2)

  return (
    <React.Fragment>
      <div className={classes.legend}>
        <Typography className={classes.legendText} variant="h5" component="h5">0%</Typography>
        <Typography className={`${classes.legendText} ${classes.legendTextBottom}`} variant="h5" component="h5">100%</Typography>
      </div>
      <div className={`bars ${disease}`}>
        {/* history */}
        {history &&
          history.time &&
          history.time.map((e, i) => (
            <React.Fragment key={`bar-hist-${i}`}>


              {LFandTrachoma && <React.Fragment>
                <div
                  style={{ left: x(e / 12) + lPad - (actualBar / 2) }}
                  className={`bar history`}
                  title={history.coverage && history.coverage[i] ? outputTitle(history.time[i], history.coverage[i], history.adherence[i], history.bednets[i], history.regimen[i], true, 0, 0, 0, 0) : outputTitle(history.time[i])}
                >
                  <MdaRoundBar ident={i} history={true} height={history.coverage && history.coverage[i] ? history.coverage[i] : 0} />
                </div><div
                  style={{ left: x((e + 6) / 12) + lPad - (actualBar / 2) }}
                  className={`bar history`}
                  title={history.coverage && history.coverage[i] ? outputTitle(history.time[i], history.coverage[i], history.adherence[i], history.bednets[i], history.regimen[i], false, 0, 0, 0, 0) : outputTitle(history.time[i])}
                >
                  <MdaRoundBar ident={'h' + i} history={true} height={history.coverage && history.coverage[i] ? history.coverage[i] : 0} />
                </div></React.Fragment>}

              {STH && <React.Fragment>
                <div
                  style={{ left: x(e / 12) + lPad - (actualBar / 2) }}
                  className={`bar history`}
                  title={history.coverageInfants ? outputTitle(history.time[i], 0, 0, 0, '', true, history.coverageInfants[i], history.coveragePreSAC[i], history.coverageSAC[i], history.coverageAdults[i]) : outputTitle(history.time[i])}
                >
                  <MdaRoundBar ident={i} history={true} height={history.coverageInfants ? (((history.coverageInfants[i] + history.coveragePreSAC[i] + history.coverageSAC[i] + history.coverageAdults[i]) / 400) * 100) : 0} />
                </div>
                < div
                  style={{ left: x((e + 6) / 12) + lPad - (actualBar / 2) }}
                  className={`bar history`}
                  title={history.coverageInfants ? outputTitle(history.time[i], 0, 0, 0, '', false, history.coverageInfants[i], history.coveragePreSAC[i], history.coverageSAC[i], history.coverageAdults[i]) : outputTitle(history.time[i])}
                >
                  <MdaRoundBar ident={'h' + i} history={true} height={0} />
                </div></React.Fragment>}

            </React.Fragment>
          )
          )}

        {future.time.map((e, i) => (
          <div
            key={`bar-${i}`}
            onClick={(a) => {
              setCurMDARound(i)
            }}
            style={{ left: (x((e) / 12)) + lPad - (actualBar / 2) }}
            className={`bar ${future.active[i] === false ? 'removed' : ''
              } ${i === curMDARound ? 'current' : ''}`}
            title={outputTitle(future.time[i], future.coverage[i], future.adherence[i], future.bednets[i], future.regimen[i], future.active[i], future.coverageInfants[i], future.coveragePreSAC[i], future.coverageSAC[i], future.coverageAdults[i])}
          >
            {LFandTrachoma && <MdaRoundBar
              ident={'f' + i}
              classNameAdd={(i === curMDARound) ? 'current' : ''}
              height={future.coverage[i]}
            />}

            {STH && <MdaRoundBar
              ident={'f' + i}
              classNameAdd={(i === curMDARound) ? 'current' : ''}
              height={(((future.coverageInfants[i] + future.coveragePreSAC[i] + future.coverageSAC[i] + future.coverageAdults[i]) / 400) * 100)}
            />}

            {i === curMDARound && (
              <ClickAwayListener onClickAway={(event) => { if (!doseSettingsOpen) closeRoundTooltip(event) }}>
                <div className="bar-tooltip">
                  {future.active[curMDARound] !== false && disease === DISEASE_LIMF && (
                    <span className="t">
                      {future.coverage[i]}% {t('coverage')}
                    </span>
                  )}
                  {future.active[curMDARound] !== false && disease === DISEASE_TRACHOMA && (
                    <span className="t">
                      {future.coverage[i]}% {t('coverage')}
                    </span>
                  )}
                  {future.active[curMDARound] !== false && STH && (
                    <span className="t">
                      {`${future.coverageInfants[i]}% - ${future.coveragePreSAC[i]}% - ${future.coverageSAC[i]}% - ${future.coverageAdults[i]}%  ${t('coverage')}`}
                    </span>
                  )}
                  {future.active[curMDARound] ===
                    false && <span className="t">{t('noMDA')}</span>}
                  {future.active[curMDARound] === false && LFandSTH && (
                    <span
                      className="i plus"
                      title="Activate MDA"
                      onClick={(a) => {
                        setDoseSettingsOpen(true)
                      }}
                    ></span>)}
                  {future.active[curMDARound] !== false && LFandSTH && (
                    <span
                      className="i edit"
                      title="Edit MDA"
                      onClick={(a) => {
                        setDoseSettingsOpen(true)
                      }}
                    ></span>
                  )}
                  {future.active[curMDARound] !== false && LFandSTH && (
                    <span
                      className="i remove"
                      title="Remove MDA"
                      onClick={() => {
                        setMDAProperty('active', curMDARound, false);
                        /* TODO FIXME */
                        closeRoundModal();
                      }}
                    ></span>
                  )}
                </div>
              </ClickAwayListener>
            )}
          </div>
        ))}

      </div>
      {disease === DISEASE_TRACHOMA && (
        <MdaRoundsSlider
          disease={disease}
          left={(x((future.time[0]) / 12)) + lPad - (actualBar / 2)}
          width={sliderLength}
          x={(value) => { return x(value) }}
          numberOfFutreTimeBars={numberOfFutreTimeBars}
          onChange={setMDARange}
          intialMonthValues={[future.time[future.active.indexOf(true)], future.time[mapActiveToTime.lastIndexOf(true)]]}
        />
      )}

      { (doseSettingsOpen && disease === DISEASE_LIMF) && (
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
                onClick={() => { setMDAProperty('active', curMDARound, true); }}
              >
                {t('activate')}
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
                {outputMDATime(curMDARound)}
                {/*simState.mdaSixMonths === 6
                  ? curMDARound % 2
                    ? new Date().getFullYear() + Math.floor(curMDARound / 2)
                    : new Date().getFullYear() + curMDARound / 2
                  : new Date().getFullYear() + curMDARound}
                {curMDARound % 2 ? ' - round 2' : ''*/}
              </Typography>

              <SettingTargetCoverage
                inModal={true}
                label={t('treatmentTargetCoverage')}
                classAdd="spaced"
                value={future.coverage[curMDARound]}
                onChange={(event, newValue) => { setMDAProperty('coverage', curMDARound, newValue); }}
              />

              <SettingBedNetCoverage
                inModal={true}
                label={t('bedNetCoverage')}
                classAdd="spaced"
                value={future.bednets[curMDARound]}
                onChange={(event, newValue) => { setMDAProperty('bednets', curMDARound, newValue); }}
              />

              <SettingDrugRegimen
                inModal={true}
                label={t('drugRegimen')}
                classAdd="spaced"
                value={future.regimen[curMDARound]}
                onChange={(event, newValue) => { setMDAProperty('regimen', curMDARound, event.target.value); }}
              />

              <SettingSystematicAdherence
                inModal={true}
                label={t('systematicAdherence')}
                classAdd="spaced"
                value={future.adherence[curMDARound]}
                onChange={(event, newValue) => { setMDAProperty('adherence', curMDARound, newValue); }}
              />

              <div className={classes.modalButtons}>
                <Button
                  className={`${classes.modalButton} light`}
                  variant="contained"
                  onClick={() => { setMDAProperty('active', curMDARound, false); }}
                >
                  {t('DEACTIVATE')}
                </Button>
                <Button
                  className={classes.modalButton}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    //console.log('confirm clicked')
                    setCurMDARound(-1)
                    setDoseSettingsOpen(false)
                  }}
                >
                  {t('CONFIRM')}
                </Button>
              </div>
            </div>
          </Paper>
        </ClickAwayListener>
      )}

      { (doseSettingsOpen && STH) && (
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
                onClick={() => { setMDAProperty('active', curMDARound, true); }}
              >
                {t('activate')}
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
                {outputMDATime(curMDARound)}
                {/*simState.mdaSixMonths === 6
                  ? curMDARound % 2
                    ? new Date().getFullYear() + Math.floor(curMDARound / 2)
                    : new Date().getFullYear() + curMDARound / 2
                  : new Date().getFullYear() + curMDARound}
                {curMDARound % 2 ? ' - round 2' : ''*/}
              </Typography>

              <SettingTargetCoverage
                value={future.coverageInfants[curMDARound]}
                onChange={(event, newValue) => { setMDAProperty('coverageInfants', curMDARound, newValue); }}
                inModal={true}
                label={t('coverageInfants')}
                min={0}
                max={100}
                step={5}
                valueKey="coverageInfants"
                title={t('InfantsTitle')}
              />

              <SettingTargetCoverage
                value={future.coveragePreSAC[curMDARound]}
                onChange={(event, newValue) => { setMDAProperty('coveragePreSAC', curMDARound, newValue); }}
                inModal={true}
                label={t('coveragePreschool')}
                min={0}
                max={100}
                step={5}
                valueKey="coveragePreSAC"
                title={t('PreschoolTitle')}
              />

              <SettingTargetCoverage
                value={future.coverageSAC[curMDARound]}
                onChange={(event, newValue) => { setMDAProperty('coverageSAC', curMDARound, newValue); }}
                inModal={true}
                label={t('coverageSchoolAge')}
                min={0}
                max={100}
                step={5}
                valueKey="coverageSAC"
                title={t('SchoolAgeTitle')}
              />

              <SettingTargetCoverage
                value={future.coverageAdults[curMDARound]}
                onChange={(event, newValue) => { setMDAProperty('coverageAdults', curMDARound, newValue); }}
                inModal={true}
                label={t('coverageAdults')}
                min={0}
                max={100}
                step={5}
                valueKey="coverageAdults"
                title={t('AdultsTitle')}
              />

              <div className={classes.modalButtons}>
                <Button
                  className={`${classes.modalButton} light`}
                  variant="contained"
                  onClick={() => { setMDAProperty('active', curMDARound, false); }}
                >
                  {t('DEACTIVATE')}
                </Button>
                <Button
                  className={classes.modalButton}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    //console.log('confirm clicked')
                    setCurMDARound(-1)
                    setDoseSettingsOpen(false)
                  }}
                >
                  {t('CONFIRM')}
                </Button>
              </div>
            </div>
          </Paper>
        </ClickAwayListener>
      )}

    </React.Fragment>
  )
}


//export default MdaRounds
export default (props) => (
  <AutoSizer disableHeight>
    {({ width }) => <MdaRounds {...props} width={width} />}
  </AutoSizer>
)
