import React from 'react'
import DetailWrap from '../Detail'
import { useTranslation } from "react-i18next";
import TextContents from 'pages/components/TextContents'
import RightPartComponent from '../RightPartComponent'
import MarkdownContent from 'pages/components/MarkdownContent';
import { DISEASE_TRACHOMA } from 'AppConstants'

export default function DetailTrachoma(props) {
  const { t } = useTranslation(['translation','trachoma']);


  const leftPart = (
    <TextContents>

      {/* Styling for this content */}
      <MarkdownContent markdown={t('trachoma:detailContent')} />

    </TextContents>
  )

  const rightPart = (
    <React.Fragment>

      <RightPartComponent
        headline={t('trachoma:detailRightActionHeadline')}
        text={t('trachoma:detailRightActionIntro')}
        buttons={[
          { text: t('trachoma:detailRightActionButton'), url: `/${DISEASE_TRACHOMA}` },
        ]}
      />

      <RightPartComponent
        headline={t('trachoma:detailRightInfoHeadline')}
        buttons={[
          { text: t('trachoma:detailRightInfoButton1'), url: `${t('trachoma:detailRightInfoButton1Target')}` },
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

    <DetailWrap disease={DISEASE_TRACHOMA} leftPart={leftPart} rightPart={rightPart} />

  )
}