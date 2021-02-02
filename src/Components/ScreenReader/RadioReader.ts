import { audioFileSlugFromRadioOption } from '../../utils';
import { RadioOption } from '../../Interview/RadioOption';

export function RadioReader(options: RadioOption[]) {
    return options.map((option) => {
        const audioFileSlug = audioFileSlugFromRadioOption(option);
        const url = `${process.env.PUBLIC_URL}/audio_prompts/${audioFileSlug}.mp3`;
        return { key: option.text, url };
    });
}
