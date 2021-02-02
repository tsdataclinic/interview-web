import { SupportedLanguage } from './SupportedLanguage';

export type Phrase = {
    [key in SupportedLanguage]: string;
};
