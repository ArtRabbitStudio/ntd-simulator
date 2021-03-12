import { makeStyles } from '@material-ui/core/styles'
import ReloadIcon from "images/reload-icon.svg";

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: 9,
    position: 'relative',
  },
  box: {
    zIndex: 9,
    position: 'relative',
    width: '100%',
    maxWidth: "50%",
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(0, 0, 4, 0),
    "& p": {
      margin: theme.spacing(0, 0, 4, 0),
    },
    [theme.breakpoints.up('md')]: {
    },
    [theme.breakpoints.up('lg')]: {
    },
  },
  reloadIcon: {
    backgroundColor: "transparent",
    boxShadow: "none",
    float: 'right',
    zIndex: 9,
    marginTop: 10,
    marginLeft: 10,

    "& .MuiTouchRipple-root": {
      backgroundImage: `url(${ReloadIcon})`,
      backgroundPosition: "center",
      backgroundSize: "auto",
      backgroundRepeat: "no-repeat",
    },
    "&:hover": {
      backgroundColor: "rgb(204, 232, 244)",
      "& .MuiTouchRipple-root": {
        //backgroundImage: `url(${IconHover})`,
      },
    },
  },
  formControl: {
    margin: theme.spacing(0, 0, 0, 0),
    width: '100%',
    textAlign: 'left',
    '& > label': {},
    '& input': {
      fontSize: 18

    },
    '&.countries': {
      margin: theme.spacing(0, 0, 2, 0),
      flex: 1,
      flexDirection: 'row',
    },
    '&.countries input': {
      fontSize: 26,
      color: '#2c3f4d'
    },
    '&.countries .MuiAutocomplete-root': {
      width: '80%'
    },
    '&.ius .MuiAutocomplete-root': {
      width: '80%'
    },
    [theme.breakpoints.up('sm')]: {
    },
    [theme.breakpoints.up('md')]: {
      '& input': {
        fontSize: 24

      },
      '&.countries input': {
        fontSize: 44

      },
    },
    [theme.breakpoints.up('lg')]: {
    },
  },
}))

export default useStyles;