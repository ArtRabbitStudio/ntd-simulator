import { makeStyles } from '@material-ui/core/styles'
import InfoIcon from "images/info-24-px.svg";

const useStyles = makeStyles((theme) => ({
  withSlider: {
    margin: theme.spacing(0, 0, 6, 0),
    whiteSpace: 'nowrap',
  },
  settings: {
    position: 'relative',
    padding: theme.spacing(4, 0, 0, 0),
    display: 'flex',
    flexDirection: 'column',

    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
  },
  section: {
    position: 'relative',
    backgroundColor: theme.palette.secondary.light,
    width: `calc(100% + ${theme.spacing(12)}px)`,
    marginLeft: -theme.spacing(6),
    padding: theme.spacing(4, 6),
  },
  charts: {
    position: 'relative',
    backgroundColor: theme.palette.secondary.dark,
    margin: theme.spacing(0, 0, 4, 0),
    '&:after': {
      content: `''`,
      display: 'table',
      clear: 'both',
    },
  },
  heading: {
    color: '#000',
    fontSize: 18,
    fontWeight: 500,
  },
  accordionTitle: {
    padding: theme.spacing(1, 0, 1, 0),
    color: '#000',
    fontSize: 18,
    fontWeight: 500,
  },
  mT: {
    marginTop: theme.spacing(2)
  },
  chart: {
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
    backgroundColor: theme.palette.secondary.dark,
    [theme.breakpoints.up('md')]: {
      textAlign: 'left',
      float: 'left',
      width: 'calc(50% - 16px)',
      '&.fullwidth': {
        width: '100%',
        textAlign: 'left',
      },
    },
  },
  legend: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
    width: 30,
    marginTop:25, 
    marginBottom: 0,
    marginLeft: -3,
  },
  scenariosWrap: {
    padding: theme.spacing(4),
    margin: theme.spacing(0, 0, 3, 0),
    backgroundColor: 'white',
  },
  headline: {
    color: theme.palette.text.primary,
    margin: theme.spacing(0, 0, 3, 0),
  },
  formControlWrap: {
    padding: theme.spacing(4),
    margin: theme.spacing(0, 0, 3, 0),
    backgroundColor: 'white',

    [theme.breakpoints.up('md')]: {
      textAlign: 'center',
      float: 'left',
      width: 'calc(50% - 16px)',
      '&.fullwidth': {
        width: '100%',
        textAlign: 'left',
      },
    },
  },
  withHelp: {
    cursor: "help",
    backgroundImage: `url(${InfoIcon})`,
    backgroundPosition: "right center",
    backgroundSize: "auto",
    backgroundRepeat: "no-repeat",
    width: "fit-content",
    paddingRight: 30,
    padding: theme.spacing(1, 0),
    paddingBottom:0,
    marginBottom:0
  },
  buttonsControl: {
    margin: theme.spacing(0),
    '& > button': {
      margin: theme.spacing(0, 1, 1, 0),
    },
    [theme.breakpoints.up('md')]: {
      width: '100%',
    },
  },
  setupFormControl: {
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(0, 10, 0, 10),
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: 460,
      margin: 'auto',
      textAlign: 'center'
      //display: "inline-block",
    },
  },
  halfFormControl: {
    [theme.breakpoints.up('md')]: {
      width: 'calc(50% - 16px)',
    },
  },
}))

  export default useStyles;