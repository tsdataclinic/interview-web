import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'stretch',
        flexDirection: 'column',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    freeTextEntry: {
        padding: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            width: '100%',
        },
    },
}));

interface Props {
    label: string;
    placeholder?: string;
    initialReply: string | undefined;
    output(reply: string): void;
    highlight?: boolean;
}

export function FreeTextEntry({
    label,
    placeholder,
    initialReply,
    output,
    highlight = false,
}: Props) {
    const classes = useStyles();
    const [reply, setReply] = useState<string>('');
    useEffect(() => {
        if (initialReply !== undefined) {
            setReply(initialReply);
        }
    }, []);

    const handleChange = (reply: string) => {
        setReply(reply);
        output(reply);
    };

    return (
        <div
            style={
                highlight
                    ? { color: '#5b2f91', border: '3px solid #5b2f91' }
                    : {}
            }
            className={classes.freeTextEntry}
        >
            <form className={classes.root} noValidate autoComplete="off">
                <div>{label}</div>
                <TextField
                    value={reply}
                    onChange={(e) => handleChange(e.target.value)}
                    id="standard-basic"
                    multiline
                    style={highlight ? { color: '#5b2f91' } : {}}
                    rows={8}
                    placeholder={placeholder}
                    variant="outlined"
                />
            </form>
        </div>
    );
}
