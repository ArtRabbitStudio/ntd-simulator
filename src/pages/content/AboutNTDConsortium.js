import React from 'react';
import Layout from 'layout/Layout';
import DetailWrap from 'pages/components/diseases/Detail'
import Head from 'pages/components/Head';
import TextContents from 'pages/components/TextContents'
import { useTranslation } from 'react-i18next';
import MarkdownContent from 'pages/components/MarkdownContent';

const AboutNTDConsortium = (props) => {
  const { t } = useTranslation(['translation','pages-about-ntd']);

  const leftPart = (
    <TextContents>

        {/* Styling for this content */}
        <MarkdownContent markdown={t('pages-about-ntd:content')} />

      </TextContents>  
  )

  const rightPart =  null

  return (
    <Layout>

      <Head
        title=" "
        
      />
      <DetailWrap leftPart={leftPart} rightPart={rightPart} />
    </Layout>
  )
}
export default AboutNTDConsortium;
