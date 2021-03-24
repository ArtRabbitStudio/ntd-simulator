import React from 'react';
import Layout from 'layout/Layout';
import Typography from '@material-ui/core/Typography';

import Head from 'pages/components/Head';
import TextContents from 'pages/components/TextContents'
import { useTranslation } from 'react-i18next';

const About = (props) => {
  const { t } = useTranslation();

  return (
    <Layout>

      <Head
        title=" "
        
      />

      <TextContents>
      <Typography gutterBottom variant="h2">
        {t('about0')}</Typography>
        <Typography paragraph variant="body1" component="p">
          {t('about1')}
        </Typography>
        <Typography paragraph variant="body1" component="p">
          {t('about2')}
        </Typography>
        <Typography paragraph variant="body1" component="p">
        {t('about3')}
        </Typography>
        <Typography paragraph variant="body1" component="p">
        {t('about4')}
          </Typography>
        <Typography paragraph variant="body1" component="p">
        {t('about5')}
          </Typography>
        <Typography paragraph variant="body1" component="p">
        {t('about6')}
          </Typography>
        <Typography paragraph variant="body1" component="p">{t('about7')}</Typography>
        <Typography paragraph gutterBottom variant="body1" component="p">
        {t('about8')}
        </Typography>
        <Typography gutterBottom variant="h3"><br />{t('about9')}</Typography>
        <Typography paragraph variant="body1" component="p"></Typography>
        {t('about10')}
        <Typography paragraph gutterBottom variant="body1" component="p">
        {t('about11')}
        </Typography>
        <Typography paragraph variant="body1" component="p">
        {t('about12')}
        </Typography>
        <Typography paragraph variant="body1" component="p">
        {
        // eslint-disable-next-line
        }<a href="javascript:location='mailto:\u0062\u0065\u0074\u0068\u002e\u0062\u0072\u0075\u0063\u0065\u0040\u0062\u0064\u0069\u002e\u006f\u0078\u002e\u0061\u0063\u002e\u0075\u006b';void 0">Beth Bruce</a>  {t('bigData')}<br />
        {
        // eslint-disable-next-line
        }<a href="javascript:location='mailto:\u006a\u006f\u0061\u006f\u002e\u0072\u0065\u0069\u0073\u0040\u0062\u0064\u0069\u002e\u006f\u0078\u002e\u0061\u0063\u002e\u0075\u006b';void 0">João Reis</a> {t('bigData')}<br />
        {
        // eslint-disable-next-line
        }<a href="javascript:location='mailto:\u0061\u006e\u0064\u0072\u0065\u0069\u0061\u002e\u0076\u0061\u0073\u0063\u006f\u006e\u0063\u0065\u006c\u006f\u0073\u0040\u0062\u0064\u0069\u002e\u006f\u0078\u002e\u0061\u0063\u002e\u0075\u006b';void 0">Dr Andreia Vasconcelos</a> {t('bigData')}<br />
        </Typography>
        <Typography gutterBottom variant="h3"><br />{t('members')}</Typography>
        <Typography paragraph variant="body1" component="p">
        </Typography>
        <Typography paragraph variant="body1" component="p">
          <a href="http://www.case.edu/">{t('case')}</a><br />
          <a href="https://www6.erasmusmc.nl/public-health/?lang=en&amp;reason=404">{t('erasmus')}</a><br />
          <a href="http://www.imperial.ac.uk/">{t('icl')}</a><br />
          <a href="http://www.lstmed.ac.uk/">{t('liverpool')}</a><br />
          <a href="http://www.lshtm.ac.uk/">{t('lstmed')}</a><br />
          <a href="https://www.swisstph.ch/en/">{t('swisstph')}</a><br />
          <a href="https://www.ucsf.edu/">{t('ucsf')}</a><br />
          <a href="http://chicas.lancaster-university.uk/projects/ntd_consortium.html">{t('ul')}</a><br />
          <a href="https://www.nd.edu/">{t('nd')}</a><br />
          <a href="https://www.bdi.ox.ac.uk/">{t('ox')}</a><br />
          <a href="https://warwick.ac.uk/">{t('warwick')}</a><br />
        </Typography>
        <Typography gutterBottom variant="h3"><br />{t('contactUs')}</Typography>
          
        <Typography paragraph variant="body1" component="p">

          {t('weLovefeedback')}<br />
          <br />
          {
          // eslint-disable-next-line
          }<a href="javascript:location='mailto:\u0064\u0065\u0069\u0072\u0064\u0072\u0065\u002e\u0068\u006f\u006c\u006c\u0069\u006e\u0067\u0073\u0077\u006f\u0072\u0074\u0068\u0040\u0062\u0064\u0069\u002e\u006f\u0078\u002e\u0061\u0063\u002e\u0075\u006b';void 0">Professor Déirdre Hollingsworth</a><br />
          {t('ox')}<br />
          <br />
          {
          // eslint-disable-next-line
          }<a href="javascript:location='mailto:\u0062\u0065\u0074\u0068\u002e\u0062\u0072\u0075\u0063\u0065\u0040\u0062\u0064\u0069\u002e\u006f\u0078\u002e\u0061\u0063\u002e\u0075\u006b';void 0">Beth Bruce</a><br />
          {t('ox')}<br />
          <br />
          Big Data Institute<br />
          University of Oxford<br />
          Old Road Campus<br />
          Headington<br />
          Oxford<br />
          OX3 7LF<br />
        </Typography>

      </TextContents>
    </Layout>
  )
}
export default About;
