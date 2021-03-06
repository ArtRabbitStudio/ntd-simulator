import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Typography, Grid } from '@material-ui/core';
import { NavLink } from 'react-router-dom';

import Logo from 'images/ntd-logo.svg';

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 810,
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
    bottomMargin: {
        marginBottom: 80
    },
    title: {
        margin: theme.spacing(0, 0, 1, 0),
        textTransform: 'uppercase',
        fontSize: 14,
        letterSpacing: 1
    },
    pageHeader: {
        textDecoration: 'none',
        color: theme.palette.text.primary,
    },
    head: {
        marginTop: 30,
        marginBottom: 40
    },
    beta: {
        backgroundColor: '#ffc914',
        padding: 5
    }
}));

const Head = ({ title, classAdd, intro }) => {

    const classes = useStyles();
    classAdd = classAdd ? classAdd : '';
    

    return (
        <Box className={`${classes.card}  ${classAdd} ${!intro && classes.bottomMargin}`}>

            <NavLink to='/' className={classes.pageHeader} >
                <Typography variant="h1" component="h2">NTD Prevalence Simulator </Typography>
                <Typography variant="h6" component="h6" className={`${classes.headline}`} >Africa <span className={classes.beta}>Beta version</span></Typography>
                {intro && 
                    <Grid item md={6} xs={12} className={classes.head}>
                        <Typography paragraph variant="body1" component="p">{intro}</Typography>
                    </Grid>
                }
            </NavLink>

            
        </Box>
    )
}
export default Head;
