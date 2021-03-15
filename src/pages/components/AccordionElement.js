import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Box, Typography, AccordionDetails, Accordion, AccordionSummary } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CapsHeadline from './CapsHeadline'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.basic.white,
    marginBottom: '10px !important',
    '&.MuiPaper-elevation1': {
      boxShadow: "none"
    },
  },


}))

const AccordionElement = props => {
  const classes = useStyles();

  return (
    <Box>
      <Accordion className={classes.root}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <CapsHeadline text={props.title} />
        </AccordionSummary>
        <AccordionDetails>
          <Grid item md={6} xs={12} className={classes.head}>
            <Typography paragraph variant="body1" component="p">
              {props.children}
            </Typography>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}


export default AccordionElement
