import React from 'react'
import AccordionElement from 'pages/components/AccordionElement';
import IntroWrap from '../Intro'
import { useTranslation } from "react-i18next";

export default function IntrosthW(props) {
  const { t, i18n } = useTranslation();
  return (

    <IntroWrap ident='sth-whipworm' detailsUrl="#">
      <AccordionElement title={t('Geographic and historic MDA data')}>
        {t('Geographic and historic MDA data')}
        {t('modelText')}
      </AccordionElement>
      <AccordionElement title={t('modelAndMethodology')}>
        {t('MoreAbout')}
      </AccordionElement>
    </IntroWrap>

  )
}