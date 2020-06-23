import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { match, useRouteMatch } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import { useDataAPI, useUIState } from '../../hooks/stateHooks'
import { useHistory } from 'react-router-dom'

import Box from '@material-ui/core/Box'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

import {
    DISEASE_LABELS, DISEASE_LIMF
} from '../../constants'

const useStyles = makeStyles(theme => ({
    root: {
        zIndex: 9,
        position: 'relative',
    },
    formControl: {
        margin: theme.spacing(0, 0, 2, 0),
        width: 'calc(100% - 16px)',
        textAlign: 'left',
        '& > label': {},
        [theme.breakpoints.up('sm')]: {
            margin: theme.spacing(0, 0, 2, 0),
        },
        [theme.breakpoints.up('md')]: {
            margin: theme.spacing(0, 0, 0, 0),
            width: 'calc(50% - 16px)',
        },
        [theme.breakpoints.up('lg')]: {
        },
    },
}))

const SelectCountry = props => {
    const classes = useStyles()

    const { diseases } = useDataAPI()
    const { disease, setDisease } = useUIState()
    const history = useHistory()

    const handleDiseaseChange = (event, value) => {
        setDisease(event);
    }

    return (
        <Box className={classes.root}>
            <FormControl className={`${classes.formControl}`}>
                <InputLabel id="country-label">Select a country</InputLabel>
                <Select
                    labelId="country-label"
                    id="country"
                    value={disease}
                    onChange={handleDiseaseChange}
                >
                    {diseases.map(r => (
                        <MenuItem key={r} value={r}>
                            {DISEASE_LABELS[r]}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    )
}


export default observer(SelectCountry)
