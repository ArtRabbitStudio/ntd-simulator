import React, { useState } from 'react'
import { observer } from 'mobx-react'
//import { useRouteMatch } from 'react-router-dom'

import { useDataAPI, useUIState } from 'hooks/stateHooks'
import { useHistory } from 'react-router-dom'

import CapsHeadline from "./CapsHeadline";
import { Box, TextField, FormControl, Fab, Typography } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete'
import useStyles from 'theme/SelectCountry'
import { DISEASE_LABELS } from '../../AppConstants'
import { useTranslation } from 'react-i18next';


const SelectDisease = ({ selectIU, showBack }) => {
  const { t } = useTranslation();
  const classes = useStyles()
  const history = useHistory()

  const { diseases } = useDataAPI()
  const { disease } = useUIState()

  const [goTo] = useState(false);

  const navigate = (url) => {
    let u = url ? url : goTo;
    history.push({ pathname: u })
  }

  const handleChange = (event, value) => {
    //TODO: add alert prompt and ask the user if they want to reset before this chagne is mae
    // useRouteMatch
    // ConfirmationDialog



    if (value === null) {
      return false
    }

    if (DISEASE_LABELS[value.id]) {
      const url = `/${value.id}`;
      navigate(url)
    }

  }


  const defaultSuggestionOption = { name: t('selectDisease') };


  const diseasesSelect = diseases.map((d) => {
    return {
      id: d,
      name: t(DISEASE_LABELS[d])
    }
  })


  const diseasesSelectWithDefault = [defaultSuggestionOption].concat(diseasesSelect);

  const selected = diseasesSelectWithDefault.find(x => x.id === disease)

  return (
    <React.Fragment>
      <Box className={classes.box}>

        <Typography variant="h4" component="p" className={classes.headline} >{t('appDesc')}</Typography>

        <CapsHeadline text={t('selectDisease')} />
        <FormControl className={`${classes.formControl} large`}>
          <Autocomplete
            id="disease"
            options={diseasesSelectWithDefault}
            getOptionLabel={option => option.name}
            getOptionSelected={(a, b) => { return a.name === b.name }} // stop the Autocomplete warning barf
            value={selected ?? defaultSuggestionOption}
            renderInput={params => (
              <TextField {...params} /*InputProps={{ ...params.InputProps, disableUnderline: true }}*/ />
            )}
            onChange={handleChange}
          />
          {showBack && <Fab
            color="inherit"
            aria-label="REMOVE SCENARIO"
            disabled={false}
            className={classes.reloadIcon}
            onClick={handleChange}
          >
            &nbsp;
        </Fab>}
        </FormControl>


      </Box>

    </React.Fragment>
  )
}


export default observer(SelectDisease)
