import React from 'react'
import AccordionElement from 'pages/components/AccordionElement';
import IntroWrap from '../Intro'
import { useTranslation } from "react-i18next";
import { DISEASE_STH_HOOKWORM } from 'AppConstants'

export default function IntroHW(props) {
  const { t } = useTranslation(['translation','sth']);
  return (

    <IntroWrap ident={DISEASE_STH_HOOKWORM}>
      <AccordionElement title={t('sth:summaryTab1Title')}>
        {t('sth:summaryTab1Content')}
      </AccordionElement>
      <AccordionElement title={t('sth:summaryTab2Title')}>
        {t('sth:summaryTab2Content')}
      </AccordionElement>
    </IntroWrap>

  )
}