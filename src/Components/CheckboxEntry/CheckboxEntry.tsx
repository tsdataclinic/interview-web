import React, { useState, ReactElement, useEffect } from 'react';
import { RadioOption } from '../../Interview/RadioOption';
import {
    FormControlLabel,
    Checkbox,
    FormControl,
    FormLabel,
    FormGroup,
    makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    checkboxEntry: {
        padding: '20px 20px 0 20px',
        '& > *': {
            width: '100%',
        },
    },
}));

interface Props {
    label: string;
    options: RadioOption[];
    initialValues: any[] | undefined;
    output(values: any[]): void;
}

export function CheckboxEntry({
    label,
    options,
    initialValues,
    output,
}: Props) {
    const [selectedValues, setSelectedValues] = useState<any[]>([]);
    useEffect(() => {
        if (initialValues !== undefined) {
            setSelectedValues(initialValues);
        }
    }, []);
    const classes = useStyles();

    const updateValues = (value: any, checked: boolean) => {
        const index = selectedValues.indexOf(value);
        if (checked && index === -1) {
            const newSelectedValues = [...selectedValues, value];
            setSelectedValues(newSelectedValues);
            output(newSelectedValues);
            return;
        }
        if (!checked && index !== -1) {
            let newSelectedValues: any[] = [...selectedValues];
            newSelectedValues.splice(index, 1);
            setSelectedValues(newSelectedValues);
            output(newSelectedValues);
            return;
        }
    };

    const optionElements: ReactElement[] = [];
    for (let option of options) {
        const isChecked = selectedValues.indexOf(option.value) !== -1;
        optionElements.push(
            <FormControlLabel
                key={option.value}
                control={
                    <Checkbox
                        checked={isChecked}
                        onChange={(event) =>
                            updateValues(option.value, event.target.checked)
                        }
                    />
                }
                label={option.text}
            />
        );
    }

    return (
        <div className={classes.checkboxEntry}>
            <FormControl component="fieldset">
                <FormLabel component="legend">{label}</FormLabel>
                <FormGroup>{optionElements}</FormGroup>
            </FormControl>
        </div>
    );
}
