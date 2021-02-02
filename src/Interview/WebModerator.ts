import { Moderator, ResponseConsumer, ResponseData } from '@dataclinic/interview';
import { Screen } from './Screen';
import { webModeratorConfig } from './WebModeratorConfig';
import { QuizQuestion } from './QuizQuestion';
import { SupportedLanguage } from './SupportedLanguage';

export class WebModerator implements Moderator<QuizQuestion> {
    constructor(
        private lang: SupportedLanguage,
        private setCurrentScreen: (screen: Screen) => void,
        private lastScreen: Screen,
        private lastQuestion: QuizQuestion
    ) {}

    public setLang(lang: SupportedLanguage) {
        this.lang = lang;
        const screenConfig = webModeratorConfig(
            this.lastScreen.responseData,
            this.lang
        );
        const screen = {
            ...screenConfig[this.lastQuestion],
            submitAnswer: this.lastScreen.submitAnswer,
            rewind: this.lastScreen.rewind,
            responseData: this.lastScreen.responseData,
            milestones: this.lastScreen.milestones,
        } as Screen;
        this.setCurrentScreen(screen);
    }

    public ask(
        consumer: ResponseConsumer,
        question: QuizQuestion,
        responseData: ResponseData,
        milestones: string[]
    ) {
        const submitAnswer = (data: ResponseData) => {
            consumer.answer(data);
            consumer.submit();
        };

        const rewind = () => {
            consumer.rewind();
        };

        const screenConfig = webModeratorConfig(responseData, this.lang)[
            question
        ];
        const screen = Object.assign({}, screenConfig, {
            submitAnswer,
            rewind,
            responseData,
            milestones,
        }) as Screen;

        this.lastScreen = screen;
        this.lastQuestion = question;

        this.setCurrentScreen(screen);
    }
}
