import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    clear: 'both',
    padding: theme.spacing(0),
  }
}));

const CapsHeadline = ({ text }) => {

  const classes = useStyles();

  return (
    <Typography variant="h6" component="strong" className={`${classes.root} caps-text`}>{text}</Typography>
  );
}

export default CapsHeadline;
