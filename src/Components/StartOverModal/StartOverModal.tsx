import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useLocalizedString } from '../../Contexts/LangaugeContext';

type Props = {
    onClose: () => void;
    isOpen: boolean;
    onRestartInterview: () => void;
};

export function StartOverModal({ isOpen, onClose, onRestartInterview }: Props) {
    const restart = () => {
        onClose();
        onRestartInterview();
    };

    const CancelTranslation = useLocalizedString('Cancel');
    const RestartHeaderTranslation = useLocalizedString('RestartHeader');
    const RestartTranslation = useLocalizedString('RestartInterview');
    const RestartWarningTranslation = useLocalizedString(
        'InterviewRestartWarning'
    );
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {RestartHeaderTranslation}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {RestartWarningTranslation}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    {CancelTranslation}
                </Button>
                <Button onClick={restart} color="primary" autoFocus>
                    {RestartTranslation}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
