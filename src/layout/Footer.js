import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles(theme => ({
    root: {
        marginTop: 'auto',
    },
    footer: {
        marginTop: 'auto',
        //backgroundColor: theme.palette.secondary.light,
        color: theme.palette.text.secondary,
    },
    container: {
        padding: theme.spacing(4, 6),
    },
    column: {
        padding: theme.spacing(2, 2, 2, 0),
    },
    menu: {
        display: 'block',
        listStyleType: 'none',
        padding: 0,
        margin: 0
    },
    headline: {
        color: theme.palette.text.primary,
        margin: theme.spacing(0, 0, 3, 0),

    },
    logo: {
        width: 83,
        height: 'auto',
        marginRight: theme.spacing(2),
    }
}));

const Footer = (props) => {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <footer className={classes.footer}>
                <Container className={classes.container} maxWidth="xl" >

                    <Grid container spacing={0}>
                        <Grid item md={3} sm={6} xs={12} className={classes.column}>

                            <Typography variant="h6" component="h6" className={classes.headline} >Data and Methodology</Typography>

                            <ul className={classes.menu}>
                                <Typography component="li" variant="body2"><Link component={RouterLink} to="/data-and-methodolgy" color="inherit">Overview</Link></Typography>
                                <Typography component="li" variant="body2"><Link component={RouterLink} to="/lymphatic-filariasis-data-methodoloy" color="inherit">Lymphatic filariasis</Link></Typography>
                                <Typography component="li" variant="body2"><Link component={RouterLink} to="/trachoma-data-methodoloy" color="inherit">Trachoma</Link></Typography>
                            </ul>

                        </Grid>

                        <Grid item md={3} sm={6} xs={12} className={classes.column}>

                            <Typography variant="h6" component="h6" className={classes.headline} >NTD Modelling Consortium</Typography>

                            <ul className={classes.menu}>
                                <Typography component="li" variant="body2"><Link href="mailto:ntdmodelling@gmail.com" rel="noopener" color="inherit" variant="body2">Send us feedback</Link></Typography>
                                <Typography component="li" variant="body2"><Link component={RouterLink} to="/about" color="inherit">About</Link></Typography>
                                <Typography component="li" variant="body2"><Link href="https://www.ntdmodelling.org/" rel="noopener" target="_blank" color="inherit" variant="body2">www.ntdmodelling.org</Link></Typography>
                                <Typography component="li" variant="body2"><Link component={RouterLink} to="/privacy-cookies" color="inherit">Privacy & Cookies</Link></Typography>
                            </ul>

                        </Grid>
                        <Grid item md={3} sm={6} xs={12} className={classes.column}>
                            <Typography variant="h6" component="h6" className={classes.headline} >Contact</Typography>

                            <Typography display="block" variant="body2">Twitter: <Link href="https://twitter.com/NtdModelling" rel="noopener" target="_blank" color="inherit" variant="body2">@NTD_Modelling</Link></Typography>


                        </Grid>
                        <Grid item md={3} sm={6} xs={12} className={classes.column} >

                        </Grid>

                        <Grid item xs={12} className={classes.column}>
                            <Typography variant="h6" component="h6" className={classes.headline} >designed and made by</Typography>
                            <Link href="https://opencultu.re" rel="noopener" target="_blank" color="inherit" variant="body2">Open Cultu.re</Link>
                        </Grid>

                    </Grid>

                </Container>
            </footer>
        </div>
    )
}
export default Footer;
