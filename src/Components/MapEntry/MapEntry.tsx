import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { DebounceInput } from 'react-debounce-input';
import { useCurrentPosition } from 'react-use-geolocation';

import { useReverseGeocode } from '../../Hooks/useReverseGeocode';
import { useLocalizedString } from '../../Contexts/LangaugeContext';

import { usePlaces } from '../../Hooks/usePlaces';
import { MapMarker } from '../MapMarker/MapMarker';
import useDesktop from '../../Hooks/useDesktop';

const useStyles = makeStyles((theme) => ({
    mapContainer: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
    },
    mapSearchBox: {
        zIndex: 3,
        width: '100%',
        position: 'absolute',
        display: 'flex',
        backgroundColor: 'white',
        height: '70px',
        borderBottom: '1px solid lightgray',
        [theme.breakpoints.up('sm')]: {
            width: '80vw',
            maxWidth: '800px',
            alignSelf: 'center',
            marginTop: '30px',
        },
    },
    mapSearch: {
        boxSizing: 'border-box',
        padding: '20px',
        flex: 1,
        border: 'none',
    },
    searchResults: {
        zIndex: 2,
        width: '100%',
        padding: '65px 0px ',
        boxSizing: 'border-box',
        position: 'absolute',
        margin: '0px',
        backgroundColor: 'white',
        borderRadius: '10px',
        overflowY: 'scroll',
        top: '0px',
        height: '100%',
        transform: 'height 2s ease',
        [theme.breakpoints.up('sm')]: {
            width: '80vw',
            maxWidth: '800px',
            alignSelf: 'center',
            marginTop: '30px',
            maxHeight: '40vh',
            top: 'none',
        },
    },
    singleResult: {
        zIndex: 2,
        width: '100%',
        padding: '0px',
        boxSizing: 'border-box',
        position: 'absolute',
        margin: '0px',
        backgroundColor: 'lightgray',
        borderRadius: '10px',
        height: '30%',
        top: '0px',
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.up('sm')]: {
            height: '40%',
        },
    },
    placeDetails: {
        position: 'absolute',
        bottom: '-20px',
        width: 'calc( 100% - 20px)',
        marginLeft: '10px',
        backgroundColor: 'white',
        boxSizing: 'border-box',
        padding: '10px',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        [theme.breakpoints.up('sm')]: {
            maxWidth: '80vw',
            alignSelf: 'center',
        },
    },
    placeIcon: {
        marginRight: '16px',
    },
    noPhotos: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        paddingBottom: '59px',
        boxSizing: 'border-box',
    },
    nameAndAddress: {
        display: 'flex',
        flexDirection: 'column',
    },
}));

interface Point {
    lat: number;
    lng: number;
}

type Place = PlaceResult | Point | ReverseGeocodeResult | undefined;

interface Props {
    initialPlace: Place | undefined;
    output(selectedPlace: Place): void;
}

