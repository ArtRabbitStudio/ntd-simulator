import React from 'react'
import DetailWrap from '../Detail'
import { useTranslation } from "react-i18next";
import TextContents from 'pages/components/TextContents'
import RightPartComponent from '../RightPartComponent'
import { DISEASE_STH_HOOKWORM } from 'AppConstants'
import MarkdownContent from 'pages/components/MarkdownContent';

export default function DetaiHW(props) {
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
          { text: t('sth:detailRightActionButton'), url: `/${DISEASE_STH_HOOKWORM}` },
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
          { text: t('helpUsImprove'), url: `/help-us-improve` },
          { text: t('reportAProblem'), url: `/help-us-improve` },
        ]}
      />

    </React.Fragment>
  )

  return (

    <DetailWrap disease={DISEASE_STH_HOOKWORM} leftPart={leftPart} rightPart={rightPart} />

  )
}