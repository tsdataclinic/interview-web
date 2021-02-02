import React, { useState } from 'react';
import { SupportedLanguage } from '../../Interview/SupportedLanguage';

import { makeStyles } from '@material-ui/core/styles';
import LanguageIcon from '@material-ui/icons/Language';
import CheckIcon from '@material-ui/icons/Check';
import {
    IconButton,
    Menu,
    withStyles,
    MenuItem,
    MenuProps,
    ListItem,
    ListItemText,
    ListItemIcon,
} from '@material-ui/core';
import { useLanguageState } from '../../Contexts/LangaugeContext';

interface Props {}

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props: MenuProps) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

const useStyles = makeStyles({
    button: {
        color: 'inherit',
    },
    item: {
        display: 'flex',
        alignItems: 'space-between',
    },
});

export function LanguageMenu({}: Props) {
    const { language, setLanguage } = useLanguageState();
    const styles = useStyles();
    const [anchorEl, setAnchorEl] = useState<
        (EventTarget & HTMLButtonElement) | null
    >(null);

    const showMenu = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        setAnchorEl(event.currentTarget);
    };
    const hideMenu = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                aria-controls="language-menu"
                aria-haspopup="true"
                onClick={showMenu}
                className={styles.button}
            >
                <LanguageIcon />
            </IconButton>
            <StyledMenu
                id="language-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={hideMenu}
            >
                {Object.entries(SupportedLanguage).map(([langID, langLab]) => (
                    <StyledMenuItem
                        id={langID}
                        onClick={() => setLanguage(langLab)}
                        className={styles.item}
                    >
                        <ListItemText style={{ flex: 1 }}>
                            {langID}
                        </ListItemText>
                        <ListItemIcon style={{ justifySelf: 'end' }}>
                            {langLab === language && <CheckIcon />}
                        </ListItemIcon>
                    </StyledMenuItem>
                ))}
            </StyledMenu>
        </div>
    );
}
