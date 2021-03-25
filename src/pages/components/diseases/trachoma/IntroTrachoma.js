import React from 'react'
import AccordionElement from 'pages/components/AccordionElement';
import IntroWrap from '../Intro'
import { useTranslation } from "react-i18next";
import { DISEASE_TRACHOMA } from 'AppConstants'

export default function IntroTrachoma(props) {
  const { t } = useTranslation(['translation','trachoma']);
  return (

    <IntroWrap ident={DISEASE_TRACHOMA}>
      <AccordionElement title={t('trachoma:summaryHeadline')}>
        {t('trachoma:summaryTab1Title')}
        {t('trachoma:summaryTab1Content')}
      </AccordionElement>
      <AccordionElement title={t('trachoma:summaryTab2Title')}>
        {t('trachoma:summaryTab2Content')}
      </AccordionElement>
    </IntroWrap>

  )
}