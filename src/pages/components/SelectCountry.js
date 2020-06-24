import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { match, useRouteMatch } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import { useDataAPI, useUIState } from '../../hooks/stateHooks'
import { useHistory } from 'react-router-dom'

import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import FormControl from '@material-ui/core/FormControl'

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

    const history = useHistory()
    const matchSection = useRouteMatch('/:section')

    const { countrySuggestions } = useDataAPI()
    const { country } = useUIState()


    const handleCountryChange = (event, value) => {
        let section = 'trends'
        if (matchSection) {
            section = matchSection.params.section
        }
        // country has been selected // are we already on a page that can show country data
        if (section !== 'trends' && section !== 'hotspots') {
            section = 'trends'
        }
        if (value) {
            history.push({ pathname: `/${section}/${value.id}` })
            // country has been deselected
        } else {
            history.push({ pathname: `/${section}` })
        }


    }

    const selected = countrySuggestions.find(x => x.id === country)

    return (
        <Box className={classes.root}>

            <FormControl className={`${classes.formControl} countries`}>
                <Autocomplete
                    id="combo-box-demo"
                    options={countrySuggestions}
                    getOptionLabel={option => option.name}
                    value={selected ?? { name: 'All countries' }}
                    renderInput={params => (
                        <TextField {...params} label="View" />
                    )}
                    onChange={handleCountryChange}
                />
            </FormControl>

        </Box>
    )
}


export default observer(SelectCountry)
