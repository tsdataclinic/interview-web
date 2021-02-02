import { useState, useEffect, useRef } from 'react';
import { keys } from '@material-ui/core/styles/createBreakpoints';

export function useReverseGeocode(location: LatLng): ReverseGeocodeResult[] {
    const [
        reverseResult,
        setReverseResult,
    ] = useState<ReverseGeocodeResult | null>(null);
    const reverseGeocodeService = useRef<GeocoderService | null>(null);

    useEffect(() => {
        reverseGeocodeService.current = new google.maps.Geocoder();
    }, []);

    const onResults = (
        result: ReverseGeocodeResult[],
        status: GeocoderStatus
    ) => {
        if (status === 'OK') {
            if (result[0]) {
                setReverseResult(result[0]);
            } else {
                setReverseResult(null);
            }
        } else {
            setReverseResult(null);
        }
    };

    useEffect(() => {
        if (reverseGeocodeService.current && location) {
            let query: GeocoderRequest = {
                location,
            };
            reverseGeocodeService.current?.geocode(query, onResults);
        }
    }, [location]);
    return reverseResult;
}
