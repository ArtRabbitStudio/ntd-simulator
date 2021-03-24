import React from 'react';
import Layout from 'layout/Layout';
import Typography from '@material-ui/core/Typography';

import Head from 'pages/components/Head';
import TextContents from 'pages/components/TextContents'
import { useTranslation } from 'react-i18next';

const DataMethodology = (props) => {
  const { t } = useTranslation();

  return (
    <Layout>
      <Head
        title=" "
        
      />
      <TextContents>
      <Typography gutterBottom variant="h2">{t('dataAndMethodology')}</Typography>
        <Typography paragraph variant="body1" component="p">
        {t('thisPage')}
       
        </Typography>
        

      </TextContents>
    </Layout>
  )
}
export default DataMethodology;
