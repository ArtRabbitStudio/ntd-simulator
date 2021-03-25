import React from 'react'
import DetailWrap from '../Detail'
import { useTranslation } from "react-i18next";
import RightPartComponent from '../RightPartComponent'
import TextContents from 'pages/components/TextContents'
import MarkdownContent from 'pages/components/MarkdownContent';
import { DISEASE_SCH_MANSONI } from 'AppConstants'

export default function DetaiMansoni(props) {
  const { t } = useTranslation(['translation','sch-mansoni']);


  const leftPart = (
    <TextContents>

      {/* Styling for this content */}
      <MarkdownContent markdown={t('sch-mansoni:detailContent')} />

    </TextContents>
  )

  const rightPart = (
    <React.Fragment>

      <RightPartComponent
        headline={t('sch-mansoni:detailRightActionHeadline')}
        text={t('sch-mansoni:detailRightActionIntro')}
        buttons={[
          { text: t('sch-mansoni:detailRightActionButton'), url: `/${DISEASE_SCH_MANSONI}` },
        ]}
      />

      <RightPartComponent
        headline={t('sch-mansoni:detailRightInfoHeadline')}
        buttons={[
          { text: t('sch-mansoni:detailRightInfoButton1'), url: `${t('sch-mansoni:detailRightInfoButton1Target')}` },
        ]}
      />

      <RightPartComponent
        headline={t('helpUsImprove')}
        buttons={[
          { text: t('helpUsImprove'), url: `/get-involved` },
          { text: t('reportAProblem'), url: `/get-involved` },
        ]}
      />

    </React.Fragment>
  )

  return (

    <DetailWrap disease={DISEASE_SCH_MANSONI} leftPart={leftPart} rightPart={rightPart} />

  )
}