import React from 'react';
import { MultipleChoiceOption } from '../../Interview/MultipleChoiceOption';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ListItemIcon } from '@material-ui/core';
import { AudioButton } from '../AudioButton/AudioButton';
import { AudioEntry } from '../../Interview/AudioEntry';
import { MultipleChoiceReader } from '../ScreenReader/MultipleChoiceReader';

type Props = {
    option: MultipleChoiceOption;
    selected: boolean;
    onSelect: (answer: string) => void;
    highlighted?: boolean;
};

export function MultipleChoiceListOption({
    option,
    selected,
    onSelect,
    highlighted = false,
}: Props) {
    const audioList: AudioEntry[] = MultipleChoiceReader([option]);
    return (
        <ListItem
            button
            disableRipple={true}
            key={option.text}
            selected={selected}
            style={{
                color: highlighted ? '#5b2f91' : '',
                border: highlighted ? '3px solid #5b2f91' : '1px solid #E0E0E0',
            }}
            onClick={() => onSelect(option.value || option.text)}
        >
            {option.icon && (
                <ListItemIcon
                    style={
                        highlighted ? { color: '#5b2f91' } : { color: 'grey' }
                    }
                >
                    {option.icon}
                </ListItemIcon>
            )}
            {option.subtext ? (
                <ListItemText
                    primary={option.text}
                    secondary={option.subtext}
                />
            ) : (
                <ListItemText primary={option.text} />
            )}
            <AudioButton sequenceId={option.text} audioURLs={audioList} />
        </ListItem>
    );
}
