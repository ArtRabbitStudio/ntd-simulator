import React from 'react'
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CapsHeadline from '../CapsHeadline'

import { useTranslation } from "react-i18next";
import {
  DISEASE_LABELS
} from 'AppConstants'

import ico1 from 'images/lf-icon.svg';
import ico2 from 'images/sch-mansoni-icon.svg';
import ico3 from 'images/trachoma-icon.svg';
import ico4 from 'images/sth-whipworm-icon.svg';
import ico5 from 'images/sth-roundworm-icon.svg';
import ico6 from 'images/sth-hookworm-icon.svg';

const useStyles = makeStyles(theme => ({
  section: {
    position: "relative",
    margin: theme.spacing(4, 0, 4, 0),
    padding: theme.spacing(0),
  },
  nodiseasesection: {
    clear:"both",
    position: "relative",
    margin: theme.spacing(4, 0, 4, 0),
    padding: theme.spacing(0),
  },
  withIcon: {
    padding: theme.spacing(0, 12, 0, 0),
    margin: theme.spacing(-1, 0, 2, 0),
    backgroundColor: 'transparent',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right center',
    backgroundSize: "75px 75px",
    minHeight: "75px",
    lineHeight: "75px",
    display: "inline-block",

    '&.icon-lf': {
      backgroundImage: `url(${ico1})`,
    },
    '&.icon-trachoma': {
      backgroundImage: `url(${ico3})`,
    },
    '&.icon-sth-roundworm': {
      backgroundImage: `url(${ico5})`,
    },
    '&.icon-sth-whipworm': {
      backgroundImage: `url(${ico4})`,
    },
    '&.icon-sch-mansoni': {
      backgroundImage: `url(${ico2})`,
    },
    '&.icon-sth-hookworm': {
      backgroundImage: `url(${ico6})`,
    }
  },
  rightPart: {
    flexBasis: "320px",
    backgroundColor: theme.palette.secondary.light,
    padding: theme.spacing(4, 2),

  },
  leftPart: {
    flexBasis: "calc(100% - 320px)",
    padding: theme.spacing(4, 8, 2, 0),

  },
  headline: {
    margin: theme.spacing(0, 0),
  },
  wrap: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
  },
}));


export default function DetailWrap(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { leftPart, rightPart, disease } = { ...props };
  if ( props.disease ){
    return (

      <section className={`${classes.section} icon-${disease}`} >
  
        {props.disease && <CapsHeadline text={t("DiseaseOverview")} />}
        {props.disease && <div>
          <Typography gutterBottom variant="h1" className={`${classes.withIcon} icon-${disease}`}>{DISEASE_LABELS[disease]}</Typography>
        </div>}
  
        <div className={classes.wrap}>
          <div className={classes.leftPart}>
            {leftPart}
          </div>
  
          <div className={classes.rightPart}>
            {rightPart}
          </div>
        </div>
  
      </section>
  
    )
  }
  return (


    <section className={`${classes.nodiseasesection}`}>

      <div className={classes.wrap}>
        <div className={classes.leftPart}>
          {leftPart}
        </div>

        <div className={classes.rightPart}>
          {rightPart}
        </div>
      </div>

    </section>

  )
}
