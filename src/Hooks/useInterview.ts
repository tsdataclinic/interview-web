import { useEffect, useRef, useState } from 'react';
import { WebModerator } from '../Interview/WebModerator';
import { Interview, ResponseData } from '@dataclinic/interview';
import { QuizScript } from '../Interview/QuizScript';
import { Screen } from '../Interview/Screen';
import { QuizQuestion } from '../Interview/QuizQuestion';
import { StateSnapshot } from '@dataclinic/interview/dist/StateSnapshot';
import { SupportedLanguage } from '../Interview/SupportedLanguage';
import { webModeratorConfig } from '../Interview/WebModeratorConfig';
import { Web } from '@material-ui/icons';

export function useInterview(
    language: SupportedLanguage
): [Screen | null, ResponseData | null, () => void] {
    const [currentScreen, setCurrentScreen] = useState<Screen | null>(null);
    const [results, setResults] = useState<ResponseData | null>(null);

    const interviewRef = useRef<Interview<QuizQuestion> | null>(null);
    const moderatorRef = useRef<WebModerator | null>(null);

    const saveState = () => {
        if (interviewRef.current) {
            const interviewState = interviewRef.current.getStateSnapshot();
            localStorage.setItem(
                'interviewState',
                JSON.stringify(interviewState)
            );
        }
    };

    const createInterview = (language: SupportedLanguage) => {
        const script = new QuizScript();
        const moderator = new WebModerator(language, (entryScreen: Screen) =>
            setCurrentScreen(entryScreen)
         );
        const interview = new Interview(script, moderator);
        interview.debug(
            (message: string) => {
                console.log(message);
            },
            (result: ResponseData) => {
                saveState();
                setResults(result);
            }
        );
        return { interview, moderator };
    };

    useEffect(() => {
        const { interview, moderator } = createInterview(language);

        interviewRef.current = interview;
        moderatorRef.current = moderator;

        // If a saved state exists in localStorage, deserialize it and set that to be the state of
        // the interview
        const savedState = localStorage.getItem('interviewState');
        if (savedState) {
            const interviewState: StateSnapshot<QuizQuestion> = JSON.parse(
                savedState
            );
            interviewRef.current.restoreSnapshotState(interviewState);
        }
    }, []);

    // Serialize the state of the current interview to localStorage whenever the screen changes
    useEffect(saveState, [currentScreen]);

    useEffect(() => {
        if (moderatorRef.current) {
            moderatorRef.current.setLang(language);
        }
    }, [language]);

    const restartInterview = () => {
        localStorage.removeItem('interviewState');
        const { interview, moderator } = createInterview(language);
        interviewRef.current = interview;
        moderatorRef.current = moderator;
        setResults(null);
    };

    return [currentScreen, results, restartInterview];
}
