import React, { useState, useEffect } from 'react';
import { DropdownOption } from '../../Interview/DropdownOption';
import {
    FormControl,
    MenuItem,
    makeStyles,
    TextField,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    dropdownEntry: {
        padding: '20px 20px 0 20px',
        '& > *': {
            width: '100%',
        },
        [theme.breakpoints.up('sm')]: {
            width: '100%',
        },
    },
    label: {
        fontSize: '0.8em',
        marginBottom: '4px',
    },
}));

interface Props {
    label: string;
    options: DropdownOption[];
    initialValue: any | undefined;
    output(value: any): void;
    highlight?: boolean;
}
export function DropdownEntry({
    label,
    options,
    initialValue,
    output,
    highlight = false,
}: Props) {
    const placeholderValue = '_placeholder';
    const classes = useStyles();
    const [selectedValue, setSelectedValue] = useState<any>(placeholderValue);
    useEffect(() => {
        if (initialValue !== undefined) {
            setSelectedValue(initialValue);
        }
    }, []);

    const handleChange = (value: any) => {
        setSelectedValue(value);
        output(value === placeholderValue ? null : value);
    };

    return (
        <div className={classes.dropdownEntry}>
            <FormControl>
                <div
                    style={
                        highlight
                            ? { color: 'red', border: '3px solid #5b2f91' }
                            : {}
                    }
                    className={classes.label}
                >
                    {label}
                </div>
                <TextField
                    select
                    value={selectedValue}
                    onChange={(event) => handleChange(event.target.value)}
                    variant="outlined"
                >
                    <MenuItem key="" value={placeholderValue}>
                        Select an answer...
                    </MenuItem>
                    {options.map((option) => (
                        <MenuItem key={option.text} value={option.value}>
                            {option.text}
                        </MenuItem>
                    ))}
                </TextField>
            </FormControl>
        </div>
    );
}
