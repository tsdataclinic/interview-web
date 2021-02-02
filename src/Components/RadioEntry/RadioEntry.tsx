import React, { useState, ReactElement, useEffect } from 'react';
import { RadioOption } from '../../Interview/RadioOption';
import {
    FormControl,
    RadioGroup,
    Radio,
    FormControlLabel,
    makeStyles,
} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import { useAudioState } from '../../Contexts/AudioContext';

const useStyles = makeStyles((theme) => ({
    optionElement: {
        margin: theme.spacing(2),
    },
    optionElementHighlighted: {
        margin: theme.spacing(2),
        color: 'red',
    },
    optionLabel: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
}));

interface Props {
    options: RadioOption[];
    initialValue: any | void;
    output(value: any): void;
}

export function RadioEntry({ options, initialValue, output }: Props) {
    const [selectedValue, setSelectedValue] = useState<any>(null);
    const classes = useStyles();
    const { currentlyPlaying } = useAudioState();
    useEffect(() => {
        if (initialValue !== undefined) {
            setSelectedValue(initialValue);
        }
    }, []);

    const handleChange = (value: any) => {
        setSelectedValue(value);
        output(value);
    };

    const optionElements: ReactElement[] = [];
    for (let option of options) {
        let MaterialUIIcon = option.icon ? (
            <Icon
                className={`fa ${option.icon}`}
                style={{ marginRight: '10px' }}
            />
        ) : null;
        let label: ReactElement = option.strongText ? (
            <span className={classes.optionLabel}>
                {MaterialUIIcon}
                <strong>{option.strongText}</strong>, {option.text}
            </span>
        ) : (
            <span className={classes.optionLabel}>
                {MaterialUIIcon}
                {option.text}
            </span>
        );

        const chosenClassName =
            currentlyPlaying === option.text
                ? classes.optionElementHighlighted
                : classes.optionElement;
        optionElements.push(
            <>
                <FormControlLabel
                    className={chosenClassName}
                    key={option.value}
                    value={option.value}
                    control={<Radio key={option.value} />}
                    label={label}
                />
            </>
        );
    }

    return (
        <FormControl>
            <RadioGroup
                aria-label="public-sharing"
                name="public-sharing"
                value={selectedValue}
                onChange={(event) => handleChange(event.target.value)}
            >
                {optionElements}
            </RadioGroup>
        </FormControl>
    );
}
