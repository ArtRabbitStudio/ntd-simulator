import { useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { useUIState } from './stateHooks'

export default function () {
    const matchSub = useRouteMatch('/:section/:country')
    const matchIU = useRouteMatch('/:section/:country/:iu')
    const matchTop = useRouteMatch('/:section')
    const { country: currentCountry, implementationUnit: currentImplementationUnit, setImplementationUnit, setCountry } = useUIState()

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
        }
    }, [matchSub, matchTop, setCountry, currentCountry, currentImplementationUnit, matchIU, setImplementationUnit])
}
