import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import ArrowButton from './ArrowButton'
import { useTranslation } from 'react-i18next';


const Evolving = (props) => {

  const { t } = useTranslation();

  const useStyles = makeStyles(theme => ({
    root: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      margin: theme.spacing(5, 0, 3, 0),
    },
    hideInPrint: {
      "@media print": {
        display: "none"
      }
    },
    btns: {
      display: "block",
      width: "100%",
      position: "relative",

      '& a': {
        margin: theme.spacing(0, 0, 2, 3),
        '&:first-child': {
          margin: theme.spacing(0),
        }
      }

    },
    headline: {
      margin: theme.spacing(0, 0, 2, 0),
    }
  }));

  const classes = useStyles();

  return (
    <div className={`${classes.root} ${classes.hideInPrint}`} >
      <Typography variant="h3" component="h3" className={classes.headline}>{t('thisProjectIsConstantlyEvolving')}</Typography>
      <div className={classes.btns}>
        <ArrowButton text={t('helpUsImprove')} url="/help-us-improve" />
        <ArrowButton text={t('reportAProblem')} url="/help-us-improve" />
      </div>
    </div>
  );
}

export default Evolving;