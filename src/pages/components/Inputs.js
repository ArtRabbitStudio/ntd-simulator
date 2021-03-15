import React from 'react'
import { observer } from 'mobx-react'

import { makeStyles } from '@material-ui/core/styles'
import { useDataAPI, useUIState } from 'hooks/stateHooks'

import { Box, MenuItem, Typography, FormControl, Select } from '@material-ui/core'

import { useTranslation } from 'react-i18next';

import {
  DISEASE_LABELS
} from 'AppConstants'

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: 9,
    position: 'relative',
    margin: theme.spacing(0, 0, 2, 0),
    width: 'calc(100% - 16px)',
  },
  formControl: {
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
  headline: {
    display: "block",
    margin: theme.spacing(0, 0, 1, 0),
  }
}))


const Inputs = props => {
  const classes = useStyles()
  const { t, i18n } = useTranslation();
  const { diseases } = useDataAPI()
  const { disease } = useUIState()


  const handleDiseaseChange = (event, value) => {

    props.onChange(value.props.value)
  }

  return (
    <Box className={classes.root}>

      <Typography variant="h6" component="span" className={`${classes.headline}`} >{t('disease')}</Typography>

      <FormControl className={`${classes.formControl}`}>
        <Select
          labelId="disease-label"
          id="disease"
          value={disease ? disease : 'other'}
          variant="outlined"
          onChange={handleDiseaseChange}
          MenuProps={{ disablePortal: true }}

        >
          {diseases.map(r => (
            <MenuItem key={DISEASE_LABELS[r]} value={r}>
              {DISEASE_LABELS[r]}
            </MenuItem>
          ))}
          <MenuItem key="other" value="other">
            {t('otherDiseases')}
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}


export default observer(Inputs)
