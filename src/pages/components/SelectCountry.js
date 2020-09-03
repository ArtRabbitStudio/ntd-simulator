import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { useRouteMatch } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import { useDataAPI, useUIState } from '../../hooks/stateHooks'
import { useHistory } from 'react-router-dom'

import ConfirmationDialog from "./ConfirmationDialog";

import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import FormControl from '@material-ui/core/FormControl'

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: 9,
    position: 'relative',
  },
  box: {
    zIndex: 9,
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(0, 0, 4, 0),
    [theme.breakpoints.up('md')]: {
    },
    [theme.breakpoints.up('lg')]: {
    },
  },
  formControl: {
    margin: theme.spacing(0, 0, 0, 0),
    width: '100%',
    textAlign: 'left',
    '& > label': {},
    '& input': {
      fontSize: 18

    },
    '&.countries': {
      margin: theme.spacing(0, 0, 2, 0),
    },
    '&.countries input': {
      fontSize: 26,
      color: '#2c3f4d'

    },
    [theme.breakpoints.up('sm')]: {
    },
    [theme.breakpoints.up('md')]: {
      width: '50%',
      '& input': {
        fontSize: 24

      },
      '&.countries input': {
        fontSize: 44

      },
    },
    [theme.breakpoints.up('lg')]: {
    },
  },
}))

const SelectCountry = ({ selectIU, showConfirmation }) => {
  console.log( "SelectCountry render()" );
  const classes = useStyles()
  const history = useHistory()
  const matchSection = useRouteMatch('/:section')

  const { countrySuggestions, iusByCountrySuggestions,  } = useDataAPI()
  const { country, implementationUnit } = useUIState()

  const [goTo, setGoTo] = useState(false);

  const navigate = (url) => {
    let u = url ? url : goTo;
    history.push({ pathname: u })
  }

  const handleCountryChange = (event, value) => {
    console.log( 'SelectCountry handleCountryChange' );
    let section = 'country'
    if (matchSection) {
      if (matchSection.params.section !== 'simulator') { // keep the page, not for simulator
        //section = matchSection.params.section
      }
    }

    if (value) {
      let url = `/${section}/${value.id}`;
      if (showConfirmation) {
        setGoTo(url)
        setConfirmatonOpen(true);
      } else {
        navigate(url)
      }
    }

  }

  const handleIUChange = (event, value) => {
    console.log( 'SelectCountry handleIUChange' );
    let section = 'setup'
    if (value) {
      let url = `/${section}/${country}/${value.id}`
      if (showConfirmation) {
        setGoTo(url)
        setConfirmatonOpen(true);
      } else {
        navigate(url)
      }
    }

  }

  // confirmation for change the country
  const [confirmatonOpen, setConfirmatonOpen] = useState(false);
  const confirmedRemoveCurrentScenario = () => {
    // confirmed
    setConfirmatonOpen(false);
    navigate()
  };

  const defaultCountrySuggestionOption = { name: "Select a country" };
  const defaultIUSuggestionOption = { name: "Select IU" };

  const countrySuggestionsWithDefault = [ defaultCountrySuggestionOption ].concat( countrySuggestions );
  const selected = countrySuggestionsWithDefault.find(x => x.id === country)
  const activeIUs = [ defaultIUSuggestionOption ].concat( iusByCountrySuggestions.filter(x => (x.prevalence !== null && x.endemicity !== "Non-endemic") ) )
  const selectedIU = activeIUs.find(x => x.id === implementationUnit)

  return (
    <React.Fragment>
      <Box className={classes.box}>

        <FormControl className={`${classes.formControl} countries`}>
          <Autocomplete
            id="combo-box-demo"
            options={countrySuggestionsWithDefault}
            getOptionLabel={option => option.name}
            getOptionSelected={ ( a, b ) => { return a.name === b.name } } // stop the Autocomplete warning barf
            value={selected ?? defaultCountrySuggestionOption}
            renderInput={params => (
              <TextField {...params} /*InputProps={{ ...params.InputProps, disableUnderline: true }}*/ />
            )}
            onChange={handleCountryChange}
          />
        </FormControl>

        {selectIU &&
          <FormControl className={`${classes.formControl}`}>
            <Autocomplete
              id="iu"
              options={activeIUs}
              getOptionLabel={option => ( option.relatedStateName ? `${option.name} (${option.relatedStateName})` : `${option.name}` ) }
              getOptionSelected={ ( a, b ) => { return a.name === b.name } } // stop the Autocomplete warning barf
              value={selectedIU ?? defaultIUSuggestionOption}
              renderInput={params => (
                <TextField {...params}/* InputProps={{ ...params.InputProps, disableUnderline: true }}*/ />
              )}
              onChange={handleIUChange}
            />
          </FormControl>
        }
      </Box>

      {showConfirmation &&
        <ConfirmationDialog
          title="Do you want to leave this scenario?"
          onClose={() => {
            setConfirmatonOpen(false);
          }}
          onConfirm={confirmedRemoveCurrentScenario}
          open={confirmatonOpen}
        />
      }
    </React.Fragment>
  )
}


export default observer(SelectCountry)
