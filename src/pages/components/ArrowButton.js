import React from 'react';
import { makeStyles, Link, Typography } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

import ArrowIcon from 'images/icon-navigation-expand-more-24-px.svg';

const useStyles = makeStyles(theme => ({
  root: {
    clear: 'both',
    padding: theme.spacing(0),
    backgroundImage: `url(${ArrowIcon})`,
    backgroundPosition: 'right 5px center',
    backgroundSize: 'auto',
    backgroundColor: theme.palette.basic.white,
    backgroundRepeat: 'no-repeat',
    padding: "10px 41px 10px 14px",
    minWidth: 140,
    display: "inline-block",
    transition: "all 0.3s ease-in-out",
    borderRadius: 2,
    boxShadow: "0 0 1px 0 rgba(0, 0, 0, 0.5)",
    border: "solid 1px #cccccc",
    '&:hover': {
      border: "solid 1px #000000",
      textDecoration: "none"
    }
  }
}));


const ArrowButton = ({ text, url }) => {

  const classes = useStyles();

  return (
    <Link className={classes.root} component={RouterLink} to={url} color="inherit">
      <Typography variant="body1" component="span">{text}</Typography>
    </Link>
  );
}

export default ArrowButton;