export function MapEntry({ initialPlace, output }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [map, setMap] = useState<any | undefined>(undefined);
    const [userLocation, userLocationError] = useCurrentPosition();

    const [center, setCenter] = useState<Point>({ lat: 40.7128, lng: -74.006 });
    const [zoom, setZoom] = useState(11);
    const [bounds, setBounds] = useState<
        LatLngBoundsLiteral | LatLngBounds | null
    >(null);

    const isDesktop = useDesktop();
    const [selectedPlace, setSelectedPlace] = useState<PlaceResult | undefined>(
        undefined
    );
    useEffect(() => {
        if (initialPlace !== undefined) {
            setSelectedPlace(initialPlace);
        }
    }, []);

    const updateSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) =>
        setSearchTerm(e.target.value);
    const searchResults: PlaceResult[] = usePlaces(searchTerm, bounds, map);

    useEffect(() => {
        if (selectedPlace && selectedPlace.geometry) {
            const p: Point = {
                lat: selectedPlace.geometry.location.lat(),
                lng: selectedPlace.geometry.location.lng(),
            };
            setCenter(p);
        }
    }, [selectedPlace]);

    const geocodeResult = useReverseGeocode(center);

    useEffect(() => {
        if (geocodeResult && !selectedPlace) {
            output(geocodeResult);
        }
    }, [geocodeResult]);
    console.log('GEOCODE RESULT ', geocodeResult);

    useEffect(() => {
        if (userLocation && !userLocationError) {
            const p: Point = {
                lat: userLocation.coords.latitude,
                lng: userLocation.coords.longitude,
            };
            setCenter(p);
        }
    }, [userLocation, userLocationError]);

    const updateMapState = (changes: any) => {
        setCenter(changes.center);
        setZoom(changes.zoom);
        setBounds({
            north: changes.bounds.nw.lat,
            east: changes.bounds.se.lng,
            west: changes.bounds.nw.lng,
            south: changes.bounds.se.lat,
        });
        if (!selectedPlace && !geocodeResult) {
            output(changes.center);
        }
    };
    const clearSearch = () => setSearchTerm('');

    const classes = useStyles();
    const mapMounted = (element: any) => {
        if (element && map === undefined) {
            setMap(element.map);
        }
    };

    const updateSelectedPlace = (result: PlaceResult | undefined) => {
        setSelectedPlace(result);
        output(result);
    };

    const SearchTranslation = useLocalizedString('Search');

    return (
        <div className={classes.mapContainer}>
            {selectedPlace === undefined && (
                <div className={classes.mapSearchBox}>
                    <DebounceInput
                        minLength={2}
                        debounceTimeout={100}
                        type="text"
                        onChange={updateSearchTerm}
                        className={classes.mapSearch}
                        value={searchTerm}
                        placeholder={`${SearchTranslation}...`}
                    />
                    <IconButton>
                        <CloseIcon onClick={clearSearch} />
                    </IconButton>
                </div>
            )}
            <div style={{ position: 'relative', flex: 1 }}>
                <GoogleMapReact
                    onGoogleApiLoaded={mapMounted}
                    bootstrapURLKeys={{
                        key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
                            ? process.env.REACT_APP_GOOGLE_MAPS_API_KEY
                            : '',
                    }}
                    onChange={updateMapState}
                    center={center}
                    yesIWantToUseGoogleMapApiInternals={true}
                    zoom={zoom}
                    style={{ position: 'static' } as any}
                >
                    {selectedPlace && (
                        <MapMarker
                            lat={selectedPlace.geometry?.location.lat()}
                            lng={selectedPlace.geometry?.location.lng()}
                            placeResult={selectedPlace}
                        />
                    )}
                </GoogleMapReact>
                {!selectedPlace && (
                    <MapMarker
                        lat={center.lat}
                        lng={center.lng}
                        geocodeResult={geocodeResult}
                    />
                )}
            </div>

            <Slide
                direction={'up'}
                in={searchTerm.length > 0 && selectedPlace === undefined}
            >
                <div className={classes.searchResults}>
                    <List component="nav" aria-label="main mailbox folders">
                        {searchResults &&
                            searchResults.map((result: PlaceResult) => (
                                <ListItem
                                    key={result.id}
                                    onClick={() => updateSelectedPlace(result)}
                                    button
                                >
                                    <ListItemIcon>
                                        <HomeIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={result.name}
                                        secondary={result.formatted_address}
                                    />
                                </ListItem>
                            ))}
                    </List>
                </div>
            </Slide>

            <Slide direction="down" in={selectedPlace !== undefined}>
                <div className={classes.singleResult}>
                    {selectedPlace && (
                        <>
                            {selectedPlace.photos ? (
                                <img
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                    src={selectedPlace.photos[0].getUrl({
                                        maxWidth: isDesktop ? 1000 : 300,
                                    })}
                                    alt="selected place"
                                ></img>
                            ) : (
                                <div className={classes.noPhotos}>
                                    <h3>No photos for this location</h3>
                                </div>
                            )}
                            <div className={classes.placeDetails}>
                                <div className={classes.placeIcon}>
                                    <HomeIcon />
                                </div>
                                <div className={classes.nameAndAddress}>
                                    <Typography variant="subtitle2">
                                        {selectedPlace.name}
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedPlace.formatted_address}
                                    </Typography>
                                </div>
                                <IconButton
                                    onClick={() =>
                                        updateSelectedPlace(undefined)
                                    }
                                >
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        </>
                    )}
                </div>
            </Slide>
        </div>
    );
}
