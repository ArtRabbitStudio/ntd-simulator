import React from 'react'
import { observer } from 'mobx-react'

import { makeStyles } from '@material-ui/core/styles'
import { useDataAPI, useUIState } from 'hooks/stateHooks'

import { Box, MenuItem, Typography, FormControl, Select } from '@material-ui/core'

import { useTranslation } from 'react-i18next';

import ico1 from 'images/lf-icon.svg';
import ico2 from 'images/sch-mansoni-icon.svg';
import ico3 from 'images/trachoma-icon.svg';
import ico4 from 'images/sth-whipworm-icon.svg';
import ico5 from 'images/sth-roundworm-icon.svg';
import ico6 from 'images/sth-hookworm-icon.svg';

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
    padding: theme.spacing(0, 8, 0, 0),
    backgroundColor: 'transparent',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right center',
    backgroundSize: "50px 50px",
    '& > label': {},
    [theme.breakpoints.up('sm')]: {
      margin: theme.spacing(0, 0, 2, 0),
    },
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(0, 0, 0, 0),
      width: 'calc(60% - 16px)',
    },
    [theme.breakpoints.up('lg')]: {
    },
    '&.icon-lf': {
      backgroundImage: `url(${ico1})`,
    },
    '&.icon-trachoma': {
      backgroundImage: `url(${ico3})`,
    },
    '&.icon-sth-roundworm': {
      backgroundImage: `url(${ico5})`,
    },
    '&.sth-whipworm': {
      backgroundImage: `url(${ico4})`,
    },
    '&.mansoni': {
      backgroundImage: `url(${ico2})`,
    },
    '&.sth-hookworm': {
      backgroundImage: `url(${ico6})`,
    }
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

      <FormControl className={`${classes.formControl} icon-${disease}`}>
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
