import { useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { useDataAPI, useUIState } from 'hooks/stateHooks'

export default function () {

    const matchSection = useRouteMatch('/:disease/:country/:iu/:section');
    const matchIU = useRouteMatch('/:disease/:country/:iu');
    const matchCountry = useRouteMatch('/:disease/:country');
    const matchDisease = useRouteMatch('/:disease');

    const { diseases } = useDataAPI();

    const {
      country: currentCountry,
      disease: currentDisease,
      section: currentSection,
      implementationUnit: currentImplementationUnit,
      setCountry,
      setSection,
      setDisease,
      setImplementationUnit
    } = useUIState();

    useEffect(() => {

        if ( matchSection ) {

            const { disease, country, iu, section } = matchSection.params;

            console.log( `useSyncRouteState matched section ${disease}/${country}/${iu}/${section}` );

            if ( disease !== currentDisease && diseases.includes( disease ) ) {
                setDisease( disease );
            }

            if ( country !== currentCountry ) {
                setCountry( country );
            }

            if ( iu !== currentImplementationUnit ) {
                setImplementationUnit( iu );
            }

            if( section !== currentSection ) {
                setSection( section );
            }
        }

        else if (matchIU) {

            const { disease, country, iu } = matchIU.params

            console.log( `useSyncRouteState matched IU ${disease}/${country}/${iu}` );

            if ( disease !== currentDisease && diseases.includes( disease ) ) {
                setDisease( disease );
            }

            if ( country !== currentCountry ) {
                setCountry( country );
            }

            if ( iu !== currentImplementationUnit ) {
                setImplementationUnit( iu );
            }

            if ( currentSection ) {
                setSection( null );
            }
        }

        else if ( matchCountry ) {

            const { disease, country } = matchCountry.params

            console.log( `useSyncRouteState matched country ${disease}/${country}` );

            if ( disease !== currentDisease && diseases.includes( disease ) ) {
                setDisease( disease );
            }

            if ( country !== currentCountry ) {
                setCountry( country );
            }

            if ( currentImplementationUnit ) {
                setImplementationUnit( null );
            }

            if ( currentSection ) {
                setSection( null );
            }
        }

        else if ( matchDisease ) {

            const { disease } = matchDisease.params;

            console.log( `useSyncRouteState matched disease ${disease}` );

            if ( disease !== currentDisease && diseases.includes( disease ) ) {
                setDisease( disease );
            }

            if ( currentCountry ) {
                setCountry( null );
            }

            if ( currentImplementationUnit ) {
                setImplementationUnit( null );
            }

            if ( currentSection ) {
                setSection( null );
            }
        }
    },
    [
      diseases,
      currentCountry,
      currentSection,
      currentImplementationUnit,
      currentDisease,
      matchCountry,
      matchSection,
      matchDisease,
      matchIU,
      setDisease,
      setSection,
      setCountry,
      setImplementationUnit,
    ]);
}
