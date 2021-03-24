import React from 'react'
import AccordionElement from 'pages/components/AccordionElement';
import IntroWrap from '../Intro'
import { useTranslation } from "react-i18next";
import { DISEASE_SCH_MANSONI } from 'AppConstants'

export default function IntroHW(props) {
  const { t } = useTranslation();
  return (

    <IntroWrap ident={DISEASE_SCH_MANSONI}>
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

