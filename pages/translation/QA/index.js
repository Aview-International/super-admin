import { useEffect, useState } from 'react';
import { getRawSRT, createTranslatorProgress, updateTranslatorProgress, finishTranslation, getTranslatorProgress, getTranslatorById } from '../../../services/apis';
import { getPendingTranslation, getUserProfile } from '../../api/firebase'
import QATranslationBubble from '../../../components/translation/QATranslationBubble';
import { useRouter } from 'next/router';
import Button from '/components/UI/Button';
import Check from '/public/img/icons/check-circle-green.svg';
import Save from '/public/img/icons/download.svg';
import Image from 'next/image';
import useWindowSize from '../../../hooks/useWindowSize';
import ExpandableText from '../../../components/translation/ExpandableDescription';
import {SupportedLanguages} from '../../../constants/constants';
import FullScreenLoader from '../../../public/loaders/FullScreenLoader';
import ErrorHandler from '../../../utils/errorHandler';
import SuccessHandler from '../../../utils/successHandler';
import Popup from '../../../components/UI/Popup';


const QA = () => {
    const [subtitles, setSubtitles] = useState([]);
    const [englishSubtitles, setEnglishSubtitles] = useState([]);
    const [loader, setLoader] = useState('');
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [creatorName, setCreatorName] = useState('');
    const [acceptedJob, setAcceptedJob] = useState(false);
    const [available, setAvailable] = useState(true);
    const [lang, setLang] = useState("");
    const [progress, setProgress] = useState(null);
    const [popupSubmit, setPopupSubmit] = useState(false)
    const [totalWords, setTotalWords] = useState(0);
    const [pay, setPay] = useState(0);
    const [content, setContent] = useState("video");

    const router = useRouter();
    const { jobId } = router.query;
    const { translatorId } = router.query;

    const {width: windowWidth, height: windowHeight} = useWindowSize();

    

    const callback = (data) => {
        setJob(data);
    };

    useEffect(() => {
        if(jobId){
            getJob(jobId);
            
            
        }
    },[jobId]);

    useEffect(() => {
        if (job){
            console.log(job);
            setLang((SupportedLanguages.find(language => language.languageName === job.languages)["translateCode"]));
            getProfile();
        }
    },[job]);

    useEffect(() => {
        const fetchData = async () => {
          if (lang) {
            await getSrt(job.creatorId, jobId, lang); 
            await getEnglishSrt(job.creatorId, jobId);
            await getTranslator(jobId); 
          }
        };
        fetchData();
      }, [lang]); 

    useEffect(() => {
        //check to see if the current translator is the translator that took the job
        if (progress && progress['translatorId'] == translatorId){
            setAcceptedJob(true);

            if (progress["progress"]){
                console.log(progress["progress"].length, subtitles.length);
                updateSubtitles(progress["progress"]);
            }
        }
    },[progress])


    const handleAccept = async () => {
        try{
            if (available){
                console.log(lang)
                try{
                    let res = await createTranslatorProgress(jobId, job.creatorId, lang, translatorId, null,null,null);
                    setAcceptedJob(true);
                    console.log(res);
                }catch(error){
                    ErrorHandler(error);
                }
                
                
            }else{
                throw new Error("Job has already been taken. Please select an available job.");
            }
        }catch(error){
            ErrorHandler(error);
        }
        
        
    }

    const getTranslator = async (jobId) => {
        console.log(jobId);
        console.log(translatorId);
        try{
            await getTranslatorById(translatorId)
            .then((res) => {
                if (res.data == ""){
                    throw new Error("Invalid translatorId.");
                }
                
            })
            .catch((error) => {
                throw new Error("Invalid translatorId.");
                
            });
            await getTranslatorProgress(jobId)
            .then( (res) => {
                console.log(res);
                setAvailable(res.data == "");
    
                if (res.data != ""){
                    setProgress(res.data);
                }
            });
            setIsLoading(false);
        }catch(error){
            ErrorHandler(error);
        }
       
        
        
    }

    const updateSubtitles = (newSubtitles) => {
        const updatedArray = subtitles.map((item,index) => {
            return {
              ...item,
              text:  newSubtitles[index]
            };
        });

        setSubtitles(updatedArray);
    }

    const handleResetSRT = async () => {
        setLoader('reset');
        await getSrt(job.creatorId, jobId, lang);
        await updateTranslatorProgress(jobId, null)
        .then(() => {
            // This code will run after the promise is successfully fulfilled
            setLoader('');
            SuccessHandler("Changes discarded.");
        })
        .catch((error) => {
            // This code will run if there is an error during the promise execution
            setLoader('');
            ErrorHandler("Failed to discard changes", error);
        });


    }

    const handleApprove = async () => {
        setLoader('approve');
        await updateTranslatorProgress(jobId, getSrtText());
        await finishTranslation(jobId)
        .then(() => {
            setLoader('');
            setPopupSubmit(true);
        }).catch((error) => {
            
            ErrorHandler(error, "Failed to approve.");
        });
        
    }

    const handleSave = async () => {
        setLoader('save');
        updateTranslatorProgress(jobId, getSrtText())
        .then(() => {
            setLoader('');
            SuccessHandler("Progress saved.");
        })
        .catch((error) => {
            setLoader('');
            ErrorHandler("Failed to save progress.", error);
        });
    }


    const getProfile = async () => {
        const res = await getUserProfile(job.creatorId);
        setCreatorName(res?.firstName + ' ' + res?.lastName);
      };
      

    const getJob = async (jobId) => {
        await getPendingTranslation(jobId, callback); 
    }

    const getSrt = async (creatorId, jobId, key) => {
        const data  = await getRawSRT(`dubbing-tasks/${creatorId}/${jobId}/${key}.srt`);
        console.log(data);
        let processedSubtitles = [];
        let numWords = 0;
        let estimatedPay = 0;

        const lines = data.split('\n');

        for (let i = 0; i < lines.length; i+=4){
            let subtitleBlock = {
                index: lines[i],
                time: lines[i + 1],
                text: lines[i + 2]
            };
            processedSubtitles.push(subtitleBlock);
        }

        for (let i = 0; i < processedSubtitles.length; i ++){
            numWords += countWords(processedSubtitles[i].text);
        }

        estimatedPay = ((processedSubtitles.length * 0.02) + ((processedSubtitles.length/4) * 0.07)).toFixed(2);
    
        setSubtitles(processedSubtitles);
        setTotalWords(numWords);
        setPay(estimatedPay);
    };

    const getEnglishSrt = async (creatorId, jobId) => {
        const data  = await getRawSRT(`dubbing-tasks/${creatorId}/${jobId}/original.srt`);
        let processedSubtitles = [];

        const lines = data.split('\n');

        for (let i = 0; i < lines.length; i+=4){
            let subtitleBlock = {
                index: lines[i],
                time: lines[i + 1],
                text: lines[i + 2]
            };
            processedSubtitles.push(subtitleBlock);
        }
    
        setEnglishSubtitles(processedSubtitles);
    }

    // const rebuildSRTFile = () => {
    //     let srtContent = "";

    //     subtitles.forEach(subtitle => {
    //         // Ensure that each subtitle block has an index, time, and text
    //         if(subtitle.index && subtitle.time && subtitle.text) {
    //             srtContent += `${subtitle.index}\n`;
    //             srtContent += `${subtitle.time}\n`;
    //             srtContent += `${subtitle.text}\n\n`; // Two newlines to separate this block from the next
    //         }
    //     });

    //     return srtContent.trim(); // Trim to remove extra newline at the end if any
    // };

    const getSrtText = () => {
        let srtContent = [] 

        subtitles.forEach(subtitle => {
            srtContent.push(subtitle.text);
        });
        console.log(srtContent);
        return srtContent;

    };

    function countWords(str) {
        if (str){
            const words = str.split(' ').filter(word => word.length > 0);
      
            return words.length;
        }
        return 0;
        
    }


    const updateSubtitleText = (index, newText) => {
        const updatedSubtitles = subtitles.map((subtitle) => {
          if (subtitle.index === index) {
            return { ...subtitle, text: newText };
          }
          return subtitle;
        });
    
        setSubtitles(updatedSubtitles);
    };

    const GridItem = ({ label, value, style=''}) => {
        return (
            <div className={`w-[208px] ${style}`}>
                <h2 className="text-gray-2 text-xs mb-[8px]">{label}</h2>
                <h2 className="text-white text-lg">{value}</h2>
            </div>
        );
    };


    return (
        <div>
        <Popup show={popupSubmit} onClose={() => setPopupSubmit(false)}>
            <div className="w-full h-full">
                    <div className="w-[500px] bg-indigo-2 rounded-lg p-s3">
                        <div className="flex flex-col justify-center items-center">
                            <h2 className="text-white text-2xl mb-s2">Submitted!</h2>
                            <p className="text-white">Please wait 1-2 business days for payment to process. Thank you.</p>


                        </div>
                        

                    </div>
            </div>
        </Popup>
        {isLoading && <FullScreenLoader/>}
        {acceptedJob ? 
            <div className="flex overflow-y-auto">
                <div className="w-1/2 max-h-screen">
                    <div className="py-s5 pl-s5 pr-s1">
                        <h2 className="text-white mb-s2 text-2xl">Transcription</h2>
                        <div className="px-s2 py-[9px] text-indigo-2 bg-white w-fit text-xl rounded-lg h-[43px] mb-s2">
                            {job ? job.languages : ""}
                        </div>
                        <div className="bg-white-transparent p-s2 rounded-2xl">
                            {subtitles.map(subtitle => subtitle.index && (
                                <QATranslationBubble
                                    key={subtitle.index}
                                    index={subtitle.index}
                                    time={subtitle.time}
                                    text={subtitle.text}
                                    width={windowWidth}
                                    height={windowHeight}
                                    updateText={(newText) => updateSubtitleText(subtitle.index, newText)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className={`w-1/2 ${content=="video" ? "fixed right-0 top-0 h-screen": "h-full"} py-s5 pr-s5 pl-s1 flex flex-col`}>
                    <h2 className="text-white mb-s2 text-2xl">Content</h2>
                    <div className="flex flex-row gap-s2">
                        <div className={`px-s2 py-[9px] ${content=="video" ? "bg-white text-indigo-2" : "bg-white-transparent text-white"} w-fit text-xl rounded-lg h-[43px] mb-s2 cursor-pointer`} onClick={() => setContent("video")}>
                            Video
                        </div>
                        <div className={`px-s2 py-[9px] ${content=="english subtitles" ? "bg-white text-indigo-2" : "bg-white-transparent text-white"} w-fit text-xl rounded-lg h-[43px] mb-s2 cursor-pointer`} onClick={() => setContent("english subtitles")}>
                            English Subtitles
                        </div>
                    </div>
                    {content == "video" &&
                        <div className="bg-white-transparent flex-1 rounded-2xl p-6 w-full h-full">
                            <h2 className="text-white mb-2 text-xl">{job ? job.videoData.caption: ""}</h2>
                            <h2 className="text-white mb-4 text-base">{creatorName ? creatorName : ""}</h2>
                            <div className="relative w-full overflow-hidden mb-s5" style={{paddingTop:"56.25%"}}>
                                <iframe
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                width="100%"
                                height="100%"
                                src={job ? job.videoData.videoUrl : `https://www.youtube.com/embed/hz9Ek6fxX48`}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                ></iframe>
                            </div>
                            <div className="grid grid-cols-3 justify-center gap-s4">
                                <Button
                                    theme="error"
                                    classes="flex justify-center items-center h-[48px]"
                                    onClick={() => handleResetSRT()}
                                    isLoading={loader === 'reset'}
                                >
                                    <span className="mr-2">Reset</span>
                                </Button>

                                <Button
                                    theme="gray"
                                    classes="flex flex-row justify-center items-center h-[48px]"
                                    onClick={() => handleSave()}
                                    isLoading={loader === 'save'}
                                >
                                    <Image src={Save} alt="" width={24} height={24} className="relative"/>
                                    <span className="ml-2">Save</span>
                                </Button>

                                <Button
                                    theme="success"
                                    classes="flex justify-center items-center h-[48px]"
                                    onClick={() => handleApprove()}
                                    isLoading={loader === 'approve'}
                                >
                                    <span className="mr-2">Approve</span>
                                    <Image src={Check} alt="" width={24} height={24} />
                                </Button>
                            </div>
                        </div>
                    }
                    {content=="english subtitles" &&
                        <div className="w-full">
                                <div className="bg-white-transparent p-s2 rounded-2xl">
                                    {englishSubtitles.map(subtitle => subtitle.index && (
                                        <QATranslationBubble
                                            key={subtitle.index}
                                            index={subtitle.index}
                                            time={subtitle.time}
                                            text={subtitle.text}
                                            width={windowWidth}
                                            height={windowHeight}
                                            editable={false}
                                        />
                                    ))} 
                                </div>
                            
                        </div>
                    }
                </div>
            </div> 

            :

            <div className="flex justify-center items-center h-screen w-screen py-[40px]">
                <div className="w-[1360px] bg-white-transparent h-full rounded-lg flex justify-center overflow-y-auto overflow-x-hidden overflow-y-auto">
                    <div>
                        <div className="w-[656px] flex justify-center flex-col">
                            <div className="flex-1 my-[40px]"> 
                                <div className="relative overflow-hidden mb-s5" style={{paddingTop:"56.25%"}}>
                                    <iframe
                                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                                        src={job ? job.videoData.videoUrl : `https://www.youtube.com/embed/hz9Ek6fxX48`}
                                        title="YouTube video player"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    ></iframe>
                                </div>

                                <div className="grid grid-cols-3 gap-y-[40px] gap-x-[16px] grid-rows-2 justify-center mb-[36px]">
                                    <GridItem label="CREATED BY" value={creatorName ? creatorName : ""}></GridItem>
                                    <GridItem label="ORIGINAL LANGUAGE" value="English"></GridItem>
                                    <GridItem label="TRANSLATED LANGUAGE" value={job ? job.languages : ""}></GridItem>
                                    <GridItem label="WORD COUNT" value={totalWords}></GridItem>
                                    <GridItem label="ESTIMATED PAY" value={`$${pay}`}></GridItem>
                                    <GridItem label="DATE POSTED" value="January 31, 2024"></GridItem>
                                </div>

                                <ExpandableText text="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />

                                
                                <div className="w-[138px] h-[40px]">
                                    <Button
                                        theme="light"
                                        classes="flex flex-row justify-center items-center"
                                        onClick={() => handleAccept()}
                                        isLoading={loader === 'approve'}
                                    >
                                        <span>Accept</span>
                                    </Button>
                                </div>

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



