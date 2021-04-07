import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import ConfirmationDialog from "./ConfirmationDialog";

import Head from './Head'
import Inputs from './Inputs'
import LanguageSwitch from './LanguageSwitch'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {},
  clear: {
    clear: 'both',
  },
  hideInPrint: {
    "@media print": {
      display: "none"
    }
  },
  head: {
    textAlign: 'left',
    '&:after': {
      content: `''`,
      display: 'table',
      clear: 'both',
    },

    [theme.breakpoints.up('sm')]: {},
    [theme.breakpoints.up('md')]: {
      float: 'left',
      width: 520,
    },
  },
  inputs: {
    textAlign: 'left',
    padding: theme.spacing(0, 0, 2, 0),
    minWidth: 300,
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(0, 0, 2, 0),
    },
    [theme.breakpoints.up('sm')]: {},
    [theme.breakpoints.up('md')]: {
      float: 'right',
      padding: theme.spacing(0),
      width: 'calc(100% - 320px)',
    },
  },
}))

const HeadWithInputs = ({ title, disableInputs, disableClear, classAdd, showLanguages, disableContirmation }) => {
  const classes = useStyles()
  const { t } = useTranslation();
  const [showConfirmation, setshowConfirmation] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null)
  const history = useHistory()

  const handleChange = (value) => {
    setSelectedValue(value)
    if (disableContirmation !== true) {
      setshowConfirmation(true);
    } else {
      if (value !== 'other' && value != null) {
        history.push(`/${value}`)
      }
    }

  }
  const doChange = () => {
    setshowConfirmation(false)
    if (selectedValue !== 'other' && selectedValue != null) {
      history.push(`/${selectedValue}`)
    }
  }

  return (
    <React.Fragment>
      <div className={classes.headContainer}>
        <Grid item md={8} xs={12} className={`${classes.head}`}>
          <Head classAdd={classAdd} alternativeHeadline={!showLanguages} />
        </Grid>
        <Grid item md={4} xs={12} className={classes.inputs}>

          {disableInputs !== true && <Inputs onChange={handleChange} />}
          {showLanguages === true && <LanguageSwitch onChange={handleChange} dark={true} />}

        </Grid>
        {disableClear !== true && <div className={classes.clear}></div>}
      </div>
      <ConfirmationDialog
        title={t('leave')}
        onClose={() => {
          setshowConfirmation(false);
        }}
        onConfirm={doChange}
        open={showConfirmation}
      />
    </React.Fragment>
  )
}
export default HeadWithInputs
