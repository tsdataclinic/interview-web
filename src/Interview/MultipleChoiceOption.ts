import { ReactElement } from 'react';

export interface MultipleChoiceOption {
    text: string;
    subtext?: string;
    icon?: ReactElement;
    value?: any;
}
