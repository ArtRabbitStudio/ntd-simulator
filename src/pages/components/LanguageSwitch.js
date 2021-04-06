import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    flexWrap: "nowrap",
    width: "100%",
    justifyContent: "flex-end",
    color: theme.palette.basic.white,
    position: "relative",
    top: 2,

    '& button': {
      background: "transparent",
      color: theme.palette.basic.white,
      transition: "all 0.3s ease-in-out",
      padding: "5px 10px 3px 10px",
      cursor: "pointer",
      border: `1px solid ${theme.palette.basic.white}`,
      '&:focus, &:hover': {
        background: theme.palette.primary.dark,
        border: `1px solid ${theme.palette.basic.white}`,
      }
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

      '& button': {
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.text.primary}`,
        '&:focus, &:hover': {
          background: theme.palette.secondary.light,
          border: `1px solid ${theme.palette.text.primary}`,
        }
      },
    },
    [theme.breakpoints.up('lg')]: {

    },
    [theme.breakpoints.up('sm')]: {

    },
  },
  headline: {
    margin: theme.spacing(0, 0, 0, 0),
    lineHeight: 1,
    whiteSpace: "nowrap"
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
      <Typography variant="h6" component="h6" className={classes.headline} >{`${t('alsoAvailableIn')}:`}</Typography>

      <ul>
        {languages
          .filter(l => {
            return l.short !== i18n.language
          })
          .map((lang, i) => {
            return (
              <li key={i}>
                <button
                  lang={lang.code}
                  hrefLang={lang.code}
                  className={classes.switch}
                  aria-label={`${t('switchTo')} ${lang.name}`}
                  onClick={() => handleClick(lang.short)}
                >
                  <Typography variant="h6" component="span" className={classes.headline} >{lang.name}</Typography>
                </button>
              </li>
            );
          })}
      </ul>

    </nav>
  )
}
export default LanguageSwitch;
