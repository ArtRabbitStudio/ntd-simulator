import { useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { useDataAPI, useUIState } from 'hooks/stateHooks'

export default function () {

    const matchIU = useRouteMatch('/:disease/:section/:country/:iu')
    const matchCountry = useRouteMatch('/:disease/:section/:country')
    const matchDisease = useRouteMatch('/:disease')

    const { country: currentCountry, implementationUnit: currentImplementationUnit, setImplementationUnit, setCountry, disease: currentDisease, setDisease } = useUIState()
    const { diseases } = useDataAPI()

    useEffect(() => {

        if (matchIU) {
            console.log( 'useSyncRouteState matched IU' );

            const { disease, country, iu } = matchIU.params

            if ( disease !== currentDisease && diseases.includes( disease ) ) {
                setDisease( disease )
            }

            if (country !== currentCountry) {
                setCountry(country)
            }

            if (iu !== currentImplementationUnit) {
                setImplementationUnit(iu)
            }
        }

        else if (matchCountry) {
            console.log( 'useSyncRouteState matched country' );

            const { disease, country } = matchCountry.params

            if ( disease !== currentDisease && diseases.includes( disease ) ) {
                setDisease( disease )
            }

            if (country !== currentCountry) {
                setCountry(country)
            }
        }

        else if (matchDisease) {
            console.log( 'useSyncRouteState matched disease' );

            const { disease } = matchDisease.params;

            if (currentCountry) {
                setCountry(null)
            }

            if (currentImplementationUnit) {
                setImplementationUnit(null)
            }

            if ( diseases.includes( disease ) ) {
                setDisease( disease )
            }

        }
    }, [diseases, setDisease, matchCountry, matchDisease, setCountry, currentCountry, currentImplementationUnit, currentDisease, matchIU, setImplementationUnit])
}
