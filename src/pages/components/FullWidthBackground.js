import React from 'react';
import { makeStyles } from '@material-ui/core';

const FullWidthBackground = ({ color, children }) => {

  const useStyles = makeStyles(theme => ({
    root: {
      position: "relative",
      '&:before': {
        content: `''`,
        display: "block",
        position: "absolute",
        left: "-50vw",
        height: "100%",
        width: "150vw",
        backgroundColor: color,
        zIndex: 0
      },
    },
    inner: {
      position: "relative",
      zIndex: 2

    }
  }));

  const classes = useStyles();

  return (
    <div className={classes.root} >
      <div className={classes.inner} >
        {children}
      </div>
    </div>
  );
}

export default FullWidthBackground;