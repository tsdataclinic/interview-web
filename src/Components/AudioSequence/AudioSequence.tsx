import React, { useState, useEffect } from 'react';
import { useAudioState } from '../../Contexts/AudioContext';
import Sound from 'react-sound';
import { AudioEntry } from '../../Interview/AudioEntry';

type Props = {
    sequenceId: string;
    audioURLs: AudioEntry[];
    onPlaying?: (fileName: string | null) => void;
    onDone?: () => void;
};

export function AudioSequence({
    sequenceId,
    audioURLs,
    onPlaying,
    onDone,
}: Props) {
    const [currentTrack, setCurrentTrack] = useState(0);
    const [audioState, setAudioState] = useState<
        'PLAYING' | 'STOPPED' | 'PAUSED'
    >('STOPPED');

    const {
        playingMulti,
        currentlyPlayingSequenceId,
        setGlobalAudioPlaying,
        setGlobalAudioStopped,
        setPlayMultiStopped,
    } = useAudioState();

    useEffect(() => {
        if (playingMulti) {
            setGlobalAudioPlaying();
            if (
                onPlaying &&
                audioState === 'PLAYING' &&
                currentlyPlayingSequenceId === sequenceId
            ) {
                onPlaying(audioURLs[currentTrack].key);
            }
            setAudioState('PLAYING');
        } else {
            setAudioState('STOPPED');
            setCurrentTrack(0);
            setGlobalAudioStopped();
        }
    }, [playingMulti, currentTrack, audioState, currentlyPlayingSequenceId]);

    const allDone = () => {
        setAudioState('STOPPED');
        setCurrentTrack(0);
        setGlobalAudioStopped();
        setPlayMultiStopped();

        if (onDone) {
            onDone();
        }
    };

    const audioStopped = () => {
        setAudioState('STOPPED');
        if (currentTrack === audioURLs.length - 1 || playingMulti === false) {
            if (onPlaying) {
                onPlaying(null);
            }
            allDone();
        } else {
            setCurrentTrack(currentTrack + 1);
        }
    };

    const currentSound = audioURLs[currentTrack];

    return currentSound && currentlyPlayingSequenceId === sequenceId ? (
        <Sound
            key={audioURLs[currentTrack].url}
            url={audioURLs[currentTrack].url}
            playStatus={audioState}
            onFinishedPlaying={audioStopped}
            autoLoad={false}
        />
    ) : (
        <></>
    );
}
