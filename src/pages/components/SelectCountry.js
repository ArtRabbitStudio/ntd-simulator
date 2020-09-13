import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { useRouteMatch } from 'react-router-dom'

import { useDataAPI, useUIState } from '../../hooks/stateHooks'
import { useHistory } from 'react-router-dom'

import ConfirmationDialog from "./ConfirmationDialog";
import { Box, TextField,FormControl,Fab } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete'
import useStyles from '../../theme/SelectCountry'


const SelectCountry = ({ selectIU, showConfirmation, showBack }) => {
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
  
  const handleBackToCountry = () => {
    const section = 'country'
    const url = `/${section}/${country}`;
    if (showConfirmation) {
      setGoTo(url)
      setConfirmatonOpen(true);
    } else {
      navigate(url)
    }
  }


  const handleCountryChange = (event, value) => {
    const section = 'country'
    if (matchSection) {
      if (matchSection.params.section !== 'simulator') { // keep the page, not for simulator
        //section = matchSection.params.section
      }
    }

    if (value) {
      const url = `/${section}/${value.id}`;
      if (showConfirmation) {
        setGoTo(url)
        setConfirmatonOpen(true);
      } else {
        navigate(url)
      }
    }

  }

  const handleIUChange = (event, value) => {
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
            id="country"
            options={countrySuggestionsWithDefault}
            getOptionLabel={option => option.name}
            getOptionSelected={ ( a, b ) => { return a.name === b.name } } // stop the Autocomplete warning barf
            value={selected ?? defaultCountrySuggestionOption}
            renderInput={params => (
              <TextField {...params} /*InputProps={{ ...params.InputProps, disableUnderline: true }}*/ />
            )}
            onChange={handleCountryChange}
          />
          {showBack && <Fab
          color="inherit"
          aria-label="REMOVE SCENARIO"
          disabled={false}
          className={classes.reloadIcon}
          onClick={()=>{handleBackToCountry()}}
        >
          &nbsp;
        </Fab>}
        </FormControl>
        

        {selectIU &&
          <FormControl className={`${classes.formControl} ius` }>
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
