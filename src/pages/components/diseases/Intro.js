import React from 'react'
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowButton from '../ArrowButton'

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
    backgroundColor: theme.palette.secondary.light,
    background: "linear-gradient(to bottom,  rgba(232,234,235,1) 0%,rgba(249,249,249,01) 100%)",
    width: `calc(100% + ${theme.spacing(12)}px)`,
    margin: theme.spacing(12, 0, 0, -6),
    padding: theme.spacing(4, 6, 6, 6),
  },
  marginBottom: {
    marginBottom: theme.spacing(2)
  },
  headlinesWrap: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    margin: theme.spacing(0, 0, 4, 0),

  },
  btn: {
    flexBasis: "20%",
    textAlign: "right"
  },
  headlines: {
    position: "relative",
    zIndex: 2,
    flexBasis: "80%",
    padding: theme.spacing(2, 4, 2, 12),
    backgroundColor: 'transparent',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'left center',
    backgroundSize: "75px 75px",
    minHeight: 85,
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
  headline: {
    margin: theme.spacing(0, 0),
  }
}));


export default function IntroWrap(props) {
  //const { t } = useTranslation();
  const { t } = useTranslation(['translation',props.ident]);
  const classes = useStyles();

  return (

    <section className={`${classes.section} icon-${props.ident}`} >

      <div className={classes.headlinesWrap}>
        <div className={`${classes.headlines} icon-${props.ident}`}>
          <Typography variant="h3" component="h5" className={`${classes.headline}`}>
            {`${t(`${props.ident}:summaryHeadline`)}`}
          </Typography>
          <Typography variant="h5" component="h6" className={classes.subHeadline}>
            {`${t(`${props.ident}:summarySubtitle`)}`}
          </Typography>
        </div>
        <div className={classes.btn}>
          <ArrowButton text={t('fullDetails')} url={`/disease/${props.ident}`} />
        </div>
      </div>




      {props.children}

    </section>

  )
}
