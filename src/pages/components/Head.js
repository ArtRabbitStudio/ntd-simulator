import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom';

import Logo from '../../images/ntd-logo.svg';

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 410,
        zIndex: 20,
        position: "relative",
        float: 'left',
        backgroundColor: '#fff',
    },
    logo: {
        display: 'block',
        backgroundImage: `url(${Logo})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: 228,
        height: 50,
        margin: theme.spacing(0, 0, 4, 0),
        '& > span': {
            display: 'none'
        }
    },
    title: {
        margin: theme.spacing(0, 0, 1, 0),
        textTransform: 'uppercase',
        fontSize: 14,
        letterSpacing: 1
    }
}));

const Head = ({ title, classAdd }) => {

    const classes = useStyles();
    classAdd = classAdd ? classAdd : '';

    return (
        <Box className={`${classes.card}  ${classAdd}`}>

            <NavLink to='/' className={classes.logo}>
                <span>NTD Modelling Consortium</span>
            </NavLink>

            <Typography className={classes.title} variant="body1" component="h1">{title}</Typography>
        </Box>
    )
}
export default Head;
