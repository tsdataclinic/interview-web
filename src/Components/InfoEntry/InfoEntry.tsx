import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    infoEntry: {
        margin: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        marginBottom: '8px',
        color: theme.palette.primary.main,
    },
    image: {
        textAlign: 'center',
        width: '100%',
        marginTop: '20px',
    },
}));

interface Props {
    title?: string;
    content: string;
    image?: string;
}

export function InfoEntry({ title, content, image }: Props) {
    const classes = useStyles();
    console.log('Info entry ', image);
    return (
        <div className={classes.infoEntry}>
            {title && (
                <Typography
                    variant="h4"
                    align="center"
                    className={classes.title}
                >
                    {title}
                </Typography>
            )}
            <Typography variant="subtitle2" align="center">
                {content}
            </Typography>
            {image && <img className={classes.image} src={image} />}
        </div>
    );
}
