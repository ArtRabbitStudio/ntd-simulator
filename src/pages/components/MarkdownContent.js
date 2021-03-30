import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import ReactMarkdown from 'markdown-to-jsx';

const styles = (theme) => ({
  listItem: {
    marginTop: theme.spacing(1),
  },
  withMargin: {
    marginTop: theme.spacing(6),
  }
});



const options = {
  overrides: {
    h1: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'h3',
        component: 'h2'
      },
    },
    h2: { component: Typography, props: { gutterBottom: true, variant: 'h3', component: 'h2' } },
    h3: {
      component: withStyles(styles)(({ classes, ...props }) => (
        <Typography gutterBottom variant="h3" {...props} className={classes.withMargin} />
      )),
    },
    h4: { component: Typography, props: { gutterBottom: true, variant: 'h3', component: 'h2' } },
    h5: { component: Typography, props: { gutterBottom: true, variant: 'h3', component: 'h2' } },
    h6: { component: Typography, props: { gutterBottom: true, variant: 'h3', component: 'h2' } },

    p: { component: Typography, props: { component: 'p', paragraph: true, variant: 'body1' } },
    a: { component: Link },
    li: {
      component: withStyles(styles)(({ classes, ...props }) => (
        <li className={classes.listItem}>
          <Typography component="span" {...props} />
        </li>
      )),
    },
  },
};

const MarkdownContent = props => {
  return <ReactMarkdown options={options}>{props.markdown}</ReactMarkdown>
}


export default MarkdownContent


//h3: { component: Typography, props: { gutterBottom: true, variant: 'h3', component: 'h2' } },