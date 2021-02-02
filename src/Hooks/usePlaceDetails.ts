import { useState, useEffect, useRef } from 'react';

export function usePlaceDetails(
    placeID: string | undefined,
    map: any | undefined
): PlaceResult | undefined {
    const [placeDetails, setPlaceDetails] = useState<any | undefined>(
        undefined
    );
    const placeService = useRef<PlacesService | undefined>(undefined);

    const onResult = (result: PlaceResult, status: PlacesServiceStatus) => {
        if (status === 'OK') {
            setPlaceDetails(result);
        }
    };
    useEffect(() => {
        if (map) {
            placeService.current = new google.maps.places.PlacesService(map);
        }
    }, [map]);

    useEffect(() => {
        if (placeService.current && placeID) {
            const request: PlaceDetailsRequest = {
                placeId: placeID,
                fields: ['name', 'formatted_address', 'photos', 'geometry'],
            };
            placeService.current.getDetails(request, onResult);
        }
    }, [placeID]);
    return placeDetails;
}
