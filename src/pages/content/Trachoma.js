import React from 'react';
import Layout from 'layout/Layout';
import Typography from '@material-ui/core/Typography';

import Head from 'pages/components/Head';
import TextContents from 'pages/components/TextContents'

const Trachoma = (props) => {

  return (
    <Layout>
      <Head
        title=" "
        
      />
      <TextContents>
      <Typography gutterBottom variant="h2">Trachoma </Typography>
        <Typography paragraph variant="body1" component="p">
        This page should give an overview of dthe data and model etc for Trachoma
        </Typography>
        




      </TextContents>
    </Layout>
  )
}
export default Trachoma;
