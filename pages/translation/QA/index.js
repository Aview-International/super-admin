import { useEffect, useState } from 'react';
import { getRawSRT, createTranslatorProgress, updateTranslatorProgress, finishTranslation, getTranslatorProgress, getTranslatorById, getDownloadLink } from '../../../services/apis';
import { getPendingTranslation, getUserProfile } from '../../api/firebase'
import QATranslationBubble from '../../../components/translation/QATranslationBubble';
import { useRouter } from 'next/router';
import Button from '/components/UI/Button';
import Check from '/public/img/icons/check-circle-green.svg';
import Image from 'next/image';
import useWindowSize from '../../../hooks/useWindowSize';
import ExpandableText from '../../../components/translation/ExpandableDescription';
import {SupportedLanguages} from '../../../constants/constants';
import FullScreenLoader from '../../../public/loaders/FullScreenLoader';
import ErrorHandler from '../../../utils/errorHandler';
import SuccessHandler from '../../../utils/successHandler';
import Popup from '../../../components/UI/Popup';
import warning from '/public/img/icons/warning.svg';
import PageTitle from '../../../components/SEO/PageTitle';


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
    const [popupSubmit, setPopupSubmit] = useState(false);
    const [totalWords, setTotalWords] = useState(0);
    const [pay, setPay] = useState(0);
    const [content, setContent] = useState("video");
    const [uploadDate, setUploadDate] = useState(null);
    const [flags, setFlags] = useState([]);
    const [downloadLink, setDownloadLink] = useState(null);

    const router = useRouter();
    const { jobId } = router.query;
    const { translatorId } = router.query;

    const {width: windowWidth, height: windowHeight} = useWindowSize();

    const callback = (data) => {
        setJob(data);
    };

    const handleVideo = async () => {
        const videoPath  = `dubbing-tasks/${job.creatorId}/${jobId}/video.mp4`;
        console.log(videoPath);
        const downloadLink = await getDownloadLink(videoPath);
        setDownloadLink(downloadLink.data);
    }

    useEffect(() => {
        if(jobId){
            getJob(jobId);
        }
    },[jobId]);

    useEffect(() => {
        if (job){
            setLang((SupportedLanguages.find(language => language.languageName === job.translatedLanguage).translateCode));
            getProfile();
            const date = new Date(parseInt(job.timestamp));
            setUploadDate(date.toLocaleDateString('en-US',{year: 'numeric', month: 'long', day: 'numeric'}));
            setFlags(job.flags);
            handleVideo();
            console.log(job);
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
        if (progress && progress.translatorId == translatorId){
            setAcceptedJob(true);

            if (progress.progress){
                updateSubtitles(progress.progress);
            }

            if (progress.endTimestamp != null){
                setPopupSubmit(true);
            }
        }
    },[progress])

    const handleAccept = async () => {
        try{
            if (available){
                try{
                    let res = await createTranslatorProgress(jobId, job.creatorId, lang, translatorId, null,null,null);
                    setAcceptedJob(true);
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
        await finishTranslation(jobId, job.creatorId, translatorId)
        .then(() => {
            setLoader('');
            setPopupSubmit(true);
        }).catch((error) => {
            ErrorHandler(error, "Failed to approve.");
            setLoader('');
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

    const getSrtText = () => {
        let srtContent = [] 

        subtitles.forEach(subtitle => {
            srtContent.push(subtitle.text);
        });
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
            <PageTitle title="Moderation" />
            <style>
            {`
            ::-webkit-scrollbar-track {
                background: #28243c !important;
                border-radius: 100vw;
            }
            `}
            </style>
            <Popup show={popupSubmit} disableClose={true}>
                <div className="w-full h-full">
                        <div className="w-[500px] bg-indigo-2 rounded-2xl p-s3">
                            <div className="flex flex-col justify-center items-center">
                                <h2 className="text-white text-2xl mb-s2">Submitted!</h2>
                                <p className="text-white">Please wait 1-2 business days for payment to process. Thank you.</p>


                            </div>
                            

                        </div>
                </div>
            </Popup>
            {isLoading && <FullScreenLoader/>}
                {acceptedJob ? 
                    <div className={`flex `}>
                        <div className={`w-1/2 fixed left-0 top-0 h-screen py-s5 pl-s5 pr-s1 flex flex-col`}>
                            <h2 className="text-white mb-s2 text-2xl">Transcription</h2>
                            <div className="flex flex-row items-center h-[43px] mb-s2">
                                <div className="px-s2 py-[9px] text-indigo-2 bg-white w-fit text-xl rounded-lg h-[43px]">
                                    {job ? job.translatedLanguage : ""}
                                </div>
                                {job && flags.length > 0 &&
                                    <div className="ml-auto">
                                        <div className="flex flex-row items-center">
                                            <Image src={warning}></Image>
                                            <span className="text-white ml-[6px] text-lg mt-[4px]">May be potentially offensive</span>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="bg-white-transparent flex-1 rounded-2xl p-s2 w-full h-full relative overflow-hidden">
                                <div className="rounded-2xl w-full h-full overflow-y-auto">
                                    <div className="p-s2">
                                    {subtitles.map(subtitle => subtitle.index && (
                                        <QATranslationBubble
                                            key={subtitle.index}
                                            index={subtitle.index}
                                            time={subtitle.time}
                                            text={subtitle.text}
                                            width={windowWidth}
                                            height={windowHeight}
                                            updateText={(newText) => updateSubtitleText(subtitle.index, newText)}
                                            offensive={flags.includes(parseInt(subtitle.index))}
                                        />
                                    ))}
                                    </div>
                                </div>
                            </div>
                            
                            
                        </div>
                    
                    {content == "video" &&
                        <div className={`w-1/2 fixed right-0 top-0 h-screen py-s5 pr-s5 pl-s1 flex flex-col`}>
                            <h2 className="text-white mb-s2 text-2xl">Content</h2>
                            <div className="flex flex-row gap-s2">
                                <div className={`px-s2 py-[9px] ${content=="video" ? "bg-white text-indigo-2" : "bg-white-transparent text-white"} w-fit text-xl rounded-lg h-[43px] mb-s2 cursor-pointer`} onClick={() => setContent("video")}>
                                    Video
                                </div>
                                <div className={`px-s2 py-[9px] ${content=="original subtitles" ? "bg-white text-indigo-2" : "bg-white-transparent text-white"} w-fit text-xl rounded-lg h-[43px] mb-s2 cursor-pointer`} onClick={() => setContent("original subtitles")}>
                                    {job ? job.originalLanguage : ""} subtitles
                                </div>
                            </div>
                            
                            <div className="bg-white-transparent flex-1 rounded-2xl p-s2 w-full h-full relative">
                                <h2 className="text-white mb-2 text-xl">{job ? job.videoData.caption: ""}</h2>
                                <h2 className="text-white mb-4 text-base">{creatorName ? creatorName : ""}</h2>
                                {downloadLink &&
                                <div className="relative w-full overflow-hidden mb-s5" style={{paddingTop:"56.25%"}}>
                                    <video style={{ objectFit: 'contain', position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: '#000' }} controls>
                                        <source src={downloadLink ? downloadLink : ""} type="video/mp4" />
                                    </video>
                                </div>}
                                <div className="grid grid-cols-2 justify-center gap-s2">

                                    <Button
                                        
                                        classes="flex flex-row justify-center items-center h-[48px]"
                                        onClick={() => handleSave()}
                                        isLoading={loader === 'save'}
                                    >
                                        {/* <Image src={Save} alt="" width={24} height={24} className="relative"/> */}
                                        <span>Save</span>
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
                                
                                <div className="absolute bottom-[23px] h-[45px] w-1/3 flex flex-grow">
                                    <Button
                                            theme="gray"
                                            classes="flex justify-center items-center h-[45px]"
                                            onClick={() => handleResetSRT()}
                                            isLoading={loader === 'reset'}
                                        >
                                            <span className="mr-2">Reset</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    }
            

                    {content == "original subtitles" &&
                        <div className={`w-1/2 fixed right-0 top-0 h-screen py-s5 pr-s5 pl-s1 flex flex-col`}>
                            <h2 className="text-white mb-s2 text-2xl">Content</h2>
                            <div className="flex flex-row gap-s2">
                                <div className={`px-s2 py-[9px] ${content=="video" ? "bg-white text-indigo-2" : "bg-white-transparent text-white"} w-fit text-xl rounded-lg h-[43px] mb-s2 cursor-pointer`} onClick={() => setContent("video")}>
                                    Video
                                </div>
                                <div className={`px-s2 py-[9px] ${content=="original subtitles" ? "bg-white text-indigo-2" : "bg-white-transparent text-white"} w-fit text-xl rounded-lg h-[43px] mb-s2 cursor-pointer`} onClick={() => setContent("original subtitles")}>
                                    {job ? job.originalLanguage : ""} subtitles
                                </div>
                            </div>
                            <div className="bg-white-transparent flex-1 rounded-2xl p-s2 w-full h-full relative overflow-hidden">
                                <div className="rounded-2xl w-full h-full overflow-y-auto">
                                    <div className="p-s2">
                                        {englishSubtitles.map(subtitle => subtitle.index && (
                                            <QATranslationBubble
                                                key={subtitle.index}
                                                index={subtitle.index}
                                                time={subtitle.time}
                                                text={subtitle.text}
                                                width={windowWidth}
                                                height={windowHeight}
                                                editable={false}
                                                offensive={flags.includes(parseInt(subtitle.index))}
                                            />
                                        ))} 
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div> 

                :

                <div className="flex justify-center items-center h-screen w-screen py-[40px]">
                    <div className="w-[1360px] bg-white-transparent h-full rounded-lg flex justify-center overflow-y-auto overflow-x-hidden">
                        <div>
                            <div className="w-[656px] flex justify-center flex-col">
                                <div className="flex-1 my-[40px]"> 
                                    <div className="relative overflow-hidden mb-s5" style={{paddingTop:"56.25%"}}>
                                        {downloadLink &&
                                        <video style={{ objectFit: 'contain', position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: '#000' }} controls>
                                            <source src={downloadLink ? downloadLink : ""} type="video/mp4" />
                                        </video>}
                                    </div>

                                    <div className="grid grid-cols-3 gap-y-[40px] gap-x-[16px] grid-rows-2 justify-center mb-[36px]">
                                        <GridItem label="CREATED BY" value={creatorName ? creatorName : ""}></GridItem>
                                        <GridItem label="ORIGINAL LANGUAGE" value={job ? job.originalLanguage: ""}></GridItem>
                                        <GridItem label="TRANSLATED LANGUAGE" value={job ? job.translatedLanguage : ""}></GridItem>
                                        <GridItem label="WORD COUNT" value={totalWords}></GridItem>
                                        <GridItem label="ESTIMATED PAY" value={`$${pay}`}></GridItem>
                                        <GridItem label="DATE POSTED" value={uploadDate ? uploadDate : ""}></GridItem>
                                    </div>
                                    {job && job.videoData.description != "" &&
                                        <ExpandableText text="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
                                    }
                                    
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



