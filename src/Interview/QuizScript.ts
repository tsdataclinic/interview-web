import { Script, QuestionRouter, ResponseData } from '@dataclinic/interview';
import { QuizQuestion } from './QuizQuestion';

export class QuizScript implements Script<QuizQuestion> {
    public setup(router: QuestionRouter<QuizQuestion>) {
    }

    public prepare(
        router: QuestionRouter<QuizQuestion>,
        question: QuizQuestion,
        data: ResponseData
    ) {
        if (question === QuizQuestion.ADDITIONAL_DETAILS) {
            router.milestone('required_portion_complete');
        }
    }

    public process(
        router: QuestionRouter<QuizQuestion>,
        question: QuizQuestion,
        data: ResponseData
    ) {
        if (data._correctedLocationCategory != null) {
            router.skip({ locationCategory: data._correctedLocationCategory });
            return;
        }
        switch (question) {
            default:
                router.next();
                break;
        }
    }
}
