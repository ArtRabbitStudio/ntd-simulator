import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';

import Icon from 'images/settings.svg';
//import IconHover from 'images/settings-hover.svg';

import CloseButton from 'pages/components/CloseButton';
//import { geoNaturalEarth1Raw } from 'd3';

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: 99,
  },
  button: {
    width: '100%',
    borderRadius: 0
  },
  modal: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    zIndex: 999,
    transform: 'translate(-50%, -50%)',
    padding: theme.spacing(0),
    minWidth: 300,
    borderRadius: 0
  },
  body: {
    padding: theme.spacing(4, 4, 2, 4),
  },
  form: {
    padding: theme.spacing(1, 0, 0, 0),
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    '& .MuiFormControl-root': {
      width: '100%',
      padding: theme.spacing(0, 0, 2, 0),
    }
  },
  icon: {
    backgroundColor: "transparent",
    boxShadow: 'none',
    marginRight: 10,
    '& .MuiTouchRipple-root': {
      backgroundImage: `url(${Icon})`,
      backgroundPosition: 'center',
      backgroundSize: 'auto',
      backgroundRepeat: 'no-repeat',
    },
    '&:hover': {
      backgroundColor: "rgb(204, 232, 244)",
      '& .MuiTouchRipple-root': {
        //backgroundImage: `url(${IconHover})`,

      }
    }
  },
}));
// <button mat-button aria-label="settings" className={classes.icon} onClick={(event) => handleClickOpen(event)}></button>
const ChartSettings = ({ title, buttonText, cancelText, cancel, action, onOpen, children, hideFab, newScenarioSettingsOpen }) => {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  title = title ? title : t('settings');
  buttonText = buttonText ? buttonText : t('updateGraphs');

  const handleClickOpen = () => {
    setOpen(true);
    if (onOpen) {
      onOpen();
    }
  };

  const handleClickClose = (event) => {

    setOpen(false);
    if (cancel) {
      cancel(event);
    }
  };

  const handleConfirm = (event) => {
    setOpen(false);
    if (action) {
      action(event);
    }
  };

  const igorsCheatStyle = {
    padding: "6px 25px"
  };

  useEffect(() => {
    if (newScenarioSettingsOpen) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [newScenarioSettingsOpen]);


  return (
    <div className={classes.root}>
      { hideFab === true ? null : (<Fab color="inherit" aria-label="settings" className={classes.icon} onClick={handleClickOpen}> </Fab>)}
      { open &&
        <ClickAwayListener onClickAway={handleClickClose}>
          <Paper
            elevation={3}
            className={classes.modal}
          >
            <CloseButton action={handleClickClose} />

            <div className={classes.body}>
              <Typography variant="h3" component="h3">{title}</Typography>
              <div className={classes.form}>
                {children}
              </div>
            </div>

            <div className={classes.modalButtons}>
              <Button onClick={(event) => handleClickClose(event)} className={`${classes.modalButton} light`} style={igorsCheatStyle} variant="contained">{cancelText}</Button>
              <Button onClick={(event) => handleConfirm(event)} className={classes.modalButton} style={igorsCheatStyle} variant="contained" color="primary">{buttonText}</Button>
            </div>
          </Paper>
        </ClickAwayListener>
      }
    </div>
  )
}
export default ChartSettings;
