import { ReactElement } from 'react';

interface NavigationButtonSpecification {
    prompt?: string;
    icon?: ReactElement;
}

export interface NavigationSpecification {
    forward?: NavigationButtonSpecification | null;
    incompleteForward?:
        | (NavigationButtonSpecification & { action?: string })
        | null;
    back?: NavigationButtonSpecification | null;
}
