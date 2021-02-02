import React, { ReactElement } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import FastForwardIcon from '@material-ui/icons/FastForward';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import DoneIcon from '@material-ui/icons/Done';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { useAudioState } from '../../Contexts/AudioContext';
import { useLocalizedString } from '../../Contexts/LangaugeContext';
import { NavigationSpecification } from '../../Interview/NavigationSpecification';
import useDesktop from '../../Hooks/useDesktop';

const useStyles = makeStyles((theme) => ({
    appBar: {
        bottom: 0,
        top: 'auto',
        backgroundColor: 'white',
        color: theme.palette.primary.main,
        // borderTop:'3px solid',
        // borderTopColor:theme.palette.primary.main
    },
    bottomNavigation: {
        backgroundColor: 'transparent',
        '& > *': {
            color: theme.palette.primary.main,
        },
        [theme.breakpoints.up('sm')]: {
            padding: '10px',
            boxSizing: 'border-box',
            justifyContent: 'space-between',
        },
    },
    listenIcon: {
        alignSelf: 'center',
    },

    backForwardIcon: {
        [theme.breakpoints.up('sm')]: {
            border: `1px solid ${theme.palette.primary.main}`,
            '& .MuiBottomNavigationAction-wrapper': {
                flexDirection: 'row',
                justifyContent: 'center',
                textTransform: 'uppercase',
                fontWeight: 900,
                justifySelf: 'center',
            },
        },
    },
    invisibleIcon: {
        backgroundColor: 'transparent',
        color: 'transparent',
        [theme.breakpoints.up('sm')]: {
            border: 'none',
        },
    },
    listenButton: {
        [theme.breakpoints.up('sm')]: {
            order: 10,
            justifySelf: 'flex-end',
        },
    },
    cancelButton: {
        textTransform: 'uppercase',
        fontWeight: 900,
        justifySelf: 'flex-start',
    },
}));

interface Props {
    complete: boolean;
    navigation?: NavigationSpecification | null;
    back(): void;
    forward(): void;
    skip(): void;
    onStartOver: () => void;
}

export function BottomBar({
    complete,
    navigation,
    back,
    forward,
    skip,
    onStartOver,
}: Props) {
    const desktop = useDesktop();
    const classes = useStyles();

    const { setPlayMulti, setPlayMultiStopped, playingMulti } = useAudioState();

    const BackTranslation = useLocalizedString('Back');
    const ReadAllTranslation = useLocalizedString('ReadAll');
    const StopReadAllTranslation = useLocalizedString('StopReading');
    const NextTranslation = useLocalizedString('Next');
    const SkipTranslation = useLocalizedString('Skip');
    const CancelTranslation = useLocalizedString('Cancel');

    const defaultNavSpec: NavigationSpecification = {
        forward: {
            prompt: NextTranslation,
            icon: <ArrowForwardIcon />,
        },
        incompleteForward: {
            prompt: SkipTranslation,
            action: 'skip',
            icon: <FastForwardIcon />,
        },
        back: {
            prompt: BackTranslation,
            icon: <ArrowBackIcon />,
        },
    };
    let resolvedNavSpec = defaultNavSpec;
    if (navigation) {
        Object.assign(resolvedNavSpec, navigation);
    }

    const handleChange = (_: any, value: string) => {
        switch (value) {
            case 'back':
                back();
                break;
            case 'forward':
                forward();
                break;
            case 'skip':
                skip();
                break;
            case 'cancel':
                onStartOver();
                break;
            case 'listen':
                setPlayMulti('screen_reader');
                break;
        }
    };

    let backNavElement: ReactElement = desktop ? (
        <></>
    ) : (
        <BottomNavigationAction
            className={`${classes.invisibleIcon} ${classes.backForwardIcon}`}
            label=""
            value=""
        />
    );

    let forwardNavElement: ReactElement = desktop ? (
        <></>
    ) : (
        <BottomNavigationAction
            className={`${classes.invisibleIcon} ${classes.backForwardIcon}`}
            label=""
            value=""
        />
    );

    let CancelNavElement: ReactElement = (
        <BottomNavigationAction
            className={classes.cancelButton}
            label={CancelTranslation}
            value="cancel"
        />
    );

    if (complete && resolvedNavSpec.forward !== null) {
        forwardNavElement = (
            <BottomNavigationAction
                label={resolvedNavSpec.forward?.prompt}
                value="forward"
                icon={resolvedNavSpec.forward?.icon}
                className={`${classes.backForwardIcon}`}
            />
        );
    }

    if (!complete && resolvedNavSpec.incompleteForward !== null) {
        forwardNavElement = (
            <BottomNavigationAction
                label={resolvedNavSpec.incompleteForward?.prompt}
                value={resolvedNavSpec.incompleteForward?.action}
                icon={resolvedNavSpec.incompleteForward?.icon}
                className={`${classes.backForwardIcon}`}
            />
        );
    }

    if (resolvedNavSpec.back !== null) {
        backNavElement = (
            <BottomNavigationAction
                label={resolvedNavSpec.back?.prompt}
                value="back"
                icon={resolvedNavSpec.back?.icon}
                className={`${classes.backForwardIcon}`}
            />
        );
    }

    return (
        <AppBar className={classes.appBar}>
            <BottomNavigation
                onChange={handleChange}
                className={classes.bottomNavigation}
                showLabels
            >
                {desktop && CancelNavElement}
                {backNavElement}
                <BottomNavigationAction
                    label={
                        playingMulti
                            ? StopReadAllTranslation
                            : ReadAllTranslation
                    }
                    value="listen"
                    className={classes.listenButton}
                    onClick={() =>
                        playingMulti
                            ? setPlayMultiStopped()
                            : setPlayMulti('screen_reader')
                    }
                    icon={
                        <RecordVoiceOverIcon
                            color="inherit"
                            aria-label="listen"
                        />
                    }
                />
                {forwardNavElement}
            </BottomNavigation>
        </AppBar>
    );
}
