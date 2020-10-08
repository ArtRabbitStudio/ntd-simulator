import { Button, Typography, Tooltip } from '@material-ui/core';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { map } from 'lodash';
import PrevalenceMiniGraph from 'components/PrevalenceMiniGraph';
import { useDataAPI, useUIState } from 'hooks/stateHooks';
import { useSimulatorStore } from 'store/simulatorStore';
import TextContents from 'pages/components/TextContents';
import useStyles from 'theme/Setup';
import { SettingSpecificScenario } from 'pages/components/simulator/settings';
import { loadAllIUhistoricData } from 'pages/components/simulator/helpers/iuLoader';

const PerDiseaseSetup = (props) => {
  const [isLoading, setIsLoading] = useState(false)

  const history = useHistory()
  const classes = useStyles()
  const { simState, dispatchSimState } = useSimulatorStore()
  const { country, implementationUnit, disease } = useUIState()

  console.log( `PerDiseaseSetup rendering for ${country}, ${implementationUnit}, ${disease}` );

  const {
    selectedIUData
  } = useDataAPI()


  const doWeHaveData = simState.IUData.id === implementationUnit
  const loadData = async () => {
    await loadAllIUhistoricData(
      simState,
      dispatchSimState,
      implementationUnit,
      disease
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

  if (isLoading) {
    return (
        <section className={classes.section}>
          <Typography variant="h3" component="h6" className={classes.headline}>
            Loading setup for {selectedIUName}
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
          Setup
        </Typography>
        <TextContents>
          <Typography paragraph variant="body1" component="p">
            {`We hold the following information for ${selectedIUName}.`}
            <br />
          </Typography>
        </TextContents>

        <div className={classes.charts}>
          <div className={classes.chart}>
          <Tooltip
              title="Inferred prevalence based on geostatistical maps interpolating through space and projected forward in time using the transmission model."
              aria-label="info"
            >
            <Typography
              variant="h6"
              component="h6"
              className={`${classes.headline} ${classes.withHelp}`}
            >
              Estimated prevalence (
              {selectedIUData[0] && selectedIUData[0].endemicity})
            </Typography>
          </Tooltip>
            <PrevalenceMiniGraph data={selectedIUData[0]} />
          </div>
          <div className={classes.chart}>
          <Tooltip
              title="White bars show no intervention;  blue bars show intervention, the height of the blue colour shows coverage."
              aria-label="info"
            >
            <Typography
              variant="h6"
              component="h6"
              className={`${classes.headline} ${classes.withHelp}`}
            >
              Espen intervention data (MDA)
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
          </div>
        </div>

        <TextContents>
          <Typography paragraph variant="body1" component="p">
            Set up your simulation scenario by selecting environmental factors and MDA settings. <br></br>then click "Predictions" or one of the disruption buttons to simulate potential outcomes. <br></br>You can edit your setup at any time or create a new scenario.
          </Typography>
        </TextContents>



        <div className={classes.settings}>
        
          {props.children}

        </div>

        <TextContents>
          <Typography variant="h3" component="h6" className={classes.headline}>
            Disruption
          </Typography>
          <Typography paragraph variant="body1" component="p">
            Are you interested in a specific disruption scenario?
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
  )
}
export default observer( PerDiseaseSetup );