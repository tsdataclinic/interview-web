import { MultipleChoiceOption } from './Interview/MultipleChoiceOption';
import stringHash from 'string-hash';
import { RadioOption } from './Interview/RadioOption';

export const audioTextFromRadioOption = (option: RadioOption) => {
    let result = option.text;
    if (option.strongText) {
        result = option.strongText + ', ' + result;
    }
    return result;
};

export const audioFileSlugFromRadioOption = (option: RadioOption) =>
    slug(audioTextFromRadioOption(option));

export const audioTextFromMultipleChoiceOption = (
    option: MultipleChoiceOption
) =>
    option.text +
    '. ' +
    (option.subtext ? option.subtext.replace('Ex.', 'For example') : '');

export const audioFileSlugFromMultipleChoiceOption = (
    option: MultipleChoiceOption
) => slug(audioTextFromMultipleChoiceOption(option));

export const slug = (text: string) =>
    stringHash(text.replace(/\./g, ' ')).toString();
