import React from 'react'
import DetailWrap from '../Detail'
import { useTranslation } from "react-i18next";
import TextContents from 'pages/components/TextContents'
import RightPartComponent from '../RightPartComponent'
import { DISEASE_LIMF } from 'AppConstants';
import MarkdownContent from 'pages/components/MarkdownContent';

export default function DetaiLF(props) {
  const { t } = useTranslation(['translation','lf']);

  const leftPart = (
    <TextContents>

      {/* Styling for this content */}
      <MarkdownContent markdown={t('lf:detailContent')} />

    </TextContents>
  )

  const rightPart = (
    <React.Fragment>

      <RightPartComponent
        headline={t('lf:detailRightActionHeadline')}
        text={t('lf:detailRightActionIntro')}
        buttons={[
          { text: t('lf:detailRightActionButton'), url: `/${DISEASE_LIMF}` },
        ]}
      />

      <RightPartComponent
        headline={t('lf:detailRightInfoHeadline')}
        buttons={[
          { text: t('lf:detailRightInfoButton1'), url: `${t('lf:detailRightInfoButton1Target')}` },
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

    <DetailWrap disease={DISEASE_LIMF} leftPart={leftPart} rightPart={rightPart} />

  )
}