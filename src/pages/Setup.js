import React, { Fragment } from 'react'
import { observer } from 'mobx-react'
import { Box, Typography, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { abbrNum } from '../utils'

import { useDataAPI, useUIState } from '../hooks/stateHooks'
import { Layout } from '../layout'
import HeadWithInputs from './components/HeadWithInputs'
import SelectCountry from './components/SelectCountry'
import TextContents from './components/TextContents'

const useStyles = makeStyles(theme => ({

}))

const Setup = props => {
    const classes = useStyles()
    const {
        iuFeatures,
        //stateFeaturesCurrentCountry: stateFeatures,
        //stateDataCurrentCountry: stateData,
        stateScales,
    } = useDataAPI()


    const { country } = useUIState()

    //console.log(country);

    return (
        <Layout>
            <HeadWithInputs
                title="prevalence simulator"
            />

            <SelectCountry selectIU={true} />

            <section>
                <Typography variant="h6" component="h" className={classes.headline} >Setup</Typography>
                <TextContents>
                    <p>We hold the following information for IU Name.<br />This data will be used to initialise the simulation.</p>
                </TextContents>
            </section>

        </Layout>
    )
}
export default observer(Setup)
