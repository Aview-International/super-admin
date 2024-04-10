import { useEffect, useState } from 'react';
import PageTitle from '../../components/SEO/PageTitle';
import { useRouter } from 'next/router';
import ErrorHandler from '../../utils/errorHandler';
import Popup from '../../components/UI/PopupWithBorder';
import FullScreenLoader from '../../public/loaders/FullScreenLoader';
import { SupportedLanguages } from '../../constants/constants';
import {
    getUserProfile,
    verifyTranslator,
    flagOverlayJob,
  } from '../../services/firebase';
import { 
    completeJob,
    getDownloadLink,
    getTranslatorFromUserId,
    getJobAndVerify, }  from '../../services/apis';
import Check from '../../public/img/icons/check-circle-green.svg';
import Cookies from 'js-cookie';
import { authStatus } from '../../utils/authStatus';
import Button from '../../components/UI/Button';
import Image from 'next/image'
import Timer from '../../components/UI/Timer';

const pending = () => {
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [translatorId, setTranslatorId] = useState(null);
    const [videoLink, setVideoLink] = useState(null);
    const [originalVideoLink, setOriginalVideoLink] = useState(null);
    const [creatorName, setCreatorName] = useState(null);
    const [creatorPfp, setCreatorPfp] = useState(null);
    const [loader, setLoader] = useState(null);
    const [popupApprove, setPopupApprove] = useState(false);

    const router = useRouter();
    const { jobId } = router.query;

    const handleApproval = async () => {
        setLoader('approve');
        await completeJob(job.creatorId, job.timestamp).then(() => {
          setLoader('');
          successHandler('Approved!');
          setPopupApprove(true);
        });
    };

    const handleFlag = async (jobId) => {
        try {
          const verify = await verifyTranslator(translatorId, jobId);
    
          if (!verify) {
            throw new Error('Job has expired');
          }
    
          setLoader('flag');
          await flagOverlayJob(jobId).then(() => {
            setLoader('');
            setPopupSubmit(true);
            setPopupText('Flagged!');
          });
        } catch (error) {
          ErrorHandler(error);
        }
    };

    const getJob = async (jobId, translatorId) => {

        try {
            const job = await getJobAndVerify(translatorId, jobId)
            setJob(job.data);
            setIsLoading(false);
        }catch(error) {
            ErrorHandler(error);
        }
    }

    const handleTranslator = async (userId) => {
        const translator = await getTranslatorFromUserId(userId);
        console.log(translator.data._id);
        setTranslatorId(translator.data._id);
    };

    const handleVideo = async () => {
        if (job && translatorId) {
            const res = await getUserProfile(job.creatorId);
        
            setCreatorName(res?.firstName + ' ' + res?.lastName);
            setCreatorPfp(res?.picture);

            const languageCode = SupportedLanguages.find(
                (language) => language.languageName === job.translatedLanguage
            ).translateCode;
        
            const videoPath = `dubbing-tasks/${job.creatorId}/${jobId}/${languageCode}.mp4`;
            const originalVideoPath = `dubbing-tasks/${job.creatorId}/${jobId}/video.mp4`
            const downloadLink = await getDownloadLink(videoPath);
            const originalDownloadLink = await getDownloadLink(originalVideoPath);
    
            console.log(downloadLink);
            setVideoLink(downloadLink.data);
            setOriginalVideoLink(originalDownloadLink.data);
        }
    }

    useEffect(() => {
        const token = Cookies.get("session");
        console.log(token);
        const userId = authStatus(token).data.user_id;
        console.log(token);
        console.log(userId);
    
        handleTranslator(userId);
    
    },[]);

    useEffect(() => {
        if(jobId && translatorId) {
            getJob(jobId, translatorId);
        }
    }, [jobId, translatorId]);

    useEffect(() => {
        if (job && translatorId) {
            handleVideo();
        }
    }, [job, translatorId]);

    return(
        <>
        <PageTitle title="Pending" />

        {isLoading && <FullScreenLoader/>}
        <Popup show={popupApprove} disableClose={true}>
            <div className="h-full w-full">
            <div className="w-[500px] rounded-2xl bg-indigo-2 p-s3">
                <div className="flex flex-col items-center justify-center">
                <h2 className="mb-s2 text-2xl text-white">Approved!</h2>
                <p className="text-white">
                    Please wait 1-2 business days for payment to process. Thank you.
                </p>
                </div>
            </div>
            </div>
        </Popup>
        <div className="relative w-full h-screen">
            <div className="absolute top-0 right-0 py-s2 px-s5">
                <Timer />
            </div>
        </div>

        <div className="w-full h-screen flex flex-col px-s5 pb-s5 pt-s2">
            <div className="flex flex-col">
                <div className="text-white text-3xl">{job ? job.videoData.caption : ""}</div>
                <div className="text-white text-lg mb-s2">{creatorName ? creatorName : ""}</div>
            </div>
            <div className="flex flex-row">
                <div className="w-1/2 pr-s1">
                    <div className="relative w-full flex-1 overflow-hidden rounded-2xl bg-white-transparent p-s2 pb-[76px]">
                        <div className="text-white text-2xl mb-s2">Original Video - {job ? job.originalLanguage:""}</div>
                        <div
                        className="relative w-full overflow-hidden"
                        style={{ paddingTop: '56.25%' }}
                        >
                            {originalVideoLink &&
                            <video
                                style={{
                                objectFit: 'contain',
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#000',
                                }}
                                controls
                            >
                                <source
                                src={originalVideoLink ? originalVideoLink : ''}
                                type="video/mp4"
                                />
                            </video>
                            }
                        </div>
                    </div>
                </div>

                <div className="w-1/2 pl-s1">
                    <div className="relative w-full flex-1 overflow-hidden rounded-2xl bg-white-transparent p-s2">
                    <div className="text-white text-2xl mb-s2">Translated Video - {job ? job.translatedLanguage:""}</div>
                        <div
                        className="relative w-full overflow-hidden"
                        style={{ paddingTop: '56.25%' }}
                        >
                            {videoLink &&
                            <video
                                style={{
                                objectFit: 'contain',
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#000',
                                }}
                                controls
                            >
                                <source
                                src={videoLink ? videoLink : ''}
                                type="video/mp4"
                                />
                            </video>
                            }
                        </div>
                        <div className="flex flex-row">
                            <Button
                            theme="error"
                            classes="flex flex-col justify-center items-center  mt-s2 mr-s2"
                            onClick={() => handleFlag()}
                            isLoading={loader === 'flagged'}
                            >
                            <div className="flex flex-row items-center">
                                <span className="">Flag</span>
                            </div>
                            </Button>
                            <Button
                            theme="success"
                            classes="flex flex-col justify-center items-center  mt-s2"
                            onClick={() => handleApproval()}
                            isLoading={loader === 'approve'}
                            >
                            <div className="flex flex-row items-center">
                                <Image src={Check} alt="" width={24} height={24} />
                                <span className="ml-s1">Approve</span>
                            </div>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

        </div>


        </>
    )
}

export default pending;