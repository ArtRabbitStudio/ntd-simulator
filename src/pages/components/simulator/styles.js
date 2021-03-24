import { makeStyles } from "@material-ui/core/styles";
import Random from "images/systemic-random.svg";
import Same from "images/systemic-same.svg";
import Anopheles from "images/Anopheles.jpg";
import Culex from "images/Culex.jpg";
import InfoIcon from "images/info.svg";
import RemoveIcon from "images/delete-icon-blue.svg";
import graphTypeIconSimple from "images/graph-icon.svg";
import graphTypeIconComplex from "images/graph-complex-icon.svg";
import SettingsIcon from 'images/settings.svg';
import AddIcon from 'images/add.svg';

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: 24,
  },
  formControl: {
    margin: theme.spacing(0, 0, 1, 0),
    minWidth: "100%",
    "&.spaced": {
      margin: theme.spacing(0, 0, 3, 0),
    },

    "& > label": {},
  },
  formControlSelect: {
    margin: theme.spacing(0, 0, 1, 0),
  },
  formControlText: {
    margin: theme.spacing(0, 0, -1, 0),
  },
  rightControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    flexWrap: "nowrap",
    '& h6:not(.closer)': {
      margin: theme.spacing(0, 2, 0, 0),
    },
    [theme.breakpoints.up('md')]: {
      //margin: theme.spacing(-2, 0, -2, 0),
    }
  },

  leftControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexWrap: "nowrap",
    '& h6': {
      margin: theme.spacing(0, 2, 0, 0),
    },
    [theme.breakpoints.up('md')]: {
      //margin: theme.spacing(-2, 0, -2, 0),
    }
  },
  centerControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "nowrap",
    '& h6': {
      margin: theme.spacing(0, 2, 0, 0),
    },
    [theme.breakpoints.up('md')]: {
      //margin: theme.spacing(-2, 0, -2, 0),
    }
  },
  controlsRow: {
    padding: theme.spacing(1, 0),
    borderBottom: "1px solid #e0e0e0",
  },
  caps: {
    textTransform: "uppercase",
    fontSize: 14,
    letterSpacing: 1,
    display: "inline-flex"
  },
  formControlPrecision: {
    display: "block",
    float: "left",
    margin: theme.spacing(0, 0, 0, 4),
    width: 300,
  },
  precisionLabel: {
    display: "block",
    float: "left",
    fontSize: 14,
    height: 24,
    lineHeight: '14px',
    padding: '7px 0px 0px 0px',
    margin: 0

  },
  precisionSlider: {
    margin: theme.spacing(0, 2, 0, 0),
    display: "block",
    float: "left",
    width: 120
  },
  formControlPrevalence: {
    float: 'right',
    margin: theme.spacing(0, 2, 0, 0),
  },
  metricSelector: {
    maxWidth: 250,
    width: 250,
    '& .MuiPopover-root': {
      transform: 'translate(-200px, 0)'
    }
  },
  addScenario: {
    '& .MuiTab-wrapper': {
      backgroundImage: `url(${AddIcon})`,
      backgroundPosition: 'left center',
      backgroundSize: 'auto',
      backgroundRepeat: 'no-repeat',
      paddingLeft: 32,
    },
    '&:hover': {
      backgroundColor: "rgb(204, 232, 244)",
      '& .MuiTab-wrapper': {
        //backgroundImage: `url(${IconHover})`,

      }
    }
  },

  contentLeftColumn: {},
  settingsIcon: {
    backgroundColor: "transparent",
    boxShadow: 'none',
    '& .MuiTouchRipple-root': {
      backgroundImage: `url(${SettingsIcon})`,
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
  removeIcon: {
    backgroundColor: "transparent",
    boxShadow: "none",
    zIndex: 9,

    "& .MuiTouchRipple-root": {
      backgroundImage: `url(${RemoveIcon})`,
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
  printIcon: {
    backgroundColor: "transparent",
    boxShadow: "none",
    zIndex: 9,

    "& .MuiTouchRipple-root": {
      backgroundImage: `url(${RemoveIcon})`,
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
  downloadIcon: {
    backgroundColor: "transparent",
    boxShadow: "none",
    zIndex: 9,

    "& .MuiTouchRipple-root": {
      backgroundImage: `url(${RemoveIcon})`,
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


  graphTypeIconSimple: {
    backgroundColor: "transparent",
    boxShadow: "none",
    marginLeft: 10,
    zIndex: 9,

    "& .MuiTouchRipple-root": {
      backgroundImage: `url(${graphTypeIconSimple})`,
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
  graphTypeIconComplex: {
    backgroundColor: "transparent",
    boxShadow: "none",
    marginLeft: 10,
    zIndex: 9,

    "& .MuiTouchRipple-root": {
      backgroundImage: `url(${graphTypeIconComplex})`,
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
  selectPaper: {
    // hack to fix Material UI popover position when disablePortal is true
    left: `${theme.spacing(2)}px !important`,
    maxHeight: 'none !important',
    top: `${theme.spacing(2)}px !important`
  },
  simulatorBody: {
    position: "relative",
    padding: theme.spacing(4, 2, 2, 6),
  },
  simulatorInnerBody: {
    position: "relative",
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    "& > *": {
      margin: theme.spacing(1, 0),
    },
  },
  simulator: {
    width: `calc(100% + ${theme.spacing(12)}px)`,
    marginLeft: -theme.spacing(6),
    position: "relative",
  },
  tabs: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(0, 6),
    borderBottom: "1px solid #e0e0e0",
  },

  chartContainer: {
    position: "relative",
    width: "100%",
    padding: 0,
  },
  chartTitle: {
    display: "block",
    margin: theme.spacing(0, 2, 0, 0),
  },
  precision: {
  },
  progress: {
    width: "100%",
    position: "absolute",
    textAlign: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: 0,
    "& > span": {
      margin: 0,
      fontSize: 14,
      letterSpacing: 1,
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
    },
    "& > p": {
      marginTop: 20
    },
  },
  updateScenario: {
    position: "absolute",
    top: 10,
    left: "50%",
    transform: "translate(-50%, 0%)",
  },
  legend: {
    float: 'left',
    width: 30,
    height: 110,

  },
  legendText: {
    fontSize: 12,
    textAlign: 'right'
  },
  legendTextBottom: {
    marginTop: 90
  },
  buttonBG: {
    backgroundColor: "#fff"
  },
  withSlider: {
    margin: theme.spacing(0, 0, 6, 0),
    whiteSpace: "nowrap",
  },
  withHelp: {
    cursor: "help",
    backgroundImage: `url(${InfoIcon})`,
    backgroundPosition: "right 4px",
    backgroundSize: "auto",
    backgroundRepeat: "no-repeat",
    width: "fit-content",
    paddingRight: 30,
    padding: theme.spacing(1, 0),
  },
  centered: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  modalButton: {
    width: "50%",
    //borderTopLeftRadius: 0,
    //borderTopRightRadius: 0,
    borderRadius: 0,
    '&.light': {
      backgroundColor: "#cce8f4"
    }
  },
  roundModal: {
    padding: theme.spacing(3, 3, 0, 3),
    borderRadius: 0,
    width: 310,
    position: "absolute",
    left: "50%",
    bottom: 116,
    transform: "translate(-50%, 0%)",
  },
  modalButtons: {
    display: "flex",
    flexDirection: "row",
    margin: theme.spacing(0, 0, 0, -3),
    width: `calc(100% + ${theme.spacing(6)}px)`,
  },
  adherence: {
    height: 110,
    width: "100%",
    position: "relative",
    "&:after, &:before": {
      content: `''`,
      position: "absolute",
      top: 0,
      width: 100,
      height: 100,
    },
    "&:before": {
      left: 0,
      backgroundImage: `url(${Random})`,
      backgroundPosition: "left center",
      backgroundSize: "auto",
      backgroundRepeat: "no-repeat",
    },
    "&:after": {
      right: 0,
      backgroundImage: `url(${Same})`,
      backgroundPosition: "right center",
      backgroundSize: "100px",
      backgroundRepeat: "no-repeat",
    },
  },

  imageOptions: {
    paddingTop: theme.spacing(2),
    justifyContent: 'space-between'
  },
  imageOption: {
    paddingTop: 74,
    minWidth: 120,
    "&.anopheles": {
      backgroundImage: `url(${Anopheles})`,
      backgroundPosition: "14px top",
      backgroundSize: "112px 74px",
      backgroundRepeat: "no-repeat",
    },
    "&.culex": {
      backgroundImage: `url(${Culex})`,
      backgroundPosition: "14px top",
      backgroundSize: "112px 74px",
      backgroundRepeat: "no-repeat",
    },
    "& .MuiFormControlLabel-label": {
      fontSize: "1rem",
    },
  },
  scenarioGraph: {
    position: "relative",
  },
  mdaplaceholder: {
    height: 100,
    marginTop: 5,
    marginRight: 50,
    marginBottom: 20,
    marginLeft: 50,
  },
  scenarioGraphLegend: {
    whiteSpace: "nowrap",
    marginBottom: -40,
    marginTop: 10,
    position: "relative",
    zIndex: 5,
    '& h6': {
      display: 'inline-block'
    }
  },
  scenarioGraphLegendHistoric: {
    marginLeft: 50,
  },
  scenarioGraphLegendPrediction: {
    width: 150
  },
  scenarioGraphLegendInterventions: {
    marginLeft: 50,
  },
}));

export default useStyles;
