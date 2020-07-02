import React, { Fragment,useState } from 'react'
import { observer } from 'mobx-react'
import { Box, Typography, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { abbrNum } from '../utils'
import SimpleDialog from './components/SimpleDialog'
import { forEach } from 'lodash'
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
    const [notAvaliableAlert, setnotAvaliableAlert] = useState(false)
    const [alertText, setAlertText] = useState('')

    const classes = useStyles()
    const {
        iuFeatures,
        countryFeatures,
        //stateFeaturesCurrentCountry: stateFeatures,
        //stateDataCurrentCountry: stateData,
        stateScales,
        //iuData,
    } = useDataAPI()
    //console.log(iuData);

    const { country } = useUIState()
    
    // output csv with included and excluded data
    /*
    if ( iuData != undefined ) {
        let csv = [['IU','IUstatus']]
        forEach(iuData['data'],(iu,i)=>{
            //console.log(iu);
            if ( iu.endemicity == 'Non-endemic' || iu.prevalence['2000'] == null ) {
                csv.push([iu.id,'Excluded'])
            } else {
                csv.push([iu.id,'Included'])
            }
            
        })
        let csvContent = "data:text/csv;charset=utf-8," 
            + csv.map(e => e.join(",")).join("\n");
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "my_data.csv");
        document.body.appendChild(link); // Required for FF
        link.click();

    }*/

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
                        showNotAvailable={(value)=>{
                            setAlertText(value)
                            setnotAvaliableAlert(true)
                        }}
                    />
                </div>
            </section>
            
            {notAvaliableAlert &&
                <SimpleDialog
                title={alertText}
                onClose={() => {
                    setnotAvaliableAlert(false)
                }}
                open={notAvaliableAlert}
                />
            }


        </Layout>
        
    )
}
export default observer(Country)
