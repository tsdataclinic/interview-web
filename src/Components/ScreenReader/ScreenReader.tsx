import React from 'react';
import { AudioSequence } from '../AudioSequence/AudioSequence';
import { useAudioState } from '../../Contexts/AudioContext';
import { Screen } from '../../Interview/Screen';
import { RadioReader } from './RadioReader';
import { MultipleChoiceReader } from './MultipleChoiceReader';
import { slug } from '../../utils';

type Props = {
    screen: Screen | null;
};

export function ScreenReader({ screen }: Props) {
    const { setCurrentlyPlaying } = useAudioState();

    const baseURL = `${process.env.PUBLIC_URL}/audio_prompts/`;

    const prompt = screen?.prompt;
    const entrySpecs = screen?.entrySpecs;

    let audioList: any = [];

    const audioURLForElement = (text: string) => {
        return `${baseURL}${slug(text)}.mp3`;
    };

    if (prompt) {
        audioList.push({ key: 'prompt', url: audioURLForElement(prompt) });
    }

    entrySpecs?.forEach((entry) => {
        switch (entry.type) {
            case 'multiple_choice':
                audioList = [
                    ...audioList,
                    ...MultipleChoiceReader(entry.options),
                ];
                break;
            case 'radio':
                audioList = [...audioList, ...RadioReader(entry.options)];
                break;
            case 'free_text':
                audioList = [
                    ...audioList,
                    {
                        key: entry.label,
                        url: audioURLForElement(
                            entry.label + '. ' + entry.placeholder
                        ),
                    },
                ];
                break;
            case 'map_question':
                break;
            case 'dropdown':
                audioList = [
                    ...audioList,
                    { key: entry.label, url: audioURLForElement(entry.label) },
                ];
                break;
            case 'date_picker':
                audioList = [
                    ...audioList,
                    { key: entry.label, url: audioURLForElement(entry.label) },
                ];
                break;
            case 'time_picker':
                audioList = [
                    ...audioList,
                    { key: entry.label, url: audioURLForElement(entry.label) },
                ];
                break;
        }
    });

    return (
        <AudioSequence
            sequenceId="screen_reader"
            key={screen?.prompt}
            audioURLs={audioList}
            onPlaying={(option: string | null) => setCurrentlyPlaying(option)}
            onDone={() => setCurrentlyPlaying(null)}
        />
    );
}
