import React from 'react';
import { useTranslation } from "react-i18next";

import {
  Typography, Tooltip
} from '@material-ui/core'

function ScenarioGraphLegend({ classes, width, tooltipText }) {

  const { t } = useTranslation();

  tooltipText = tooltipText ? tooltipText : 'Default tooltip text'

  return (
    <div className={classes.scenarioGraphLegend}>

      <Typography className={`${classes.scenarioGraphLegendHistoric} `} style={{ width: width }} variant="h6" component="h6">
        <Tooltip
          title={tooltipText}
          aria-label="info"
        >
          <span className={`${classes.withHelp}`}>
            {t('historic')}
          </span>
        </Tooltip>
      </Typography>

      <Typography className={classes.scenarioGraphLegendPrediction} variant="h6" component="h6">
        {t('prediction')}
      </Typography>

    </div>
  )
}

export default ScenarioGraphLegend;