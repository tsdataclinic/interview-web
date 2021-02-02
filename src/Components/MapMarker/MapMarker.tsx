import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PinIcon from '@material-ui/icons/Room';

const useStyles = makeStyles(() => ({
    marker: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '40px',
        height: '40px',
        userSelect: 'none',
        transform: 'translate(-50%, -50%)',
        color: 'red',
    },
    icon: {
        width: '100%',
        height: '100%',
    },
    info: {
        padding: '10px 5px',
        boxSizing: 'border-box',
        backgroundColor: 'rgba(255,255,255,0.7)',
        color: 'purple',
        width: '40vw',
        textAlign: 'center',
        transform: 'translate(-15vw,0px)',
        border: '2px solid white',
        borderRadius: '10px',
    },
}));

interface Props {
    key?: string;
    text?: string;
    lat?: number;
    lng?: number;
    geocodeResult?: ReverseGeocodeResult;
    placeResult?: PlaceResult;
}

export function MapMarker({ key, geocodeResult, placeResult }: Props) {
    const classes = useStyles();
    return (
        <div className={classes.marker} key={key}>
            <PinIcon className={classes.icon} fill={'red'} />
            {geocodeResult && !placeResult && (
                <p className={classes.info}>
                    {geocodeResult.formatted_address}
                </p>
            )}
            {placeResult && <p className={classes.info}>{placeResult.name}</p>}

            {!placeResult && !geocodeResult && (
                <p className={classes.info}>Incident happened here</p>
            )}
        </div>
    );
}
