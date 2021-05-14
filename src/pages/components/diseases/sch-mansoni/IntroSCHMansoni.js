import React from 'react'
import AccordionElement from 'pages/components/AccordionElement';
import IntroWrap from '../Intro'
import { useTranslation } from "react-i18next";
import { DISEASE_SCH_MANSONI } from 'AppConstants'

export default function IntroHW(props) {
  const { t } = useTranslation(['translation','sch-mansoni']);
  return (

    <IntroWrap ident={DISEASE_SCH_MANSONI}>
      <AccordionElement title={t('sch-mansoni:summaryTab1Title')}>
        {t('sch-mansoni:summaryTab1Content')}
      </AccordionElement>
      <AccordionElement title={t('sch-mansoni:summaryTab2Title')}>
        {t('sch-mansoni:summaryTab2Content')}
      </AccordionElement>
    </IntroWrap>

  )
}

