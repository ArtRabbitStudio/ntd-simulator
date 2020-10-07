import React from 'react';
import Layout from 'layout/Layout';
import Typography from '@material-ui/core/Typography';

import Head from 'pages/components/Head';
import TextContents from 'pages/components/TextContents'

const DataMethodology = (props) => {

  return (
    <Layout>
      <Head
        title=" "
        
      />
      <TextContents>
      <Typography gutterBottom variant="h2">Data & Methodology </Typography>
        <Typography paragraph variant="body1" component="p">
        This page should give an overview of how different teams work with data and models
       
        </Typography>
        

      </TextContents>
    </Layout>
  )
}
export default DataMethodology;
