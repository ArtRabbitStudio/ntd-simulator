import React from 'react';
import { makeStyles, Typography, Box } from '@material-ui/core';
import CapsHeadline from './CapsHeadline'
import ArrowButton from './ArrowButton'

const TextWithImage = ({ caption, headline, image, imageAlt, children, buttonUrl, buttonText }) => {

  const useStyles = makeStyles(theme => ({
    root: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      margin: theme.spacing(5, 0, 4, 0),

    },
    image: {
      position: "relative",
      zIndex: 2,
      margin: 0,
      '& img': {
        maxWidth: "100%",
        height: "auto"
      },
      [theme.breakpoints.up('md')]: {
        flexBasis: "40%",
      }
    },
    text: {
      position: "relative",
      zIndex: 2,
      padding: theme.spacing(2, 4, 2, 0),
      [theme.breakpoints.up('md')]: {
        flexBasis: "60%",
      }
    },
    headline: {
      margin: theme.spacing(1, 0),
    }
  }));

  const classes = useStyles();

  return (
    <div className={`${classes.root} text-with-image`} >


      <Box display="block" variant="body2" component="article" className={classes.text}>
        <CapsHeadline text={caption} />
        <Typography variant="h3" component="h3" className={classes.headline}>{headline}</Typography>
        {children}
        {(buttonUrl && buttonText) && <ArrowButton text={buttonText} url={buttonUrl} />}
      </Box>
      <figure className={classes.image}>
        <img src={image} alt={imageAlt} />
      </figure>
    </div>
  );
}

export default TextWithImage;