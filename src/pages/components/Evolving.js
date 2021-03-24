import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import ArrowButton from './ArrowButton'
import { useTranslation } from 'react-i18next';


const Evolving = (props) => {

  const { t, i18n } = useTranslation();

  const useStyles = makeStyles(theme => ({
    root: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      margin: theme.spacing(5, 0, 3, 0),
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
    <div className={`${classes.root}`} >
      <Typography variant="h3" component="h3" className={classes.headline}>This project is constantly evolving</Typography>
      <div className={classes.btns}>
        <ArrowButton text={t('HelpUsImprove')} url="#" />
        <ArrowButton text={t('ReportAProblem')} url="#" />
        <ArrowButton text={t('ModelCodeOnGithub')} url="#" />
      </div>
    </div>
  );
}

export default Evolving;