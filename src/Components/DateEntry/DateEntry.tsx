import React, { useState, useEffect } from 'react';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { Moment } from 'moment';
import { makeStyles } from '@material-ui/core';
import { useLanguageState } from '../../Contexts/LangaugeContext';

import 'moment/locale/en-gb';
import 'moment/locale/hi';

const useStyles = makeStyles((theme) => ({
    dateEntry: {
        boxSizing: 'border-box',
        padding: theme.spacing(2),
        '& > *': {
            width: '100%',
        },
    },
}));

interface Props {
    label: string;
    initialDate: any | undefined;
    output(date: any): void;
    highlight?: boolean;
}

type MomentOrMore = Moment | undefined | null | string;

export function DateEntry({
    label,
    initialDate,
    output,
    highlight = false,
}: Props) {
    const classes = useStyles();
    const [selectedDate, setSelectedDate] = useState<MomentOrMore>(null);
    useEffect(() => {
        if (initialDate !== undefined) {
            setSelectedDate(initialDate);
        }
    }, []);

    const handleChange = (date: MomentOrMore) => {
        setSelectedDate(date);
        output(date);
    };
    const { language } = useLanguageState();

    const languageMap = {
        en: 'en-gb',
        hi: 'hi',
    };
    console.log('date language ', language, languageMap[language]);
    moment.locale(languageMap[language]);

    return (
        <div className={classes.dateEntry}>
            <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment}>
                <KeyboardDatePicker
                    clearable
                    value={selectedDate || null}
                    placeholder="10/10/2018"
                    onChange={handleChange}
                    label={label}
                    format="MM/DD/YYYY"
                    maxDate={new Date()}
                    InputProps={{
                        color: 'primary',
                    }}
                    style={
                        highlight
                            ? {
                                  border: '3px solid #5b2f91',
                              }
                            : {}
                    }
                />
            </MuiPickersUtilsProvider>
        </div>
    );
}
