import { Script, QuestionRouter, ResponseData } from '@dataclinic/interview';
import { QuizQuestion } from './QuizQuestion';

export class QuizScript implements Script<QuizQuestion> {
    private correctAnswer: number = 7;

    public setup(router: QuestionRouter<QuizQuestion>) {
    }

    public prepare(
        router: QuestionRouter<QuizQuestion>,
        question: QuizQuestion,
        data: ResponseData
    ) {
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
            case QuizQuestion.GUESS:
                if (data.numbersGuessed[0] == this.correctAnswer) {
                    router.push(QuizQuestion.CORRECT_ENDING);
                } else {
                    router.push(QuizQuestion.INCORRECT_GUESS);
                }
                router.next();
                break;
            case QuizQuestion.INCORRECT_GUESS:
                router.push(QuizQuestion.GUESS);
                router.next();
                break;
            case QuizQuestion.CORRECT_ENDING:
                router.complete();
                break;
            default:
                router.next();
                break;
        }
    }
}
