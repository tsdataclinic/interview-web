import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { slug } from '../../utils';
import { AudioButton } from '../AudioButton/AudioButton';
import { useAudioState } from '../../Contexts/AudioContext';
import useDesktop from '../../Hooks/useDesktop';
import { LanguageMenu } from '../LanguageMenu/LanguageMenu';
import { SupportedLanguage } from '../../Interview/SupportedLanguage';

const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        textAlign: 'center',
    },
    appBar: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        position: 'fixed',
    },
    largeHeader: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 40px',
    },
    prompt: {
        marginBottom: '8px',
        color: theme.palette.primary.main,
    },
    audioButton: {},
    headerText: {
        display: 'inline-block',
        boxSizing: 'border-box',
        padding: '5px 10px',
    },
}));

interface Props {
    prompt: string;
    onStartOver: () => void;
}

export function TopBar({ prompt, onStartOver }: Props) {
    const classes = useStyles();
    const { currentlyPlaying } = useAudioState();
    const audioPromptUrl = `${process.env.PUBLIC_URL}/audio_prompts/${slug(
        prompt
    )}.mp3`;

    const desktop = useDesktop();
    return (
        <>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    {!desktop && (
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            aria-label="menu"
                            onClick={onStartOver}
                        >
                            <CloseIcon style={{ color: 'white' }} />
                        </IconButton>
                    )}
                    <Typography
                        style={
                            currentlyPlaying === 'prompt'
                                ? {
                                        border: '3px solid white',
                                    }
                                : {}
                        }
                        variant="h6"
                        className={classes.title}
                    >
                        {prompt}
                        <AudioButton
                            sequenceId="screen_prompt"
                            audioURLs={[
                                { key: prompt, url: audioPromptUrl },
                            ]}
                        />
                    </Typography>
                    <LanguageMenu />
                </Toolbar>
            </AppBar>
        </>
    );
}
