# Application Configuration

The Interview app is backed by an Interview building library `@dataclinic/interview`, the documentation for which can be found in its own README. In brief, an Interview is composed of a set of Questions, a Script dictating how they should be sequenced, and a Moderator which is responsible for presenting questions to a user and recording the user's responses. Response data is in the form of a JSON object.

The Interview app implements a Moderator which presents questions via a web application and records the responses via configurable screens. It will be helpful to have read the documentation for the library first.

Chekout a guessing game example here: [http://dc-interview.netlify.app](dc-interview.netlify.app).

## Interview Implementation

### Questions

The question set for the Interview app is defined by the TypeScript type [QuizQuestion](https://github.com/tsdataclinic/interview-web/blob/master/packages/frontend/src/Interview/QuizQuestion.ts). While these are all the possible questions, not all will necessarily come up in the flow of a given interview, depending on the user's responses.

### Script

The script which governs the sequencing of questions is defined in the TypeScript class [QuizScript](https://github.com/tsdataclinic/interview-web/blob/master/packages/frontend/src/Interview/QuizScript.ts). It is responsible for queueing up the initial set of questions (see `setup()`), and responding as questions are popped off the stack (see `prepare()` which is called before a question is presented to the user, and `process()` which is called after a user's response is submitted).

### Moderator

The Moderator is the most complex part of the Interview App's usage of the Interview library. For flexibility, we have implemented the [WebModerator](https://github.com/tsdataclinic/interview-web/blob/master/packages/frontend/src/Interview/WebModerator.ts) which is able to be configured via the [WebModeratorConfig](https://github.com/tsdataclinic/interview-web/blob/master/packages/frontend/src/Interview/WebModeratorConfig.tsx). The configuration is a TypeScript map whose keys are the enumerated values of the QuizQuestion type and whose values describe the screen which should be presented to the user for that question.

#### Configuring a Screen

A screen has three sections. A header at the top which contains a Prompt and Subprompt, a body in the middle which contains one or many form entries, and a footer at the bottom which contains navigational controls. A screen can be configured with the following properties:

-   `prompt` - The text which will be displayed in the header, above any entries. This can be thought of as "The Question".
-   `subprompt` (optional) - Text which will be displayed below the Prompt in the header, above any entries.
-   `footnote` (optional) - Text which will be displayed below any entries.
-   `entrySpecs` - A list of specifications of the types of entries which should appear on the screen. All entry specs have a `field` and a `type` property. The `field` property declares which field in the resulting JSON should be set by this form entry. The `type` declares what kind of form entry it should be. There are 8 different supported form entry types, described in [Entry Specification](https://github.com/tsdataclinic/interview-web/blob/master/packages/frontend/src/Interview/EntrySpecification.ts), each with its own additional properties.
-   `headerStyle` (optional) - If set to `'large'`, the header will display in a larger style, more appropriate for an introduction or final screen.
-   `complete` - a function which takes as input the current Response JSON and returns a boolean declaring whether the current screen's form has been filled out.
-   `required` - Whether this question is required to be filled out, or may be skipped
-   `navigation` - Configuration for the bottom navigation bar.

#### The Entry Types

The 8 different entry types are as follows:

-   `'free_text'` - A large textbox meant for multi-line responses. Configuration options are `placeholder` which optionally declares a placeholder text, and `label` which adds text above the textbox.
-   `'map_question'` - Location selector using Google Maps. No additional configuration.
-   `'multiple_choice'` - For an enumeration of possible choices. Configuration options are `searchable` which toggles a search bar, and `options` which enumerates the options.
-   `'dropdown'` - A dropdown select. Configuration options are `label` which adds text above the select element, and `options` which enumerates the options.
-   `'radio'` - A single-choice set of radio buttons. Configuration options are `options` which enumerates the options.
-   `'checkbox'` - A multiple-choice checkbox entry. Configuration options are `label` which adds text above the set of checkboxes, and `options` which enumerates the options.
-   `'date_picker'` - A date entry form. Configuration options are `label` which adds text above the entry.
-   `'time_picker'` - A time entry form. Configuration options are `label` which adds text above the entry.

#### Configuring Navigation

There are two buttons on the bottom bar. One on the right (i.e. Forward) and one on the left (i.e. Back). The presence of these buttons, as well as their appearance and prompt is configured on a per-screen basis by the `navigation` field of the screen configuration. That field should map to an object with the following (all optional) properties:

-   `forward` - this is how the right button should appear when the current screen is complete.
-   `incompleteForward` - how the right button should appear when the current screen is not complete
-   `back` - how the left button should appear.

In all cases, they should be set to an object with two optional properties: `icon`, the icon to display, and `prompt`, the text to show. `incompleteForward` has a third option: `action`, which should be set to `'forward'` or `'skip'` depending on whether the incomplete answer should be submitted in partial. Setting any of the three to `null` will cause it to not appear at all.

---
