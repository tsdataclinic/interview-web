import { useState, useEffect, useRef } from 'react';

export function usePlaces(
    searchTerm: string,
    bounds: LatLngBoundsLiteral | LatLngBounds | undefined | null,
    map: any | undefined
): PlaceResult[] {
    const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
    const placeService = useRef<PlacesService | null>(null);

    useEffect(() => {
        if (map) {
            placeService.current = new google.maps.places.PlacesService(map);
        }
    }, [map]);

    const onResults = (result: PlaceResult[], status: PlacesServiceStatus) => {
        if (status === 'OK') {
            setSuggestions(result);
        }
    };

    useEffect(() => {
        if (placeService.current && searchTerm) {
            let query: TextSearchRequest = {
                query: searchTerm,
                bounds: bounds ? bounds : undefined,
            };
            placeService.current?.textSearch(query, onResults);
        }
    }, [searchTerm, bounds]);
    return suggestions;
}
