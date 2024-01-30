import { useEffect, useState } from 'react';
import { downloadS3Object, getRawSRT } from '../../../services/apis';
import { useRouter } from 'next/router';

const QA = () => {
    const [subtitles, setSubtitles] = useState([]);
    const router = useRouter();
    const { creatorid, date } = router.query;
    let { translatedLanguageKey } = router.query;

    useEffect(() => {
        if (creatorid && date && translatedLanguageKey) {
            translatedLanguageKey = `lang=${translatedLanguageKey}`;
            console.log(creatorid, date, translatedLanguageKey);
            process_srt(creatorid, date, translatedLanguageKey);
        }
    }, [creatorid, date, translatedLanguageKey]); // Depend on the router query params

    const process_srt = async (creatorId, date, key) => {
        const data  = await getRawSRT(`srt-files/${creatorId}/${date}/${key}`);
        console.log(data);
        const processedSubtitles = [];

        const lines = data.split('\n');

        for (let i = 0; i < lines.length; i+=4){
            let subtitleBlock = {
                index: lines[i],
                time: lines[i + 1],
                text: lines[i + 2]
            };
            processedSubtitles.push(subtitleBlock);
        }


        setSubtitles(processedSubtitles);
    };


    return (
        <div>
          <h1>Subtitles</h1>
          {subtitles.map(subtitle => (
            <div key={subtitle.index}>
              <p className="text-white">{subtitle.time}</p>
              <p className="text-white">{subtitle.text}</p>
            </div>
          ))}
        </div>
    );
};

export default QA;



