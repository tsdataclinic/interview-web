import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { Moment } from 'moment';
import { makeStyles } from '@material-ui/core';
import { useLanguageState } from '../../Contexts/LangaugeContext';

import 'moment/locale/en-gb';
import 'moment/locale/hi';

const useStyles = makeStyles((theme) => ({
    timeEntry: {
        padding: theme.spacing(2),
        '& > *': {
            width: '100%',
        },
    },
}));

interface Props {
    label: string;
    initialTime: any | undefined;
    output(time: any): void;
    highlight?: boolean;
}

type MomentOrMore = Moment | undefined | null | string;

export function TimeEntry({
    label,
    initialTime,
    output,
    highlight = false,
}: Props) {
    const classes = useStyles();
    const [selectedTime, setSelectedTime] = useState<MomentOrMore>(null);
    useEffect(() => {
        if (initialTime !== undefined) {
            setSelectedTime(initialTime);
        }
    }, []);

    const handleChange = (time: MomentOrMore) => {
        setSelectedTime(time);
        output(time);
    };

    const { language } = useLanguageState();

    const languageMap = {
        en: 'en-gb',
        hi: 'hi',
    };
    moment.locale(languageMap[language]);

    return (
        <div className={classes.timeEntry}>
            <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment}>
                <KeyboardTimePicker
                    clearable
                    value={selectedTime || null}
                    placeholder="12:00 AM"
                    style={
                        highlight
                            ? { color: '#5b2f91', border: '3px solid #5b2f91' }
                            : {}
                    }
                    onChange={handleChange}
                    label={label}
                />
            </MuiPickersUtilsProvider>
        </div>
    );
}
