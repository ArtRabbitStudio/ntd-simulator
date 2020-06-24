import React, { Fragment } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import Head from './Head'
import Inputs from './Inputs'

const useStyles = makeStyles(theme => ({
    root: {
    },
    clear: {
        clear: 'both',
    },
    head: {
        textAlign: 'left',
        '&:after': {
            content: `''`,
            display: 'table',
            clear: 'both'
        },

        [theme.breakpoints.up('sm')]: {
        },
        [theme.breakpoints.up('md')]: {
            float: 'left',
            width: 320,
        },
    },
    inputs: {
        textAlign: 'left',
        padding: theme.spacing(0, 0, 2, 0),
        minWidth: 300,
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(0, 0, 2, 0),
        },
        [theme.breakpoints.up('sm')]: {
        },
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
        <Fragment >
            <Grid item md={8} xs={12} className={classes.inputs}>
                {disableInputs !== true && <Inputs />}
            </Grid>
            <Grid item md={4} xs={12} className={classes.head}>
                <Head
                    title={title}
                    classAdd={classAdd}
                />
            </Grid>
            {disableClear !== true && <div className={classes.clear}></div>}
        </Fragment>
    )
}
export default HeadWithInputs
