import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import Head from './Head'
import Inputs from './Inputs'

const useStyles = makeStyles((theme) => ({
  root: {},
  clear: {
    clear: 'both',
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

const HeadWithInputs = ({ title, disableInputs, disableClear, classAdd }) => {
  const classes = useStyles()

  return (
    <div className={classes.headContainer}>
      <div style={{ marginBottom: 80 }}>
        <Grid item md={6} xs={12} className={classes.head}>
          <Head title={title} classAdd={classAdd} />
        </Grid>
        <Grid item md={6} xs={12} className={classes.inputs}>
          {disableInputs !== true && <Inputs />}
        </Grid>
        {disableClear !== true && <div className={classes.clear}></div>}
      </div>
    </div>
  )
}
export default HeadWithInputs
