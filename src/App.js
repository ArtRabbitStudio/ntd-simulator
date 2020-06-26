import React from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import useSyncRouteState from "./hooks/useSyncRouteState";

import ScrollToTop from "./pages/components/ScrollToTop";
import Home from "./pages/Home";
import Page from "./pages/Page";
import Country from "./pages/Country";
import Setup from "./pages/Setup";
import Simulator from "./pages/Simulator";

// index.js
import { StoreProvider } from "./store/simulatorStore";

//import 'typeface-roboto'
//import 'typeface-libre-franklin'

import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

// root element styles
import "./App.scss";

const theme = createMuiTheme({
  palette: {
    tooltip: {
      color: "#f1f1f1",
      rippleBackgroundColor: "#D86422",
    },
    text: {
      primary: "#2c3f4d",
      secondary: "#616161",
    },
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#008dc9",
      line: "#bdbdbd",
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: "#e9f1f7",
      dark: "#cce8f4",
      main: "#ffc914", //
      contrastText: "#2c3f4d",
    },
    success: {
      contrastText: "#2c3f4d",
      dark: "#388e3c",
      light: "#81c784",
      main: "#4caf50",
    },
    warning: {
      contrastText: "#2c3f4d",
      dark: "#f57c00",
      light: "#ffb74d",
      main: "#ff9800",
    },
    reds: {
      high: "#FF4C73",
      full: "#A91636",
      eighty: "#BA455E",
      sixty: "#CB7386",
      forty: "#DDA2AF",
      twenty: "#EED0D7",
    },
    greens: {
      high: "#32C2A2",
      full: "#32C2A2",
      eighty: "#5BCEB4",
      sixty: "#84DAC7",
      forty: "#ADE6DA",
      twenty: "#D6F3EC",
    },
    error: {
      main: "#FF4C73",
    },
  },
  typography: {
    fontSize: 18,
    fontWeight: 400,
    fontFamily: "DINNextLTPro, sans-serif",
    headline: {
      fontFamily: "DINNextLTPro, sans-serif",
    },

    h1: {
      fontFamily: "DINNextLTPro, sans-serif",
      fontWeight: "normal",
      fontSize: "2.75rem",
    },
    h2: {
      fontFamily: "DINNextLTPro, sans-serif",
      fontWeight: "normal",
      fontSize: "1.75rem",
    },
    h3: {
      fontFamily: "DINNextLTPro, sans-serif",
      fontWeight: "normal",
      fontSize: "1.475rem",
    },
    h4: {
      fontFamily: "DINNextLTPro, sans-serif",
      fontWeight: "normal",
      fontSize: "1.25rem",
    },
    h5: {
      fontFamily: "DINNextLTPro, sans-serif",
      fontWeight: "normal",
      fontSize: "1.125rem",
    },
    h6: {
      textTransform: "uppercase",
      //fontFamily: "DINNextLTPro, sans-serif",
      //fontWeight: 800
      fontSize: "0.75rem",
    },
    subtitle2: {
      fontSize: 22,
    },
    subtitle1: {
      fontWeight: 700,
    },
    body1: {
      fontSize: 18,
    },
    button: {
      fontWeight: 400,
    },
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        color: "#fff",
        backgroundColor: "#D86422",
      },
    },
    MuiFormLabel: {
      root: {
        color: "#000000",
        fontWeight: 500,
        fontSize: 18,
        marginBottom: 8,
      },
    },
    MuiOutlinedInput: {
      root: {
        //backgroundColor: "#fff",
      },
    },
    MuiSelect: {
      outlined: {
        backgroundColor: "#fff",
        "&.MuiSelect-outlined": {
          paddingRight: 42,
        },
      },
      icon: {
        top: "calc(50% - 16px)",
      },
    },

    MuiInput: {
      underline: {
        "&:before": {
          borderBottom: `1px solid #e0e0e0`,
        },
      },
    },
    MuiButton: {
      contained: {
        color: "#2c3f4d",
      },
    },
    MuiTab: {
      textColorSecondary: {
        "&$selected": {
          color: "#000000",
          backgroundColor: "#ffc914",
        },
      },
      root: {
        "&$selected": {
          color: "#000000",
          backgroundColor: "#ffc914",
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1556,
    },
  },
});

console.log(theme);

function App() {
  const location = useLocation();
  useSyncRouteState();

  return (
    <CssBaseline>
      <ThemeProvider theme={theme}>
        <StoreProvider>
          <ScrollToTop /*location={location}*/>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/country/:country" component={Country} />
              <Route exact path="/setup/:country/:iu" component={Setup} />
              <Route
                exact
                path="/simulator/:country?/:iu?"
                component={Simulator}
              />
              <Route exact path="**" component={Page} />
            </Switch>
          </ScrollToTop>
        </StoreProvider>
      </ThemeProvider>
    </CssBaseline>
  );
}

export default App;
