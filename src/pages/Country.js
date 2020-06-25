import React, { Fragment } from 'react'
import { observer } from 'mobx-react'
import { Box, Typography, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { abbrNum } from '../utils'

import { useDataAPI, useUIState } from '../hooks/stateHooks'
import { Layout } from '../layout'
import Map from '../components/Map'
import HeadWithInputs from './components/HeadWithInputs'
import SelectCountry from './components/SelectCountry'

const useStyles = makeStyles(theme => ({
    headLeftColumn: {
        textAlign: 'left',
    },
    headRightColumn: {
        textAlign: 'right',
        padding: theme.spacing(2),
    },
    chartContainer: {
        position: 'relative',
        width: '100%',
    },
    settings: {
        position: "relative",
        padding: theme.spacing(4, 0, 0, 0),
        display: 'flex',
        flexDirection: 'column',

    },
    section: {
        position: "relative",
        backgroundColor: theme.palette.secondary.light,
        width: `calc(100% + ${theme.spacing(12)}px)`,
        marginLeft: -theme.spacing(6),
        padding: theme.spacing(4, 6),
    },
}))


const Country = props => {
    const classes = useStyles()
    const {
        iuFeatures,
        countryFeatures,
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

            <section className={classes.section}>
                <div className={classes.settings}>
                    <Map
                        countryFeatures={countryFeatures}
                        //stateFeatures={stateFeatures}
                        iuFeatures={iuFeatures}
                        colorScale={false}
                        height={720}
                        disableZoom={true}
                        country={country}
                    />
                </div>
            </section>

        </Layout>
    )
}
export default observer(Country)
