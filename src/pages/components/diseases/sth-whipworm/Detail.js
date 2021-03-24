import React from 'react'
import DetailWrap from '../Detail'
import { useTranslation } from "react-i18next";
import TextContents from 'pages/components/TextContents'
import RightPartComponent from '../RightPartComponent'
import Typography from '@material-ui/core/Typography';
import { DISEASE_STH_WHIPWORM } from 'AppConstants'


export default function DetailWW(props) {
  const { t } = useTranslation();

  const leftPart = (
    <TextContents>
      <Typography gutterBottom variant="h3" component="h2">About Lymphatic filariasis</Typography>
      <Typography paragraph variant="body1" component="p">
        Lymphatic filariasis is due to filarial parasites which are transmitted to humans through mosquitoes.
      </Typography>
      <Typography paragraph variant="body1" component="p">
        When a mosquito with infective stage larvae bites a person, the parasites are deposited on the person's skin from where they enter the body.
        The larvae then migrate to the lymphatic vessels where they develop into adult worms in the human lymphatic system. Infection is usually acquired in childhood, but the painful and profoundly disfiguring visible manifestations of the disease occur later in life.
        Whereas acute episodes of the disease cause temporary disability, lymphatic filariasis (LF) leads to permanent disability.
      </Typography>
      <Typography gutterBottom variant="h3">Disease Burden</Typography>
      <Typography paragraph variant="body1" component="p">
        LF is endemic in 83 countries and there are an estimated 120 million cases, including 25 million men with hydroceles and 15 million people,
        primarily women, with lymphedema. The disease occurs throughout the tropical areas of Africa, Asia, the Americas and the Pacific,
        with around 66% of the infection clustered in South-East Asia and most of the remaining infection (~33%) centered in Africa.
      </Typography>
    </TextContents>
  )

  const rightPart = (
    <React.Fragment>

      <RightPartComponent
        headline="Modelling Lymphatic filariasis"
        text="Calculate predictions based on the model, start by"
        buttons={[
          { text: "Selecting a country", url: `/${DISEASE_STH_WHIPWORM}` },
        ]}
      />

      <RightPartComponent
        headline="Get involved"
        buttons={[
          { text: "Modelling paper", url: `/${DISEASE_STH_WHIPWORM}` },
          { text: "Model code on github", url: `/${DISEASE_STH_WHIPWORM}` },
        ]}
      />

      <RightPartComponent
        headline="Help us improve"
        buttons={[
          { text: "Help us improve", url: `/${DISEASE_STH_WHIPWORM}` },
          { text: "Report a problem", url: `/${DISEASE_STH_WHIPWORM}` },
        ]}
      />

    </React.Fragment>
  )

  return (

    <DetailWrap disease={DISEASE_STH_WHIPWORM} leftPart={leftPart} rightPart={rightPart} />

  )
}