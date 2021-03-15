import React from 'react'
import AccordionElement from 'pages/components/AccordionElement';
import IntroWrap from '../Intro'
import { useTranslation } from "react-i18next";

export default function IntroLF(props) {
  const { t, i18n } = useTranslation();
  return (

    <IntroWrap ident='lf'>
      <AccordionElement title={t('Geographic and historic MDA data')}>
        {t('Geographic and historic MDA data')}
        {t('modelText')}
      </AccordionElement>
      <AccordionElement title={t('modelAndMethodology')}>
        {t('the')}
        {t('modelText')}
      </AccordionElement>
    </IntroWrap>

  )
}
