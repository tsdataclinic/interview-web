import React, { useEffect } from 'react';
import { MultipleChoiceEntry } from '../MultipleChoiceEntry/MultipleChoiceEntry';
import { FreeTextEntry } from '../FreeTextEntry/FreeTextEntry';
import { DateEntry } from '../DateEntry/DateEntry';
import { MapEntry } from '../MapEntry/MapEntry';
import { EntrySpecification } from '../../Interview/EntrySpecification';
import { ResponseData } from '@dataclinic/interview';
import { TimeEntry } from '../TimeEntry/TimeEntry';
import { DropdownEntry } from '../DropdownEntry/DropdownEntry';
import { RadioEntry } from '../RadioEntry/RadioEntry';
import { useAudioState } from '../../Contexts/AudioContext';
import { CheckboxEntry } from '../CheckboxEntry/CheckboxEntry';
import { makeStyles } from '@material-ui/core/styles';
import { InfoEntry } from '../InfoEntry/InfoEntry';

const useStyles = makeStyles((theme) => ({
    centeredEntry: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        [theme.breakpoints.up('sm')]: {
            width: '60vw',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'space-around',
        },
    },
    fullScreenEntry: {
        width: '100%',
        height: '100%',
        flex: 1,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    checkBoxEntry: {
        width: '100%',
        height: '100%',
        flex: 1,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        [theme.breakpoints.up('sm')]: {
            display: 'grid',
            width: '50vw',
            alignSelf: 'center',
        },
    },
}));

interface Props {
    spec: EntrySpecification;
    responseData: ResponseData;
    addToResponse(data: ResponseData): void;
}

export function Entry({ spec, responseData, addToResponse }: Props) {
    const classes = useStyles();
    let entry = <h2>Question Type not implemented</h2>;
    const { currentlyPlaying } = useAudioState();
    let wrapperClass = classes.centeredEntry;

    useEffect(() => {
        if (spec.field != null) {
            if (responseData[spec.field]) {
                addToResponse(responseData[spec.field]);
            }
        }
    }, []);

    if (spec.type === 'info') {
        entry = (
            <InfoEntry
                title={spec.title}
                image={spec.image}
                content={spec.content}
            />
        );
    }
    if (spec.type === 'multiple_choice') {
        entry = (
            <MultipleChoiceEntry
                searchable={spec.searchable}
                options={spec.options}
                initialChoice={responseData[spec.field]}
                output={(choice) => addToResponse({ [spec.field]: choice })}
            />
        );
    }
    if (spec.type === 'free_text') {
        entry = (
            <FreeTextEntry
                label={spec.label}
                highlight={currentlyPlaying === spec.label}
                placeholder={spec.placeholder}
                initialReply={responseData[spec.field]}
                output={(reply) => addToResponse({ [spec.field]: reply })}
            />
        );
    }
    if (spec.type === 'date_picker') {
        entry = (
            <DateEntry
                label={spec.label}
                highlight={currentlyPlaying === spec.label}
                initialDate={responseData[spec.field]}
                output={(date) => addToResponse({ [spec.field]: date })}
            />
        );
    }
    if (spec.type === 'time_picker') {
        entry = (
            <TimeEntry
                label={spec.label}
                highlight={currentlyPlaying === spec.label}
                initialTime={responseData[spec.field]}
                output={(time) => addToResponse({ [spec.field]: time })}
            />
        );
    }
    if (spec.type === 'dropdown') {
        entry = (
            <DropdownEntry
                label={spec.label}
                options={spec.options}
                initialValue={responseData[spec.field]}
                highlight={currentlyPlaying === spec.label}
                output={(value) => addToResponse({ [spec.field]: value })}
            />
        );
    }
    if (spec.type === 'radio') {
        entry = (
            <RadioEntry
                options={spec.options}
                initialValue={responseData[spec.field]}
                output={(value) => addToResponse({ [spec.field]: value })}
            />
        );
    }
    if (spec.type === 'checkbox') {
        wrapperClass = classes.checkBoxEntry;
        entry = (
            <CheckboxEntry
                label={spec.label}
                options={spec.options}
                initialValues={responseData[spec.field]}
                output={(values) => addToResponse({ [spec.field]: values })}
            />
        );
    }
    if (spec.type === 'map_question') {
        wrapperClass = classes.fullScreenEntry;
        entry = (
            <MapEntry
                initialPlace={responseData[spec.field]}
                output={(selectedPlace) =>
                    addToResponse({ [spec.field]: selectedPlace })
                }
            />
        );
    }
    return <div className={wrapperClass}>{entry}</div>;
}
