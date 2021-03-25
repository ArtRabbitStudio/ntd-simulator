import React from 'react'
import DetailWrap from '../Detail'
import { useTranslation } from "react-i18next";
import TextContents from 'pages/components/TextContents'
import RightPartComponent from '../RightPartComponent'
import MarkdownContent from 'pages/components/MarkdownContent';
import { DISEASE_STH_WHIPWORM } from 'AppConstants'


export default function DetailWW(props) {
  const { t } = useTranslation(['translation','sth']);

  const leftPart = (
    <TextContents>

      {/* Styling for this content */}
      <MarkdownContent markdown={t('sth:detailContent')} />

    </TextContents>
  )

  const rightPart = (
    <React.Fragment>

      <RightPartComponent
        headline={t('sth:detailRightActionHeadline')}
        text={t('sth:detailRightActionIntro')}
        buttons={[
          { text: t('sth:detailRightActionButton'), url: `/${DISEASE_STH_WHIPWORM}` },
        ]}
      />

      <RightPartComponent
        headline={t('sth:detailRightInfoHeadline')}
        buttons={[
          { text: t('sth:detailRightInfoButton1'), url: `${t('sth:detailRightInfoButton1Target')}` },
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

    <DetailWrap disease={DISEASE_STH_WHIPWORM} leftPart={leftPart} rightPart={rightPart} />

  )
}