import { slug } from '../src/utils';
import rp from 'request-promise';
import fs from 'fs';
import xmlbuilder from 'xmlbuilder';
import { config as dotEnvConfig } from 'dotenv';
import { SupportedLanguage } from '../src/Interview/SupportedLanguage';
import { phrases } from '../src/Interview/Phrases';
import { Phrase } from '../src/Interview/Phrase';

dotEnvConfig();

const subscriptionKey = process.env.REACT_APP_SPEECH_SERVICE_KEY;
const audioOutputDir = './public/audio_prompts';

function getAccessToken(subscriptionKey: string): any {
    let options = {
        method: 'POST',
        uri: 'https://eastus.api.cognitive.microsoft.com/sts/v1.0/issuetoken',
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
        },
    };
    return rp(options);
}

function textToSpeech(
    accessToken: string,
    audioOutputDir: string,
    text: string,
    voice: string,
    lang: string
): any {
    const fileName = `${audioOutputDir}/${slug(text)}.mp3`;
    console.log('running ', text);
    if (fs.existsSync(fileName)) {
        console.log('already done ', fileName);
        return Promise.resolve('done');
    }

    let xml_body = xmlbuilder
        .create('speak')
        .att('version', '1.0')
        .att('xml:lang', lang)
        .ele('voice')
        .att('xml:lang', lang)
        .att('name', voice)
        .txt(text)
        .end();
    // Convert the XML into a string to send in the TTS request.
    let body = xml_body.toString();
    // Convert the XML into a string to send in the TTS request.

    let options = {
        method: 'POST',
        baseUrl: 'https://eastus.tts.speech.microsoft.com/',
        url: 'cognitiveservices/v1',
        headers: {
            Authorization: 'Bearer ' + accessToken,
            'cache-control': 'no-cache',
            'User-Agent': 'interview',
            'X-Microsoft-OutputFormat': 'audio-24khz-160kbitrate-mono-mp3',
            'Content-Type': 'application/ssml+xml',
        },
        body: body,
    };

    let request = rp(options).on('response', (response) => {
        if (response.statusCode === 200) {
            request.pipe(fs.createWriteStream(fileName));
        } else {
            console.log(`Request failed for "${text}"`);
        }
    });
    return request;
}

getAccessToken(subscriptionKey).then((accessToken: string) => {
    const keys: string[] = Object.keys(phrases);
    const langKeys: SupportedLanguage[] = ['en', 'hi'];

    const getNextAudio = (
        voices: { [key in SupportedLanguage]: string },
        index = 0,
        langIndex = 0
    ) => {
        const phrase: Phrase = phrases[keys[index]];
        const lang: SupportedLanguage = langKeys[langIndex];
        textToSpeech(
            accessToken,
            audioOutputDir,
            phrase[lang],
            voices[lang],
            lang
        )
            .then((result: any) => {
                const waitTime = result === 'done' ? 10 : 1500;
                let nextCall: () => void = () => process.exit(0);
                if (
                    index + 1 === keys.length &&
                    langIndex + 1 === langKeys.length
                ) {
                    console.log('All done');
                } else if (langIndex + 1 === langKeys.length) {
                    nextCall = () => getNextAudio(voices, index + 1, 0);
                } else {
                    nextCall = () => getNextAudio(voices, index, langIndex + 1);
                }
                setTimeout(nextCall, waitTime);
            })
            .catch((error: any) => {
                console.log('Caught error. Waiting 5 seconds and retrying');
                setTimeout(() => getNextAudio(voices, index, langIndex), 5000);
            });
    };

    getNextAudio({
        en: 'en-IN-Heera-Apollo',
        hi: 'hi-IN-Kalpana-Apollo',
    });
});
