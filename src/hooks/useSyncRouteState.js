import { useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { useDataAPI, useUIState } from 'hooks/stateHooks'

export default function () {
    const matchSub = useRouteMatch('/:disease/:section/:country')
    const matchIU = useRouteMatch('/:disaese/:section/:country/:iu')
    const matchTop = useRouteMatch('/:section')
    const { country: currentCountry, implementationUnit: currentImplementationUnit, setImplementationUnit, setCountry, setDisease } = useUIState()
    const { diseases } = useDataAPI()

    useEffect(() => {
        if (matchIU) {
            const { country, iu } = matchIU.params
            if (country !== currentCountry) {
                setCountry(country)
            }
            if (iu !== currentImplementationUnit) {
                setImplementationUnit(iu)
            }
        } else if (matchSub) {
            const { country } = matchSub.params
            if (country !== currentCountry) {
                setCountry(country)
            }
        } else if (matchTop) {
            if (currentCountry) {
                setCountry(null)
            }
            if (currentImplementationUnit) {
                setImplementationUnit(null)
            }
            if ( diseases.includes(matchTop.params.section) ) {
                setDisease(matchTop.params.section)
            } 
                
        }
    }, [diseases, setDisease, matchSub, matchTop, setCountry, currentCountry, currentImplementationUnit, matchIU, setImplementationUnit])
}
