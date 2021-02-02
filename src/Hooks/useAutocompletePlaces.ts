import { useState, useEffect, useRef } from 'react';

export function useAutocompletePlaces(
    searchTerm?: string,
    bounds?: LatLngBoundsLiteral | undefined | null
): QueryAutocompletePrediction[] {
    const [suggestions, setSuggestions] = useState<
        QueryAutocompletePrediction[]
    >([]);
    const suggestionService = useRef<any | null>(null);

    useEffect(() => {
        suggestionService.current = new window.google.maps.places.AutocompleteService();
    }, []);

    const onResults = (
        result: QueryAutocompletePrediction[],
        status: PlacesServiceStatus
    ) => {
        if (status === 'OK') {
            setSuggestions(result);
        }
    };

    useEffect(() => {
        if (suggestionService.current) {
            suggestionService.current.getPlacePredictions(
                {
                    input: searchTerm,
                    bounds: bounds ? bounds : null,
                },
                onResults
            );
        }
    }, [searchTerm, bounds]);
    return suggestions;
}
