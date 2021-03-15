import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { useRouteMatch } from 'react-router-dom'

import { useDataAPI, useUIState } from 'hooks/stateHooks'
import { useHistory } from 'react-router-dom'

import ConfirmationDialog from "./ConfirmationDialog";
import CapsHeadline from './CapsHeadline'
import { Box, TextField, FormControl, Fab, Typography } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete'
import useStyles from 'theme/SelectCountry'
import { useTranslation } from 'react-i18next';

import {
  DISEASE_LABELS
} from 'AppConstants'

const SelectCountry = ({ selectIU, showCountryConfirmation, showIUConfirmation, showBack, countyAndIUSet }) => {
  const classes = useStyles()
  const { t, i18n } = useTranslation();
  const history = useHistory()
  const matchSection = useRouteMatch('/:disease/:section/')

  const { countrySuggestions, iusByCountrySuggestions, } = useDataAPI()
  const { disease, country, implementationUnit } = useUIState()

  const [goTo, setGoTo] = useState(false);

  const navigate = (url) => {
    let u = url ? url : goTo;
    history.push({ pathname: u })
  }

  const handleBackToCountry = () => {
    const url = `/${disease}/${country}`;
    if (showCountryConfirmation || showIUConfirmation) {
      setGoTo(url)
      setConfirmatonOpen(true);
    } else {
      navigate(url)
    }
  }


  const handleCountryChange = (event, newCountry) => {
    if (matchSection) {
      if (matchSection.params.section !== 'simulator') { // keep the page, not for simulator
        //section = matchSection.params.section
      }
    }

    if (newCountry) {
      const url = `/${disease}/${newCountry.id}`;
      if (showCountryConfirmation) {
        setGoTo(url)
        setConfirmatonOpen(true);
      } else {
        navigate(url)
      }
    }

  }

  const handleIUChange = (event, newIU) => {
    if (newIU) {
      const url = `/${disease}/${country}/${newIU.id}`;
      if (showIUConfirmation) {
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

  const defaultCountrySuggestionOption = { name: t('selectCountry') };
  const defaultIUSuggestionOption = { name: t('selectIU') };

  const countrySuggestionsWithDefault = [defaultCountrySuggestionOption].concat(countrySuggestions);
  const selected = countrySuggestionsWithDefault.find(x => x.id === country)
  let activeIUs = iusByCountrySuggestions.filter(x => (x.prevalence !== null && x.endemicity !== "Non-endemic"))
  const selectedIU = activeIUs.find(x => x.id === implementationUnit)

  if (!selectIU) {
    activeIUs = [defaultIUSuggestionOption].concat(activeIUs)
  }


  return (
    <React.Fragment>
      <Box className={classes.box}>


        <CapsHeadline text={selectIU ? (countyAndIUSet ? t('setUpScenario') : t('selectIULong')) : t('selectCountry')} />
        {!selectIU && <Typography variant="h1" component="h2" className={classes.diseaseHeadline}>{DISEASE_LABELS[disease]} {t("in")}</Typography>}
        <FormControl className={`${classes.formControl} ${selectIU ? 'large' : 'smaller'}`}>
          <Autocomplete
            id="country"
            options={countrySuggestionsWithDefault}
            getOptionLabel={option => option.name}
            getOptionSelected={(a, b) => { return a.name === b.name }} // stop the Autocomplete warning barf
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
            onClick={() => { handleBackToCountry() }}
          >
            &nbsp;
        </Fab>}
        </FormControl>


        {selectIU &&
          <FormControl className={`${classes.formControl} smaller`}>
            <Autocomplete
              id="iu"
              options={activeIUs}
              getOptionLabel={option => (option.relatedStateName ? `${option.name} (${option.relatedStateName})` : `${option.name}`)}
              getOptionSelected={(a, b) => { return a.name === b.name }} // stop the Autocomplete warning barf
              value={selectedIU ?? defaultIUSuggestionOption}
              renderInput={params => (
                <TextField {...params}/* InputProps={{ ...params.InputProps, disableUnderline: true }}*/ />
              )}
              onChange={handleIUChange}
            />
          </FormControl>
        }
      </Box>

      {showCountryConfirmation &&
        <ConfirmationDialog
          title={t('leave')}
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
