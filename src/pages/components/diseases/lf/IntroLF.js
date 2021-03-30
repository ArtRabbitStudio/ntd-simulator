import React from 'react'
import AccordionElement from 'pages/components/AccordionElement';
import IntroWrap from '../Intro'
import { useTranslation } from "react-i18next";
import { DISEASE_LIMF } from 'AppConstants'

export default function IntroLF(props) {
  const { t } = useTranslation(['translation','lf']);

  
  return (

    <IntroWrap ident={DISEASE_LIMF}>
      <AccordionElement title={t('lf:summaryHeadline')}>
        {t('lf:summaryTab1Title')}
        {t('lf:summaryTab1Content')}
      </AccordionElement>
      <AccordionElement title={t('lf:summaryTab2Title')}>
        {t('lf:summaryTab2Content')}
      </AccordionElement>
    </IntroWrap>

  )
}
