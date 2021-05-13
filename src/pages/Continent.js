import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { useTranslation } from "react-i18next";
import { Typography, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import SimpleDialog from 'pages/components/SimpleDialog'
import { useDataAPI, useUIState } from 'hooks/stateHooks'
import Map from 'components/Map'
import InfoIcon from "images/info-24-px.svg";

import { DISEASE_CONFIG,DISEASE_LABELS } from 'AppConstants';

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
    legend: {
        marginTop: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
    withHelp: {
        cursor: "help",
        backgroundImage: `url(${InfoIcon})`,
        backgroundPosition: "right center",
        backgroundSize: "auto",
        backgroundRepeat: "no-repeat",
        width: "fit-content",
        paddingRight: 30,
        padding: theme.spacing(1, 0),
        paddingBottom:0,
        marginBottom:0
      },
}))


const Continent = props => {
    const { t } = useTranslation();

    const [notAvailableAlert, setnotAvailableAlert] = useState(false)
    const [alertText, setAlertText] = useState('')

    const classes = useStyles()
    const {
        //iuFeatures,
        countryFeatures,
        //iuScales,
        //stateFeatures,
        countryScales,
        //iuData,
    } = useDataAPI()

    const { disease } = useUIState()
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

    const legend = t('thisMapShows')  
    const legendSubtitle = t('mapCountries',{in:DISEASE_CONFIG[ disease ].historicEndYear,for:t(DISEASE_LABELS[ disease ])})

    return (
      <React.Fragment>
            <section className={classes.section}>
                <div className={classes.settings}>
                    <Map
                        countryFeatures={countryFeatures}
                        //stateFeatures={stateFeaturesCurrentCountry}
                        //iuFeatures={iuFeatures}
                        colorScale={countryScales.prev}
                        height={720}
                        trendMode={false}
                        dragPan={true}
                        disableZoom={false}
                        //country={country}
                        disease={disease}
                        showNotAvailable={(value)=>{
                            setAlertText(value)
                            setnotAvailableAlert(true)
                        }}
                    />
                </div>
                <Typography component="h6" variant="h6" className={classes.legend}>{legend}</Typography>
                <Tooltip
                    title={t('inferredPrevalence')}
                    aria-label="info"
                    >
                <Typography variant="body2" className={`${classes.legendTitle} ${classes.withHelp}`}>{legendSubtitle}</Typography>
                </Tooltip>
            </section>
            
            {notAvailableAlert &&
                <SimpleDialog
                title={alertText}
                onClose={() => {
                    setnotAvailableAlert(false)
                }}
                open={notAvailableAlert}
                />
            }
        
      </React.Fragment>
    )
}
export default observer(Continent)
