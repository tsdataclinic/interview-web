import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { SupportedLanguage } from '../Interview/SupportedLanguage';
import { phrases } from '../Interview/Phrases';
type LanguageActionType = {
    type: 'SetLanguage';
    payload?: any;
};

type LanguageState = {
    language: SupportedLanguage;
};

const initialState: LanguageState = {
    language: 'en',
};

const LanguageContext = createContext<{
    state: LanguageState;
    dispatch: React.Dispatch<any>;
}>({
    state: initialState,
    dispatch: () => null,
});
const { Provider } = LanguageContext;

function reducer(state: LanguageState, action: LanguageActionType) {
    switch (action.type) {
        case 'SetLanguage':
            return { ...state, language: action.payload };
        default:
            return state;
    }
}

const useLanguageState = () => {
    const { state, dispatch } = useContext(LanguageContext);

    const setLanguage = (languageString: SupportedLanguage) => {
        dispatch({ type: 'SetLanguage', payload: languageString });
    };

    return {
        language: state.language,
        setLanguage,
    };
};

const useLocalizedString = (interfaceLabel: string) => {
    const { language } = useLanguageState();
    return phrases[interfaceLabel][language];
};
const LanguageProvider: React.FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export {
    LanguageContext,
    LanguageProvider,
    useLanguageState,
    useLocalizedString,
};
