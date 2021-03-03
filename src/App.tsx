import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TopBar } from './Components/TopBar/TopBar';
import { BottomBar } from './Components/BottomBar/BottomBar';
import { useInterview } from './Hooks/useInterview';
import { useSubmitResults } from './Hooks/useSubmitResults';
import { Entry } from './Components/Entry/Entry';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { useLanguageState } from './Contexts/LangaugeContext';
import { ThemeLanguage } from './ThemeLanguage';
import { useAudioState } from './Contexts/AudioContext';
import { ScreenReader } from './Components/ScreenReader/ScreenReader';
import { StartOverModal } from './Components/StartOverModal/StartOverModal';
import Button from '@material-ui/core/Button';
import { useLocalizedString } from './Contexts/LangaugeContext';

import './App.css';
import { ResponseData } from '@dataclinic/interview';
import { InfoEntry } from './Components/InfoEntry/InfoEntry';

declare const soundManager: any;

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    entriesContainer: {
        flex: 1,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        paddingTop: '90px',
        paddingBottom: '55px',
        overflowY: 'auto',
        justifyContent: 'center',
        [theme.breakpoints.down('xs')]: {
            justifyContent: 'flex-start',
        },
    },
    resultEntry: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    resultsEntry: {
        listStyle: 'none',
        margin: '0px',
    },
    results: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'cetner',
        boxSizing: 'border-box',
        padding: '20px',
        marginTop: '100px',
    },
}));

function App() {
    const classes = useStyles();
    const { language, setLanguage } = useLanguageState();
    const [currentScreen, results, restartInterview] = useInterview(language);
    const [complete, setComplete] = useState<boolean>(false);
    const [showStartOverConfirmModal, setShowStartOverConfirmModal] = useState(
        false
    );
    const [currentResponse, setCurrentResponse] = useState<ResponseData>({});
    const { setPlayMultiStopped } = useAudioState();

    const addToResponse = (newData: ResponseData) => {
        setCurrentResponse(Object.assign({}, currentResponse, newData));
        setComplete(
            currentScreen?.complete(
                Object.assign(
                    {},
                    currentScreen?.responseData || {},
                    currentResponse,
                    newData
                )
            ) || false
        );
    };

    const submitAndClear = () => {
        currentScreen?.submitAnswer(currentResponse);
        setCurrentResponse({});
        setComplete(false);
        setPlayMultiStopped();
    };

    const submitNothingAndClear = () => {
        currentScreen?.submitAnswer({});
        setCurrentResponse({});
        setComplete(false);
        setPlayMultiStopped();
    };

    useSubmitResults(results);

    const rewindAndClear = () => {
        currentScreen?.rewind();
        setCurrentResponse({});
        setComplete(false);
        setPlayMultiStopped();
    };


    useEffect(() => {
        soundManager.setup({ debugMode: false });
    }, []);

    const theme = createMuiTheme(
        {
            palette: {
                primary: {
                    main: '#5B2F91',
                },
                secondary: {
                    main: '#11cb5f',
                },
            },
        },
        ThemeLanguage[language]
    );

    const StartNewTranslation = useLocalizedString('StartNewReport');
    const StorySavedTranslation = useLocalizedString('ReportSaved');
    const ThankYouTranslation = useLocalizedString('ThankYou');
    return (
        <>
            <ThemeProvider theme={theme}>
                <div className={classes.root}>
                    {results ? (
                        <>
                            <TopBar
                                prompt={ThankYouTranslation}
                                onStartOver={() =>
                                    setShowStartOverConfirmModal(true)
                                }
                            />
                            <div className={classes.results}>
                                <InfoEntry content={StorySavedTranslation} />
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={restartInterview}
                                >
                                    {StartNewTranslation}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <TopBar
                                onStartOver={() =>
                                    setShowStartOverConfirmModal(true)
                                }
                                prompt={
                                    currentScreen
                                        ? currentScreen.prompt
                                        : 'Starting'
                                }
                            />

                            <div className={classes.entriesContainer}>
                                {currentScreen?.entrySpecs.map((entrySpec) => (
                                    <Entry
                                        key={entrySpec.field || ''}
                                        spec={entrySpec}
                                        responseData={
                                            currentScreen.responseData
                                        }
                                        addToResponse={addToResponse}
                                    ></Entry>
                                ))}
                            </div>
                        </>
                    )}
                    {!results && (
                        <>
                            <BottomBar
                                complete={complete}
                                navigation={currentScreen?.navigation}
                                back={rewindAndClear}
                                forward={submitAndClear}
                                skip={submitNothingAndClear}
                                onStartOver={() =>
                                    setShowStartOverConfirmModal(true)
                                }
                            />
                            <ScreenReader
                                key={currentScreen?.prompt}
                                screen={currentScreen}
                            />
                        </>
                    )}
                </div>
                <StartOverModal
                    onClose={() => setShowStartOverConfirmModal(false)}
                    isOpen={showStartOverConfirmModal}
                    onRestartInterview={restartInterview}
                />
            </ThemeProvider>
        </>
    );
}

export default App;
