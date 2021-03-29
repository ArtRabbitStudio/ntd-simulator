import React from 'react';
import Layout from 'layout/Layout';
import Typography from '@material-ui/core/Typography';

import Head from 'pages/components/Head';
import TextContents from 'pages/components/TextContents'
import { useTranslation } from 'react-i18next';
import MarkdownContent from 'pages/components/MarkdownContent';

const About = (props) => {
  const { t } = useTranslation(['translation','pages-about']);

  return (
    <Layout>

      <Head
        title=" "
        
      />

      <TextContents>
      <Typography gutterBottom variant="h2">{t('about0')}</Typography>
        

        {/* Styling for this content */}
        <MarkdownContent markdown={t('pages-about:content')} />

      </TextContents>  



    </Layout>
  )
}
export default About;
