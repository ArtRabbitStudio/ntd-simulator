import { Button, ClickAwayListener, Paper, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { useSimulatorStore } from 'store/simulatorStore'
import { useScenarioStore, ScenarioStoreConstants } from 'store/scenarioStore'
import CloseButton from 'pages/components/CloseButton'
import MdaRoundsSlider from 'pages/components/simulator/MdaRoundsSlider'
//setting
import {
  SettingBedNetCoverage,
  SettingDrugRegimen,
  SettingSystematicAdherence,
  SettingTargetCoverage,
} from 'pages/components/simulator/settings'
import useStyles from 'pages/components/simulator/styles'

import { DISEASE_LIMF, DISEASE_TRACHOMA, DISEASE_STH_ROUNDWORM } from 'AppConstants';
//import ClickAway from "hooks/clickAway";

const MdaRounds = (props) => {
  const disease = props.disease
  const { scenarioState, dispatchScenarioStateUpdate } = useScenarioStore();

  const history = scenarioState.scenarioData[ scenarioState.currentScenarioId ].mda2015;
  const future = scenarioState.scenarioData[ scenarioState.currentScenarioId ].mdaFuture;



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
    console.log('close round tooltip called setting mda round to -1')
    setCurMDARound(-1)
    //setToolTipOpen(false)
  }

  const setMDAProperty = ( key, idx, newValue ) => {
    //console.log('dispatchScenarioStateUpdate',key,idx,newValue)
    dispatchScenarioStateUpdate( {
      type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_MDA_FUTURE_SETTING_BY_ID_AND_IDX,
      id: scenarioState.currentScenarioId,
      idx: idx,
      key: key,
      value: newValue
    } );

  };

  const setMDARange = ( start, end  ) => {

    dispatchScenarioStateUpdate( {
      type: ScenarioStoreConstants.ACTION_TYPES.UPDATE_SCENARIO_MDA_FUTURE_SETTING_BY_ID_AND_START_END,
      id: scenarioState.currentScenarioId,
      start: start,
      end: end
    } );

  };

  const setSimMDAactive = (array) => {
   // dispatchSimState({ type: 'tweakedActive', payload: array })
  }

  const outputTitle = (time,coverage,adherence,bednets,regimen,active,coverageInfants,coveragePreSAC,coverageSAC,coverageAdults) => {
    if ( !active || coverage === 0 ) {
        return `${calculateTime(time)}: no intervention`
    } else {
      switch ( disease ) {
        case DISEASE_STH_ROUNDWORM:
          return `${calculateTime(time)}: coverage ${coverageInfants}% - ${coveragePreSAC}% - ${coverageSAC}% - ${coverageAdults}%`
        default:
          return `${calculateTime(time)}: coverage ${coverage}%`
      }
      
    }
    
  }
  const calculateTime = (months) => {
    const year = (2000 + (months)/12) - .5
    if ( year % 1  === 0 ) {
      return year
    } else {
      return Math.floor(year)+' - round 2'
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
    const year = 2020 + ( curMDARound / 2) 
    if ( year % 1 === 0 ) {
      return year
    } else {
      return Math.floor(year)+' - round 2'
    }
  }


  const numberOfHistoryBars = (history.time.length + 1)*2
  const numberOfFutreTimeBars = future.time.length + 1
  const numberOfBars = numberOfHistoryBars + numberOfFutreTimeBars;
  const barWidth = 101.5 / numberOfBars
  const actualBar = 10
  const rightMargin = 50
  const areaOffset = rightMargin - actualBar
  const initialOffset = disease === DISEASE_LIMF ? barWidth/2 : barWidth

  const mapActiveToTime = future.active.filter((val,index)=>{
    if ( future.time[index] !== undefined ) {
      return true
    }
    return false
  })

  const LFandSTHRoundworm = ( disease === DISEASE_LIMF || disease === DISEASE_STH_ROUNDWORM )
  const LFandTrachoma = ( disease === DISEASE_LIMF || disease === DISEASE_TRACHOMA )

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
              <div
                style={{left: `calc( ${areaOffset}px + ${initialOffset}% + ${barWidth*((i*2) - 1)+barWidth}%)` }}
                className={`bar history`}
                title={history.coverage ? outputTitle(history.time[i],history.coverage[i],history.adherence[i],history.bednets[i],history.regimen[i],true,future.coverageInfants[i],future.coveragePreSAC[i],future.coverageSAC[i],future.coverageAdults[i]) : outputTitle(history.time[i]) }
              >
                <span
                  style={{
                    height: history.coverage ? history.coverage[i] : 0,
                  }}
                ></span>
              </div>
              <div
                style={{left: `calc( ${areaOffset}px + ${initialOffset}% + ${barWidth*(i*2)+barWidth}%)` }}
                className={`bar history`}
                title={history.coverage ?  outputTitle(history.time[i],history.coverage[i],history.adherence[i],history.bednets[i],history.regimen[i],true,future.coverageInfants[i],future.coveragePreSAC[i],future.coverageSAC[i],future.coverageAdults[i]) : outputTitle(history.time[i]) }
              >
                <span
                  style={{
                    height: history.coverage ? history.coverage[i] : 0,
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
            style={{left: `calc( ${areaOffset}px + ${initialOffset}% + ${barWidth*i+((numberOfHistoryBars*barWidth)-barWidth*2)}%)`}}
            className={`bar ${
              future.active[i] === false ? 'removed' : ''
            } ${i === curMDARound ? 'current' : ''}`}
            title={outputTitle(future.time[i],future.coverage[i],future.adherence[i],future.bednets[i],future.regimen[i],future.active[i],future.coverageInfants[i],future.coveragePreSAC[i],future.coverageSAC[i],future.coverageAdults[i])}
          >
            {LFandTrachoma && <span
              className={ (i === curMDARound ) ? 'current' : ''}
              style={{
                height: future.coverage[i],
              }}
            ></span>}

            {disease === DISEASE_STH_ROUNDWORM && <span
              className={ (i === curMDARound ) ? 'current' : ''}
              style={{
                height: ( ( ( future.coverageInfants[i]+future.coveragePreSAC[i]+future.coverageSAC[i]+future.coverageAdults[i] ) / 400 ) * 100 ),
              }}
            ></span>}

            {i === curMDARound && (
              <ClickAwayListener onClickAway={(event)=>{if ( !doseSettingsOpen ) closeRoundTooltip(event)}}>
                <div className="bar-tooltip">
                  {future.active[curMDARound] !== false && disease === DISEASE_LIMF && (
                    <span className="t">
                      {future.coverage[i]}% coverage
                    </span>
                  )}
                  {future.active[curMDARound] !== false && disease === DISEASE_TRACHOMA && (
                    <span className="t">
                      {future.coverage[i]}% coverage
                    </span>
                  )}
                  {future.active[curMDARound] !== false && disease === DISEASE_STH_ROUNDWORM && (
                    <span className="t">
                      {`${future.coverageInfants[i]}% - ${future.coveragePreSAC[i]}% - ${future.coverageSAC[i]}% - ${future.coverageAdults[i]}%  coverage`}
                    </span>
                  )}
                  {future.active[curMDARound] ===
                    false && <span className="t">No MDA</span>}
                  {future.active[curMDARound] === false &&  LFandSTHRoundworm  && (
                    <span
                      className="i plus"
                      title="Activate MDA"
                      onClick={(a) => {
                        setDoseSettingsOpen(true)
                      }}
                    ></span> )}
                  {future.active[curMDARound] !== false && LFandSTHRoundworm && (
                    <span
                      className="i edit"
                      title="Edit MDA"
                      onClick={(a) => {
                        setDoseSettingsOpen(true)
                      }}
                    ></span>
                  )}
                  {future.active[curMDARound] !== false && LFandSTHRoundworm && (
                    <span
                      className="i remove"
                      title="Remove MDA"
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
      {disease === DISEASE_TRACHOMA && (
        <MdaRoundsSlider 
          disease={disease} 
          numberOfHistoryBars={numberOfHistoryBars}
          numberOfFutreTimeBars={numberOfFutreTimeBars}
          numberOfBars={numberOfBars}
          barWidth={barWidth}
          areaOffset={areaOffset}
          initialOffset={initialOffset}
          onChange={setMDARange}
          intialMonthValues={[future.time[future.active.indexOf(true)],future.time[mapActiveToTime.lastIndexOf(true)]+6]}
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
                    //console.log('confirm clicked')
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

      { (doseSettingsOpen && disease === DISEASE_STH_ROUNDWORM) && (
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
                onChange={( event, newValue ) => { setMDAProperty( 'coverageInfants', curMDARound, newValue ); }}
                inModal={true}
                label="Coverage Infants"
                min={0}
                max={100}
                step={5}
                valueKey="coverageInfants"
                title="Proportion of infants that will be treated."
              />
          
              <SettingTargetCoverage
                value={future.coveragePreSAC[curMDARound]}
                onChange={( event, newValue ) => { setMDAProperty( 'coveragePreSAC', curMDARound, newValue ); }}
                inModal={true}
                label="Coverage Preschool Children"
                min={0}
                max={100}
                step={5}
                valueKey="coveragePreSAC"
                title="Proportion of preschool children that will be treated."
              />
          
              <SettingTargetCoverage
                value={future.coverageSAC[curMDARound]}
                onChange={( event, newValue ) => { setMDAProperty( 'coverageSAC', curMDARound, newValue ); }}
                inModal={true}
                label="Coverage School-Age Children "
                min={0}
                max={100}
                step={5}
                valueKey="coverageSAC"
                title="Proportion of school-age children that will be treated."
              />
            
              <SettingTargetCoverage
                value={future.coverageAdults[curMDARound]}
                onChange={( event, newValue ) => { setMDAProperty( 'coverageAdults', curMDARound, newValue ); }}
                inModal={true}
                label="Coverage Adults"
                min={0}
                max={100}
                step={5}
                valueKey="coverageAdults"
                title="Proportion of adults that will be treated."
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
                    //console.log('confirm clicked')
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
