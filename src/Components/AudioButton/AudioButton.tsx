import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import Sound from 'react-sound';
import { useAudioState } from '../../Contexts/AudioContext';

import { makeStyles } from '@material-ui/core/styles';
import { AudioSequence } from '../AudioSequence/AudioSequence';
import { AudioEntry } from '../../Interview/AudioEntry';

const useStyles = makeStyles({
    audioButton: {
        color: 'inherit',
    },
});

type Props = {
    sequenceId: string;
    audioURLs: AudioEntry[];
};
export function AudioButton({ sequenceId, audioURLs }: Props) {
    const styles = useStyles();

    const [audioState, setAudioState] = useState<
        'PLAYING' | 'STOPPED' | 'PAUSED'
    >('STOPPED');
    const {
        globalPlaying,
        setCurrentlyPlaying,
        setPlayMulti,
    } = useAudioState();

    const playAudio = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        setPlayMulti(sequenceId);
        event.stopPropagation();
        event.preventDefault();
    };

    return (
        <IconButton
            disabled={globalPlaying}
            onClick={playAudio}
            className={styles.audioButton}
        >
            <VolumeUpIcon />
            <AudioSequence
                sequenceId={sequenceId}
                audioURLs={audioURLs}
                onPlaying={(option: string | null) =>
                    setCurrentlyPlaying(option)
                }
                onDone={() => setCurrentlyPlaying(null)}
            />
        </IconButton>
    );
}
