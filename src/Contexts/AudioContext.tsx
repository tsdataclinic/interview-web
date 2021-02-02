import React, { createContext, useReducer, useContext, useEffect } from 'react';

type AudioActionType = {
    type:
        | 'audioPlaying'
        | 'audioStopped'
        | 'startPlayingMulti'
        | 'stopPlayingMulti'
        | 'setCurrentlyPlaying';
    payload?: any;
};

type AudioState = {
    playing: boolean;
    playMulti: boolean;
    currentlyPlaying: string | null;
    currentlyPlayingSequenceId: string | null;
};

const initialState: AudioState = {
    playing: false,
    playMulti: false,
    currentlyPlaying: null,
    currentlyPlayingSequenceId: null,
};
const AudioContext = createContext<{
    state: AudioState;
    dispatch: React.Dispatch<any>;
}>({
    state: initialState,
    dispatch: () => null,
});
const { Provider } = AudioContext;

function reducer(state: AudioState, action: AudioActionType) {
    switch (action.type) {
        case 'audioPlaying':
            return { ...state, playing: true };
        case 'audioStopped':
            return { ...state, playing: false };
        case 'startPlayingMulti':
            return {
                ...state,
                playMulti: true,
                currentlyPlayingSequenceId: action.payload,
            };
        case 'stopPlayingMulti':
            return {
                ...state,
                playMulti: false,
                currentlyPlayingSequenceId: null,
                currentlyPlaying: null,
            };
        case 'setCurrentlyPlaying':
            return { ...state, currentlyPlaying: action.payload };
        default:
            return state;
    }
}

const useAudioState = () => {
    const { state, dispatch } = useContext(AudioContext);

    const setGlobalAudioPlaying = () => {
        dispatch({ type: 'audioPlaying' });
    };
    const setGlobalAudioStopped = () => {
        dispatch({ type: 'audioStopped' });
    };

    const setPlayMulti = (sequenceId: string) => {
        dispatch({ type: 'startPlayingMulti', payload: sequenceId });
    };

    const setPlayMultiStopped = () => {
        dispatch({ type: 'stopPlayingMulti' });
    };

    const setCurrentlyPlaying = (audio: any) => {
        dispatch({ type: 'setCurrentlyPlaying', payload: audio });
    };

    return {
        globalPlaying: state.playing,
        playingMulti: state.playMulti,
        currentlyPlaying: state.currentlyPlaying,
        currentlyPlayingSequenceId: state.currentlyPlayingSequenceId,
        setGlobalAudioPlaying,
        setGlobalAudioStopped,
        setPlayMulti,
        setPlayMultiStopped,
        setCurrentlyPlaying,
    };
};

const AudioProvider: React.FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { AudioContext, AudioProvider, useAudioState };
