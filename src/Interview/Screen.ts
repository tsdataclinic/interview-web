import { EntrySpecification } from './EntrySpecification';
import { ResponseData } from '@dataclinic/interview';
import { NavigationSpecification } from './NavigationSpecification';

export interface Screen {
    prompt: string;
    footnote?: string;
    entrySpecs: EntrySpecification[];
    complete: (partial: ResponseData) => boolean;
    navigation: NavigationSpecification | null;

    responseData: ResponseData;
    milestones: string[];
    submitAnswer: (data: ResponseData) => void;
    rewind(): void;
}
