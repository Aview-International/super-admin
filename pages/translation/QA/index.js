import { useEffect, useState } from 'react';
import { getRawSRT } from '../../../services/apis';
import QATranslationBubble from '../../../components/translation/QATranslationBubble';
import { useRouter } from 'next/router';
import Button from '/components/UI/Button';
import Check from '/public/img/icons/check-circle-green.svg';
import Save from '/public/img/icons/download.svg';
import Image from 'next/image';
import useWindowSize from '../../../hooks/useWindowSize';

const QA = () => {
    const [subtitles, setSubtitles] = useState([]);
    const [loader, setLoader] = useState('');

    const router = useRouter();
    const { creatorid, date } = router.query;
    let { translatedLanguageKey = ''} = router.query;
    let transcriptLang = translatedLanguageKey.split(' ')[0];
    const {width: windowWidth, height: windowHeight} = useWindowSize();

    const acceptedJob = true;

    useEffect(() => {
        if (creatorid && date && translatedLanguageKey) {
            translatedLanguageKey = `lang=${translatedLanguageKey}`;
            console.log(creatorid, date, translatedLanguageKey);
            get_srt(creatorid, date, translatedLanguageKey);
        }
    }, [creatorid, date, translatedLanguageKey,acceptedJob]); // Depend on the router query params

    const get_srt = async (creatorId, date, key) => {
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

    const rebuildSRTFile = () => {
        let srtContent = "";

        subtitles.forEach(subtitle => {
            // Ensure that each subtitle block has an index, time, and text
            if(subtitle.index && subtitle.time && subtitle.text) {
                srtContent += `${subtitle.index}\n`;
                srtContent += `${subtitle.time}\n`;
                srtContent += `${subtitle.text}\n\n`; // Two newlines to separate this block from the next
            }
        });

        return srtContent.trim(); // Trim to remove extra newline at the end if any
    };

    const handleSaveSRT = () => {
        const srtContent = rebuildSRTFile();
        console.log(srtContent); // You can replace this with actual file saving logic
        // Logic to save srtContent to a file or send it to a backend server
    };


    return (
        <div>
        {acceptedJob ? 
            <div className="flex overflow-y-auto">
                <div className="w-1/2 max-h-screen">
                    <div className="py-10 pl-10">
                        <h2 className="text-white mb-5 text-xl">Transcription - {transcriptLang}</h2>
                        {subtitles.map(subtitle => subtitle.index && (
                            <QATranslationBubble
                                key={subtitle.index}
                                index={subtitle.index}
                                time={subtitle.time}
                                text={subtitle.text}
                                width={windowWidth}
                                height={windowHeight}
                            />
                        ))}
                        <QATranslationBubble
                                index={'1'}
                                time={'1'}
                                text={'The thing is that this is not only not consistent, if you use same classes elsewhere, it will work (this also includes cached builds), but it also doesn’t show any kind of errors or warnings.Actually as it currently stands, it seems that the limitation is that the string should be known at compile-time, things such as this work:'}
                                width={windowWidth}
                                height={windowHeight}
                        />
                        
                    </div>
                </div>

                {/* <div className="w-1/2 max-h-screen bg-transparent p-10 flex flex-col"> */}
                <div className="w-1/2 fixed right-0 top-0 p-10 h-screen flex flex-col">
                    <div className="bg-white-transparent flex-1 rounded-3xl p-6">
                        <h2 className="text-white mb-2 text-xl">I Made a Tiny Touch ID Button for Mac!</h2>
                        <h2 className="text-white mb-4 text-base">Snazzy Labs</h2>
                        <div className="relative w-full overflow-hidden mb-10" style={{paddingTop:"56.25%"}}>
                            <iframe
                            className="absolute top-0 left-0 w-full h-full rounded-3xl"
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/hz9Ek6fxX48`}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            ></iframe>
                        </div>
                        <div className="grid grid-cols-3 justify-center gap-s2">
                            <Button
                                theme="gray"
                                classes="flex justify-center items-center"
                                onClick={() =>
                                    handleSaveSRT()
                                }
                                isLoading={loader === 'approve'}
                            >
                                <span className="mr-2">Reset</span>
                            </Button>

                            <Button
                                theme="gray"
                                classes="flex flex-row justify-center items-center"
                                onClick={() => handleSaveSRT()}
                                isLoading={loader === 'approve'}
                            >
                                <Image src={Save} alt="" width={24} height={24} className="relative"/>
                                <span className="ml-2">Save</span>
                            </Button>

                            <Button
                                theme="success"
                                classes="flex justify-center items-center"
                                onClick={() =>
                                handleApproval(vid.date, vid.objectS3Key, lang)
                                }
                                isLoading={loader === 'approve' && button === lang}
                            >
                                <span className="mr-2">Approve</span>
                                <Image src={Check} alt="" width={24} height={24} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div> 

            :

            <div className="flex justify-center items-center h-screen w-screen p-9">
                <div className="w-[1360px] bg-white-transparent h-full rounded-2xl flex justify-center p-9">
                    <div className="w-[656px] bg-white">
                        <div className="flex-1"> {/* Responsive padding */}
                            <div className="relative overflow-hidden mb-10" style={{paddingTop:"56.25%"}}>
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full rounded-3xl"
                                    src={`https://www.youtube.com/embed/hz9Ek6fxX48`}
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        }
        </div>
    );
};

export default QA;



