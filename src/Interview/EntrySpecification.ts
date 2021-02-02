import { MultipleChoiceOption } from './MultipleChoiceOption';
import { DropdownOption } from './DropdownOption';
import { RadioOption } from './RadioOption';

export type EntrySpecification =
    | {
          type: 'info';
          title: string;
          content: string;
          image: string;
          field: null;
      }
    | {
          type: 'free_text';
          label: string;
          placeholder?: string;
          field: string;
      }
    | {
          type: 'map_question';
          field: string;
      }
    | {
          type: 'multiple_choice';
          field: string;
          searchable: boolean;
          options:
              | MultipleChoiceOption[]
              | ((query: string | undefined) => MultipleChoiceOption[]);
      }
    | {
          type: 'dropdown';
          field: string;
          label: string;
          options: DropdownOption[];
      }
    | {
          type: 'radio';
          field: string;
          options: RadioOption[];
      }
    | {
          type: 'checkbox';
          label: string;
          field: string;
          options: RadioOption[];
      }
    | {
          type: 'date_picker';
          label: string;
          field: string;
      }
    | {
          type: 'time_picker';
          label: string;
          field: string;
      };
