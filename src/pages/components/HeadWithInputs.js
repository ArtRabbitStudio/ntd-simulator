import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import ConfirmationDialog from "./ConfirmationDialog";

import Head from './Head'
import Inputs from './Inputs'
import { useHistory } from 'react-router-dom'

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
  const [showConfirmation, setshowConfirmation] = useState(false);
  const [selectedValue,setSelectedValue ] = useState(null)
  const history = useHistory()

  const handleChange = (value)=>{
    setSelectedValue(value)
    setshowConfirmation(true);
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
        <Grid item md={6} xs={12} className={classes.head}>
          <Head title={title} classAdd={classAdd} />
        </Grid>
        <Grid item md={6} xs={12} className={classes.inputs}>
          {disableInputs !== true && <Inputs onChange={handleChange} />}
        </Grid>
        {disableClear !== true && <div className={classes.clear}></div>}
    </div>
    <ConfirmationDialog
          title="Do you want to leave this scenario?"
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
