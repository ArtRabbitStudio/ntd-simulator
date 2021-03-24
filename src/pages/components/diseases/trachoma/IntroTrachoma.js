import React from 'react'
import AccordionElement from 'pages/components/AccordionElement';
import IntroWrap from '../Intro'
import { useTranslation } from "react-i18next";
import { DISEASE_TRACHOMA } from 'AppConstants'

export default function IntroTrachoma(props) {
  const { t } = useTranslation();
  return (

    <IntroWrap ident={DISEASE_TRACHOMA}>
      <AccordionElement title={t('Geographic and historic MDA data')}>
        {t('Geographic and historic MDA data')}
        {t('modelText')}
      </AccordionElement>
      <AccordionElement title={t('modelAndMethodology')}>
        {t('model1')}<a href="https://journals.plos.org/plosntds/article?id=10.1371/journal.pntd.0006531" rel="noopener noreferrer">Pinsent A &amp; Hollingsworth TD (2018)</a>{t('model2')}

      </AccordionElement>
    </IntroWrap>

  )
}