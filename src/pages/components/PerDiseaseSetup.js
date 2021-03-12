import { Button, Typography, Tooltip } from '@material-ui/core';
import { observer } from 'mobx-react';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { map } from 'lodash';
import PrevalenceMiniGraph from 'components/PrevalenceMiniGraph';
import { useDataAPI, useUIState } from 'hooks/stateHooks';
import { useSimulatorStore } from 'store/simulatorStore';
import { useScenarioStore, ScenarioStoreConstants } from "store/scenarioStore";
import TextContents from 'pages/components/TextContents';
import useStyles from 'theme/Setup';
import { SettingSpecificScenario } from 'pages/components/simulator/settings';
import { loadAllIUhistoricData } from 'pages/components/simulator/helpers/iuLoader';
import SessionStorage from 'pages/components/simulator/helpers/sessionStorage';
import { DISEASE_LIMF } from 'AppConstants';
import { useTranslation } from 'react-i18next';

const PerDiseaseSetup = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const { t, i18n } = useTranslation();
  const history = useHistory()
  const classes = useStyles()
  const { simState, dispatchSimState } = useSimulatorStore()
  const { dispatchScenarioStateUpdate } = useScenarioStore();
  const { country, implementationUnit, disease } = useUIState()
  const { selectedIUData } = useDataAPI();

  const doWeHaveData = simState.IUData.id === implementationUnit
  const loadData = async () => {
    console.log('loadiing historical data in PerDisease setup')
    await loadAllIUhistoricData(
      simState,
      dispatchSimState,
      implementationUnit,
      disease,
      country
    )
    setIsLoading(false)
  }

  if (!doWeHaveData) {
    if (!isLoading) {
      loadData()
      setIsLoading(true)
    }
  }

  const selectedIUName = selectedIUData[0] ? selectedIUData[0]['name'] : ''

  useEffect(
    () => {
      console.log( `PerDiseaseSetup rendered for ${country}, ${implementationUnit}, ${disease}` );
    },
    [ country, implementationUnit, disease]
  );

  useEffect(
    () => {
      // reset scenario state in reducer
      const action = {
        type: ScenarioStoreConstants.ACTION_TYPES.RESET_SCENARIO_STATE,
      };
      dispatchScenarioStateUpdate( action );

      // TODO work out why this doesn't get done in the reducer store-context-consumer
      SessionStorage.simulatorState = null;
      SessionStorage.removeAllScenarios();
    },
    [ dispatchScenarioStateUpdate ]
  );

  if (isLoading) {
    return (
        <section className={classes.section}>
          <Typography variant="h3" component="h6" className={classes.headline}>
            {t('loadingSetup')} {selectedIUName}
          </Typography>
        </section>
    )
  }
  let mdaObjTimeFiltered = null
  if (simState.IUData.mdaObj) {
    const startYear = 2008
    const endYear = 2019
    mdaObjTimeFiltered = {
      active: [],
      time: [],
      adherence: [],
      bednets: [],
      coverage: [],
      regimen: [],
      coverageInfants: [],
      coveragePreSAC: [],
      coverageSAC: [],
      coverageAdults: []
    }
    map(simState.IUData.mdaObj.time, (e, i) => {
      const currentYear = 2000 + e / 12
      if (currentYear >= startYear && currentYear <= endYear) {
        mdaObjTimeFiltered.time.push(simState.IUData.mdaObj.time[i])
        mdaObjTimeFiltered.active.push(simState.IUData.mdaObj.active[i])
        mdaObjTimeFiltered.adherence.push(simState.IUData.mdaObj.adherence[i])
        mdaObjTimeFiltered.bednets.push(simState.IUData.mdaObj.bednets[i])
        mdaObjTimeFiltered.coverage.push(simState.IUData.mdaObj.coverage[i])
        mdaObjTimeFiltered.regimen.push(simState.IUData.mdaObj.regimen[i])
        if ( simState.IUData.mdaObj.coverageInfants ) {
          mdaObjTimeFiltered.coverageInfants.push(simState.IUData.mdaObj.coverageInfants[i])
          mdaObjTimeFiltered.coveragePreSAC.push(simState.IUData.mdaObj.coveragePreSAC[i])
          mdaObjTimeFiltered.coverageSAC.push(simState.IUData.mdaObj.coverageSAC[i])
          mdaObjTimeFiltered.coverageAdults.push(simState.IUData.mdaObj.coverageAdults[i])
        }
      }
    })
  }

  const submitSetup = (event) => {
    dispatchSimState({
      type: 'specificPrediction',
      payload: null,
    })
    // pass params to simulator ..
    history.push({ pathname: `/${disease}/${country}/${implementationUnit}/run` })
  }


  return (
      <section className={classes.section}>
        <Typography variant="h3" component="h6" className={classes.headline}>
          {t('setup')}
        </Typography>
        <TextContents>
          <Typography paragraph variant="body1" component="p">
            {`${t('weHold')} ${selectedIUName}.`}
            <br />
          </Typography>
        </TextContents>

        <div className={classes.charts}>
          <div className={classes.chart}>
          <Tooltip
              title={t('inferredPrevalence')}
              aria-label="info"
            >
            <Typography
              variant="h6"
              component="h6"
              className={`${classes.headline} ${classes.withHelp}`}
            >
              {t('estimatedPrevalence')} (
              {selectedIUData[0] && selectedIUData[0].endemicity})
            </Typography>
          </Tooltip>
            <PrevalenceMiniGraph data={selectedIUData[0]} disease={props.disease} />
          </div>
          {props.disease === DISEASE_LIMF && <div className={classes.chart}>
          <Tooltip
              title={t('blueBars')}
              aria-label="info"
            >
            <Typography
              variant="h6"
              component="h6"
              className={`${classes.headline} ${classes.withHelp}`}
            >
              {t('espen')}
            </Typography>
            </Tooltip>
            <div className="bars setup">
              {simState.IUData.mdaObj &&
                mdaObjTimeFiltered.time.map((e, i) => (
                  <div
                    key={`bar-setup-${i}`}
                    className={`bar setup c${mdaObjTimeFiltered.coverage[i]}`}
                    title={
                      mdaObjTimeFiltered.time[i] +
                      ', ' +
                      mdaObjTimeFiltered.coverage[i] +
                      ', ' +
                      mdaObjTimeFiltered.adherence[i] +
                      ', ' +
                      mdaObjTimeFiltered.bednets[i] +
                      ', ' +
                      mdaObjTimeFiltered.regimen[i] +
                      ' '
                    }
                  >
                    <span
                      style={{
                        height: mdaObjTimeFiltered.coverage[i],
                      }}
                    ></span>
                  </div>
                ))}
            </div>
            <div className="bars setup">
              {simState.IUData.mdaObj &&
                mdaObjTimeFiltered.time.map((e, i) => (
                  <Typography
                    key={`bar-legend=${i}`}
                    className={`${classes.legend}`}
                    component="p"
                  >
                    {'‘' +
                      (2000 + mdaObjTimeFiltered.time[i] / 12)
                        .toString()
                        .substr(-2)}
                  </Typography>
                ))}
            </div>
          </div>}
        </div>

        <TextContents>
          <Typography paragraph variant="body1" component="p">
            {t('setup1')}<br></br>{t('setup2')}<br></br>{t('setup3')}
          </Typography>
        </TextContents>



        <div className={classes.settings}>
        
          {props.children}

        </div>

        <TextContents>
          <Typography variant="h3" component="h6" className={classes.headline}>
            {t('disruption')}
          </Typography>
          <Typography paragraph variant="body1" component="p">
            {t('disruption1')}
            <br />
            {t('disruption2')}
          </Typography>
        </TextContents>

        <div className={classes.scenariosWrap}>
          <div className={`${classes.buttonsControl}`}>
            <SettingSpecificScenario inModal={false} />
          </div>
        </div>

        <Button onClick={submitSetup} variant="contained" color="primary">
          {t('predictions')}
        </Button>
      </section>
  )
}
export default observer( PerDiseaseSetup );
