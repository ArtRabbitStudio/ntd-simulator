import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(theme => ({
    root: {
        clear: 'both',
        padding: theme.spacing(0),
    }
}));

const TextContents = (props) => {

    const classes = useStyles();

    return (
        <div className={`${classes.root}`}>

            <Box display="block" variant="body2" component="article">
                {props.children}
            </Box>
        </div>
    );
}

export default TextContents;
