import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Link } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    flexWrap: "nowrap",
    '& > ul': {
      display: "flex",
      alignItems: "center",
      flexWrap: "nowrap",
      padding: 0,
      '& > li': {
        display: 'block',
        listStyleType: 'none',
        padding: 0,
        margin: 0
      }
    }
  },
  headline: {
    color: theme.palette.basic.white,
    margin: theme.spacing(0, 0, 0, 0),
  },
  switch: {
    color: theme.palette.basic.white,
    display: "inline-block",
    padding: "2px 5px",
    margin: "0px 0px 0px 10px",
    border: `1px solid ${theme.palette.basic.white}`,
  }
}));
// <button mat-button aria-label="settings" className={classes.icon} onClick={(event) => handleClickOpen(event)}></button>
const LanguageSwitch = ({ current = 'en-US' }) => {

  const classes = useStyles();

  const languages = [
    { code: 'en-US', name: 'English', 'url': '/' },
    { code: 'pt-PT', name: 'Português', 'url': '/pt' },
    { code: 'fr-FR', name: 'Français', 'url': '/fr' },
  ]

  return (
    <nav className={classes.root}>
      <Typography variant="h6" component="h6" className={classes.headline} >Also available in:</Typography>

      <ul>
        {languages
          .filter(l => l.code !== current)
          .map((lang, i) => {
            return (
              <li key={i}>
                <Link
                  href={lang.url}
                  lang={lang.code}
                  aria-label={`Switch to ${lang.name}`}
                  hrefLang={lang.code}
                  className={classes.switch}
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
