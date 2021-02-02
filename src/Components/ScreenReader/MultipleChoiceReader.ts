import { slug } from '../../utils';

import { MultipleChoiceOption } from '../../Interview/MultipleChoiceOption';

export function MultipleChoiceReader(
    options:
        | MultipleChoiceOption[]
        | ((query: string | undefined) => MultipleChoiceOption[])
) {
    const processedOptions =
        typeof options == 'function' ? options(undefined) : options;

    let audioList: { key: string; url: string }[] = [];
    for (let option of processedOptions) {
        const textUrl = `${process.env.PUBLIC_URL}/audio_prompts/${slug(
            option.text
        )}.mp3`;
        audioList.push({ key: option.text, url: textUrl });
        if (option.subtext) {
            const subtextUrl = `${process.env.PUBLIC_URL}/audio_prompts/${slug(
                option.subtext
            )}.mp3`;
            audioList.push({ key: option.subtext, url: subtextUrl });
        }
    }

    return audioList;
}
