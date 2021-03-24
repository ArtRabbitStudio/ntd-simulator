import React from 'react';
import Layout from 'layout/Layout';
import Typography from '@material-ui/core/Typography';

import Head from 'pages/components/Head';
import TextContents from 'pages/components/TextContents'
import { useTranslation } from 'react-i18next';

const PrivacyCookies = (props) => {
  const { t } = useTranslation();

  return (
    <Layout>
        <Head
        title=" "
        
      />

      <TextContents>

      <Typography gutterBottom variant="h2">{t('Cookies1')}</Typography>
        <Typography gutterBottom variant="h3">{t('Cookies2')}</Typography>
        <Typography paragraph variant="body1" component="p">
          {t('Cookies3')}
        </Typography>
        <Typography paragraph variant="body1" component="p">
          {t('Cookies4')}
        </Typography>
        <Typography gutterBottom variant="h3"><br />{t('Cookies5')}</Typography>
        <Typography paragraph variant="body1" component="p">
          {t('Cookies6')}
        </Typography>
        <Typography gutterBottom variant="h3"><br />{t('Cookies7')}</Typography>
        <Typography paragraph variant="body1" component="p">
          {t('Cookies8')}
        </Typography>
        <Typography paragraph variant="body1" component="p">
          {t('Cookies9')}<br />
	          {t('Cookies10')}<br />
	          {t('Cookies11')}<br />
	          {t('Cookies12')}<br />
	          {t('Cookies13')}<br />
	          {t('Cookies14')}<br />
        </Typography>
        <Typography paragraph variant="body1" component="p">
          {t('Cookies15')}<a href="https://support.google.com/ads/answer/2662922?hl=en-GB">{t('Cookies16')}</a>.
        </Typography>
        <Typography gutterBottom variant="h3"><br />{t('Cookies17')}</Typography>
        <Typography paragraph variant="body1" component="p">
          {t('Cookies18')}
          </Typography>
        <Typography paragraph variant="body1" component="p">
          {t('Cookies19')}<br />
              {t('Cookies20')}<br />
              {t('Cookies21')}<br />
        </Typography>
        <Typography paragraph variant="body1" component="p">
          {t('Cookies22')} <a></a>http://www.youronlinechoices.com/uk/opt-out-help
        </Typography>
        <Typography gutterBottom variant="h3"><br />{t('Cookies23')}</Typography>
        <Typography paragraph variant="body1" component="p">
 
{t('Cookies24')}
<br />{t('Cookies25')}
<br />{t('Cookies26')}
<br />{t('Cookies27')}
<br />{t('Cookies28')}
  </Typography>
        <Typography paragraph variant="body1" component="p">
          {t('Cookies29')}
        </Typography>
        <Typography gutterBottom variant="h3"><br />{t('Cookies30')}</Typography>
        <Typography paragraph variant="body1" component="p">
        {t('Cookies31')}
        <br />	{t('Cookies32')}
        <br />	{t('Cookies33')}
        <br />	{t('Cookies34')}
        <br /> 	{t('Cookies35')}
        </Typography>
        <Typography paragraph variant="body1" component="p">
           {t('Cookies36')}
          </Typography>
        <Typography gutterBottom variant="h3"><br />{t('contactUs')}</Typography>
        <Typography paragraph variant="body1" component="p">

{t('Cookies37')}
        <br /><br />
        {
        //eslint-disable-next-line
        }<a href="javascript:location='mailto:\u0064\u0065\u0069\u0072\u0064\u0072\u0065\u002e\u0068\u006f\u006c\u006c\u0069\u006e\u0067\u0073\u0077\u006f\u0072\u0074\u0068\u0040\u0062\u0064\u0069\u002e\u006f\u0078\u002e\u0061\u0063\u002e\u0075\u006b';void 0">Professor Déirdre Hollingsworth</a><br />
          {t('ox')}<br />
          <br />
          {
          //eslint-disable-next-line
          }<a href="javascript:location='mailto:\u0062\u0065\u0074\u0068\u002e\u0062\u0072\u0075\u0063\u0065\u0040\u0062\u0064\u0069\u002e\u006f\u0078\u002e\u0061\u0063\u002e\u0075\u006b';void 0">Beth Bruce</a><br />
          {t('ox')}<br />
<br />Big Data Institute
<br />University of Oxford
<br />Old Road Campus
<br />Headington
<br />Oxford
<br />OX3 7LF
        </Typography>


      </TextContents>
    </Layout>
  )
}
export default PrivacyCookies;
