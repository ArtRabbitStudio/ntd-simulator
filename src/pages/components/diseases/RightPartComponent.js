import React from 'react'
import ArrowButton from 'pages/components/ArrowButton'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    margin: theme.spacing(0, 0, 4, 0),
  },
  btn: {
    margin: theme.spacing(0, 0, 1, 0),
    '&:last-child': {
      margin: theme.spacing(0),
    }
  }
}));

export default function RightPartComponent({ headline, text, buttons }) {

  const classes = useStyles();

  return (

    <div className={classes.root}>
      { headline && <Typography gutterBottom variant="h3">{headline}</Typography>}
      { text &&
        <Typography paragraph variant="body1" component="p">
          {text}
        </Typography>
      }
      { (buttons && buttons.length) &&
        buttons.map((btn,index) => (
          <div key={index} className={classes.btn}>
            <ArrowButton text={btn.text} url={btn.url} />
          </div>
        ))
      }
    </div>

  )
}