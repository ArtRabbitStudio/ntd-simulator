import React from 'react';
import Layout from 'layout/Layout';
import Typography from '@material-ui/core/Typography';

import Head from 'pages/components/Head';
import TextContents from 'pages/components/TextContents'
import { useTranslation } from 'react-i18next';

const LF = (props) => {
  const { t, i18n } = useTranslation();

  return (
    <Layout>
      <Head
        title=" "
        
      />
      <TextContents>
      <Typography gutterBottom variant="h2">{t('LF0')}</Typography>
        <Typography paragraph variant="body1" component="p">
        <Typography gutterBottom variant="h3"><br />{t('LF1')}</Typography>
        {t('LF2')}
        </Typography>
        <Typography paragraph variant="body1" component="p">
          {t('LF3')}
        </Typography>
        <Typography gutterBottom variant="h3"><br />{t('LF4')}</Typography>
        <Typography paragraph variant="body1" component="p">    
        {t('LF5')}
        </Typography>
        <Typography gutterBottom variant="h3"><br />{t('LF6')}</Typography>
        <Typography paragraph variant="body1" component="p">
        {t('LF7')}
        </Typography>
        <Typography paragraph variant="body1" component="p">
         {t('LF8')} <a href="http://www.thiswormyworld.org/about-worms/worms/what-are-worms"> {t('LF9')}</a>.
        </Typography>
        <Typography gutterBottom variant="h3"><br />{t('interventions')}</Typography>
        <Typography paragraph variant="body1" component="p">
          {t('LF11')} <a href="http://www.thiswormyworld.org/about-worms/elimination-of-lymphatic-filariasis">{t('LF12')}</a>.
        </Typography>
        <Typography gutterBottom variant="h3"><br />{t('LF13')}</Typography>
        <Typography paragraph variant="body1" component="p">
          {t('LF14')} <a href="https://parasitesandvectors.biomedcentral.com/articles/10.1186/s13071-015-1152-3">{t('LF15')}</a>{t('LF16')}<a href="https://parasitesandvectors.biomedcentral.com/articles/10.1186/s13071-015-1152-3">{t('LF17')}</a>.
          </Typography>
        <Typography gutterBottom variant="h3"><br />{t('LF18')}</Typography>
        <Typography paragraph variant="body1" component="p">
          {t('LF19')}
        </Typography>
        <Typography paragraph variant="body1" component="p">
          {t('LF20')}<a href="https://doi.org/10.1016/j.epidem.2017.02.006">{t('LF21')}</a>{t('LF22')}<a href="https://www.ntdmodelling.org/sites/www.ntdmodelling.org/files/content/EPIFIL_Code%202.zip">{t('LF23')}</a>{t('LF24')}<a href="https://github.com/sempwn/LF-model">{t('LF25')}</a>{t('LF26')}
        </Typography>
        <Typography paragraph variant="body1" component="p">
          {t('LF27')}<a href="https://parasitesandvectors.biomedcentral.com/articles/10.1186/s13071-016-1768-y">{t('LF28')}</a>{t('LF29')}
        </Typography>
        <Typography gutterBottom variant="h3"><br />{t('LF30')}</Typography>
        <Typography paragraph variant="body1" component="p">
          <a href="https://parasitesandvectors.biomedcentral.com/articles/10.1186/s13071-015-1152-3">{t('LF31')}</a><br />
          {t('LF32')} 
          <br />
          <br />
          <a href="http://dx.doi.org/10.1371/journal.pntd.0005206">{t('LF33')}</a><br />
          {t('LF34')}<br />
          <br />
          {t('LF35')}<br />
          <a href="http://www.thiswormyworld.org">{t('LF36')}</a><br />
        </Typography>

        <Typography gutterBottom variant="h3"><br />{t('LF37')}</Typography>
        <Typography paragraph variant="body1" component="p">
          <a href="http://www.cell.com/trends/parasitology/fulltext/S1471-4922(17)30305-7">The Population Biology and Transmission Dynamics of Loa loa</a><br />
            Whittaker C, Walker M, Pion SDS, Chesnais CB, Boussinesq M, Basáñez MG <strong>Trends in Parasitology</strong>, 2018; : Epub<br /><br />
<a href="https://parasitesandvectors.biomedcentral.com/articles/10.1186/s13071-018-2655-5">Identifying co-endemic areas for major filarial infections in sub-Saharan Africa: seeking synergies and preventing severe adverse events during mass drug administration campaigns</a><br />
 Cano J, Basáñez MG, O'Hanlon SJ, Tekle AH, Wanji S, Zouré HG, Rebollo MP, Pullan RL <strong>Parasites and Vectors</strong>, 2018; 1: 70<br /><br />
<a href="http://trstmh.oxfordjournals.org/content/110/2/118.short?rss=1">Understanding the relationship between prevalence of microfilariae and antigenaemia using a model of lymphatic filariasis infection</a><br />
 Michael A. Irvine, Sammy M. Njenga, Shamini Gunawardena, Claire Njeri Wamae, Jorge Cano, Simon J. Brooker and T. Deirdre Hollingsworth <strong>Transactions of the Royal Society of Tropical Medicine and Hygiene</strong>, 2016; : 118-124<br /><br />
<a href="http://bmcmedicine.biomedcentral.com/articles/10.1186/s12916-016-0557-y">Heterogeneous dynamics, robustness/fragility trade-offs, and the eradication of the macroparasitic disease, lymphatic filariasis</a><br />
 Edwin Michael and Brajendra K. Singh <strong>BioMed Central, 2016; : 14:14</strong><br /><br />
<a href="http://www.parasitesandvectors.com/content/8/1/522">Bayesian calibration of simulation models for supporting management of the elimination of the macroparasitic disease, Lymphatic Filariasis</a><br />
 Singh BK, Michael E. <strong>Parasites & Vectors</strong>, 2015; 8: 522<br />
 </Typography>




      </TextContents>
    </Layout>
  )
}
export default LF;
