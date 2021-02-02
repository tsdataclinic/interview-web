import React, { useState, useEffect } from 'react';
import List from '@material-ui/core/List';
import { Input, makeStyles } from '@material-ui/core';
import { MultipleChoiceOption } from '../../Interview/MultipleChoiceOption';
import { MultipleChoiceListOption } from './MultipleChoiceListOption';
import { useAudioState } from '../../Contexts/AudioContext';

const useStyles = makeStyles((theme) => ({
    filterInput: {
        width: '100%',
        padding: '20px',
    },
    multipleChoiceList: {
        width: '100%',
        maxWidth: '600px',
    },
}));

interface Props {
    searchable: boolean;
    options:
        | MultipleChoiceOption[]
        | ((query: string | undefined) => MultipleChoiceOption[]);
    initialChoice: string | undefined;
    output(choice: string): void;
}

export function MultipleChoiceEntry({
    searchable,
    options,
    initialChoice,
    output,
}: Props) {
    const classes = useStyles();
    const { currentlyPlaying } = useAudioState();

    const [query, setQuery] = useState<string>('');
    const [choice, setChoice] = useState<string>('');
    useEffect(() => {
        if (initialChoice !== undefined && initialChoice !== choice) {
            setChoice(initialChoice);
        }
    }, []);

    const selectOption = (choice: string) => {
        setChoice(choice);
        output(choice);
    };

    const createOptionListItem = (option: MultipleChoiceOption) => (
        <MultipleChoiceListOption
            key={option.text}
            highlighted={
                option.text === currentlyPlaying ||
                (option?.subtext !== null &&
                    option?.subtext === currentlyPlaying)
            }
            option={option}
            selected={option.value === choice}
            onSelect={(val) => selectOption(val)}
        />
    );

    const processedOptions =
        typeof options == 'function' ? options(query) : options;

    return (
        <div className={classes.multipleChoiceList}>
            {searchable && (
                <Input
                    className={classes.filterInput}
                    placeholder="Search..."
                    onChange={(event) => setQuery(event.target.value)}
                />
            )}
            <List component="nav" aria-label="options">
                {processedOptions.map(createOptionListItem)}
            </List>
        </div>
    );
}
