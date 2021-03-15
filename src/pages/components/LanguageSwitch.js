import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Link } from '@material-ui/core';
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    flexWrap: "nowrap",
    width: "100%",
    color: theme.palette.basic.white,

    '& a': {
      color: theme.palette.basic.white,
      border: `1px solid ${theme.palette.basic.white}`,
    },

    '& > ul': {
      display: "flex",
      alignItems: "center",
      flexWrap: "nowrap",
      padding: 0,
      margin: 0,
      '& > li': {
        display: 'block',
        listStyleType: 'none',
        padding: 0,
        margin: 0
      }
    },
    '&.dark': {
      color: theme.palette.text.primary,
      marginTop: - 5,

      '& a': {
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.text.primary}`,
      },
    },
    [theme.breakpoints.up('lg')]: {

    },
    [theme.breakpoints.up('sm')]: {

    },
  },
  headline: {
    margin: theme.spacing(0, 0, 0, 0),
  },
  switch: {
    display: "inline-block",
    padding: "2px 5px",
    margin: "0px 0px 0px 10px",
  }
}));
// <button mat-button aria-label="settings" className={classes.icon} onClick={(event) => handleClickOpen(event)}></button>
const LanguageSwitch = ({ current = 'en-US', dark }) => {

  const classes = useStyles();
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'en-US', name: 'English', 'url': '/', short: 'en' },
    { code: 'pt-PT', name: 'Português', 'url': '/pt', short: 'pt' },
    { code: 'fr-FR', name: 'Français', 'url': '/fr', short: 'fr' },
  ]

  function handleClick(lang) {
    i18n.changeLanguage(lang);
  }


  return (
    <nav className={`${classes.root}  ${dark ? 'dark' : ''}`}>
      <Typography variant="h6" component="h6" className={classes.headline} >Also available in:</Typography>

      <ul>
        {languages
          .filter(l => l.code !== current)
          .map((lang, i) => {
            return (
              <li key={i}>
                <Link
                  href="#"
                  lang={lang.code}
                  aria-label={`Switch to ${lang.name}`}
                  hrefLang={lang.code}
                  className={classes.switch}
                  onClick={() => handleClick(lang.short)}
                >
                  <Typography variant="h6" component="span" className={classes.headline} >{lang.name}</Typography>
                </Link>
              </li>
            );
          })}
      </ul>

    </nav>
  )
}
export default LanguageSwitch;
