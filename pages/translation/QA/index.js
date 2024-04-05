import { useEffect, useState } from 'react';
import {
  getRawSRT,
  createTranslatorProgress,
  updateTranslatorProgress,
  finishTranslation,
  getTranslatorProgress,
  getTranslatorById,
  getDownloadLink,
  getTranslatorFromUserId,
} from '../../../services/apis';
import QATranslationBubble from '../../../components/translation/QATranslationBubble';
import { useRouter } from 'next/router';
import Button from '/components/UI/Button';
import Check from '/public/img/icons/check-circle-green.svg';
import Image from 'next/image';
import useWindowSize from '../../../hooks/useWindowSize';
import ExpandableText from '../../../components/translation/ExpandableDescription';
import { SupportedLanguages } from '../../../constants/constants';
import FullScreenLoader from '../../../public/loaders/FullScreenLoader';
import ErrorHandler from '../../../utils/errorHandler';
import SuccessHandler from '../../../utils/successHandler';
import Popup from '../../../components/UI/Popup';
import warning from '/public/img/icons/warning.svg';
import PageTitle from '../../../components/SEO/PageTitle';
import {
  attachTranslatorToModerationJob,
  getPendingTranslation,
  getUserProfile,
  verifyTranslator,
  getTranslatorId,
} from '../../../services/firebase';
import { authStatus } from '../../../utils/authStatus';
import Cookies from 'js-cookie';

const QA = () => {
  const [subtitles, setSubtitles] = useState([]);
  const [englishSubtitles, setEnglishSubtitles] = useState([]);
  const [loader, setLoader] = useState('');
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [creatorName, setCreatorName] = useState('');
  const [acceptedJob, setAcceptedJob] = useState(false);
  const [available, setAvailable] = useState(true);
  const [lang, setLang] = useState('');
  const [progress, setProgress] = useState(null);
  const [popupSubmit, setPopupSubmit] = useState(false);
  const [totalWords, setTotalWords] = useState(0);
  const [pay, setPay] = useState(0);
  const [content, setContent] = useState('video');
  const [uploadDate, setUploadDate] = useState(null);
  const [flags, setFlags] = useState([]);
  const [downloadLink, setDownloadLink] = useState(null);
  const [translatorId, setTranslatorId] = useState(null);   

    const router = useRouter();
    const { jobId } = router.query;

  const { width: windowWidth, height: windowHeight } = useWindowSize();

    const callback = (data) => {
        setJob(data);
    };

    const handleTranslator = async (userId) => {
      const translator = await getTranslatorFromUserId(userId);
      console.log(translator.data._id);
      setTranslatorId(translator.data._id);
    };

  const handleVideo = async () => {
    const videoPath = `dubbing-tasks/${job.creatorId}/${jobId}/video.mp4`;
    console.log(videoPath);
    const downloadLink = await getDownloadLink(videoPath);
    setDownloadLink(downloadLink.data);
  };

  useEffect(() => {
    const token = Cookies.get("session");
    const userId = authStatus(token).data.user_id;
    console.log(token);
    console.log(userId);

    handleTranslator(userId);

  },[]);

    useEffect(() => {

        handleVerifyTranslator();

    },[jobId, translatorId]);


  useEffect(() => {
    if (job) {
      setLang(
        SupportedLanguages.find(
          (language) => language.languageName === job.translatedLanguage
        ).translateCode
      );
      getProfile();
      const date = new Date(parseInt(job.timestamp));
      setUploadDate(
        date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
      setFlags(job.flags);
      handleVideo();
      console.log(job);
    }
  }, [job]);

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
    if (progress && progress.translatorId == translatorId) {
      setAcceptedJob(true);

      if (progress.progress) {
        updateSubtitles(progress.progress);
      }

      if (progress.endTimestamp != null) {
        setPopupSubmit(true);
      }
    }
  }, [progress]);

  const handleAccept = async () => {
    try {
      if (available) {
        try {
          let res = await createTranslatorProgress(
            jobId,
            job.creatorId,
            lang,
            translatorId,
            null,
            null,
            null
          );
          setAcceptedJob(true);
          attachTranslatorToModerationJob(translatorId, jobId);
        } catch (error) {
          ErrorHandler(error);
        }
      } else {
        throw new Error(
          'Job has already been taken. Please select an available job.'
        );
      }
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const getTranslator = async (jobId) => {
    try {
      await getTranslatorById(translatorId)
        .then((res) => {
          if (res.data == '') {
            throw new Error('Invalid translatorId.');
          }
        })
        .catch((error) => {
          throw new Error('Invalid translatorId.');
        });
      await getTranslatorProgress(jobId).then((res) => {
        setAvailable(res.data == '');

        if (res.data != '') {
          setProgress(res.data);
        }
      });
      setIsLoading(false);
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const updateSubtitles = (newSubtitles) => {
    const updatedArray = subtitles.map((item, index) => {
      return {
        ...item,
        text: newSubtitles[index],
      };
    });

    setSubtitles(updatedArray);
  };

    const handleResetSRT = async () => {
        try{
            const verify = await verifyTranslator(translatorId, jobId);
            console.log(verify);
            if (!verify){
                throw new Error("Job has expired");
            }
            setLoader('reset');
            await getSrt(job.creatorId, jobId, lang);
            await updateTranslatorProgress(jobId, null)
            .then(() => {
                setLoader('');
                SuccessHandler("Changes discarded.");
            })
            .catch((error) => {
                setLoader('');
                ErrorHandler("Failed to discard changes", error);
            });
        }catch(error) {
            ErrorHandler(error);
        }

    }

    const handleVerifyTranslator = async () => {
        if (jobId && translatorId){
          try{
            const verify = await verifyTranslator(translatorId, jobId);
            console.log(verify);
            if (!verify){
              throw new Error("invalid translatorId or JobId");
            }
            
            getJob(jobId);

            
          }catch(error){
            ErrorHandler(error);
          }
        }
        
    }

  const handleApprove = async () => {
    try {
      const verify = await verifyTranslator(translatorId, jobId);
      console.log(verify);
      if (!verify) {
        throw new Error('Job has expired');
      }
      setLoader('approve');
      await updateTranslatorProgress(jobId, getSrtText());
      await finishTranslation(jobId, job.creatorId, translatorId)
        .then(() => {
          setLoader('');
          setPopupSubmit(true);
        })
        .catch((error) => {
          ErrorHandler(error, 'Failed to approve.');
          setLoader('');
        });
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const handleSave = async () => {
    try {
      const verify = await verifyTranslator(translatorId, jobId);
      console.log(verify);
      if (!verify) {
        throw new Error('Job has expired');
      }
      setLoader('save');
      updateTranslatorProgress(jobId, getSrtText())
        .then(() => {
          setLoader('');
          SuccessHandler('Progress saved.');
        })
        .catch((error) => {
          setLoader('');
          ErrorHandler('Failed to save progress.', error);
        });
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const getProfile = async () => {
    const res = await getUserProfile(job.creatorId);
    setCreatorName(res?.firstName + ' ' + res?.lastName);
  };

  const getJob = async (jobId) => {
    await getPendingTranslation(jobId, callback);
  };

  const getSrt = async (creatorId, jobId, key) => {
    const data = await getRawSRT(
      `dubbing-tasks/${creatorId}/${jobId}/${key}.srt`
    );
    let processedSubtitles = [];
    let numWords = 0;
    let estimatedPay = 0;

    const lines = data.split('\n');

    for (let i = 0; i < lines.length; i += 4) {
      let subtitleBlock = {
        index: lines[i],
        time: lines[i + 1],
        text: lines[i + 2],
      };
      processedSubtitles.push(subtitleBlock);
    }

    for (let i = 0; i < processedSubtitles.length; i++) {
      numWords += countWords(processedSubtitles[i].text);
    }

    estimatedPay = (
      processedSubtitles.length * 0.02 +
      (processedSubtitles.length / 4) * 0.07
    ).toFixed(2);

    setSubtitles(processedSubtitles);
    setTotalWords(numWords);
    setPay(estimatedPay);
  };

  const getEnglishSrt = async (creatorId, jobId) => {
    const data = await getRawSRT(
      `dubbing-tasks/${creatorId}/${jobId}/original.srt`
    );
    let processedSubtitles = [];

    const lines = data.split('\n');

    for (let i = 0; i < lines.length; i += 4) {
      let subtitleBlock = {
        index: lines[i],
        time: lines[i + 1],
        text: lines[i + 2],
      };
      processedSubtitles.push(subtitleBlock);
    }

    setEnglishSubtitles(processedSubtitles);
  };

  const getSrtText = () => {
    let srtContent = [];

    subtitles.forEach((subtitle) => {
      srtContent.push(subtitle.text);
    });
    return srtContent;
  };

  function countWords(str) {
    if (str) {
      const words = str.split(' ').filter((word) => word.length > 0);

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

  const GridItem = ({ label, value, style = '' }) => {
    return (
      <div className={`w-[208px] ${style}`}>
        <h2 className="mb-[8px] text-xs text-gray-2">{label}</h2>
        <h2 className="text-lg text-white">{value}</h2>
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
        <div className="h-full w-full">
          <div className="w-[500px] rounded-2xl bg-indigo-2 p-s3">
            <div className="flex flex-col items-center justify-center">
              <h2 className="mb-s2 text-2xl text-white">Submitted!</h2>
              <p className="text-white">
                Please wait 1-2 business days for payment to process. Thank you.
              </p>
            </div>
          </div>
        </div>
      </Popup>
      {isLoading && <FullScreenLoader />}
      {acceptedJob ? (
        <div className={`flex `}>
          <div
            className={`fixed left-0 top-0 flex h-screen w-1/2 flex-col py-s5 pl-s5 pr-s1`}
          >
            <h2 className="mb-s2 text-2xl text-white">Transcription</h2>
            <div className="mb-s2 flex h-[43px] flex-row items-center">
              <div className="h-[43px] w-fit rounded-lg bg-white px-s2 py-[9px] text-xl text-indigo-2">
                {job ? job.translatedLanguage : ''}
              </div>
              {job && flags.length > 0 && (
                <div className="ml-auto">
                  <div className="flex flex-row items-center">
                    <Image src={warning}></Image>
                    <span className="ml-[6px] mt-[4px] text-lg text-white">
                      May be potentially offensive
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="relative h-full w-full flex-1 overflow-hidden rounded-2xl bg-white-transparent p-s2">
              <div className="h-full w-full overflow-y-auto rounded-2xl">
                <div className="p-s2">
                  {subtitles.map(
                    (subtitle) =>
                      subtitle.index && (
                        <QATranslationBubble
                          key={subtitle.index}
                          index={subtitle.index}
                          time={subtitle.time}
                          text={subtitle.text}
                          width={windowWidth}
                          height={windowHeight}
                          updateText={(newText) =>
                            updateSubtitleText(subtitle.index, newText)
                          }
                          offensive={flags.includes(parseInt(subtitle.index))}
                        />
                      )
                  )}
                </div>
              </div>
            </div>
          </div>

          {content == 'video' && (
            <div
              className={`fixed right-0 top-0 flex h-screen w-1/2 flex-col py-s5 pr-s5 pl-s1`}
            >
              <h2 className="mb-s2 text-2xl text-white">Content</h2>
              <div className="flex flex-row gap-s2">
                <div
                  className={`px-s2 py-[9px] ${
                    content == 'video'
                      ? 'bg-white text-indigo-2'
                      : 'bg-white-transparent text-white'
                  } mb-s2 h-[43px] w-fit cursor-pointer rounded-lg text-xl`}
                  onClick={() => setContent('video')}
                >
                  Video
                </div>
                <div
                  className={`px-s2 py-[9px] ${
                    content == 'original subtitles'
                      ? 'bg-white text-indigo-2'
                      : 'bg-white-transparent text-white'
                  } mb-s2 h-[43px] w-fit cursor-pointer rounded-lg text-xl`}
                  onClick={() => setContent('original subtitles')}
                >
                  {job ? job.originalLanguage : ''} subtitles
                </div>
              </div>

              <div className="relative h-full w-full flex-1 rounded-2xl bg-white-transparent p-s2">
                <h2 className="mb-2 text-xl text-white">
                  {job ? job.videoData.caption : ''}
                </h2>
                <h2 className="mb-4 text-base text-white">
                  {creatorName ? creatorName : ''}
                </h2>
                {downloadLink && (
                  <div
                    className="relative mb-s5 w-full overflow-hidden"
                    style={{ paddingTop: '56.25%' }}
                  >
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
                        src={downloadLink ? downloadLink : ''}
                        type="video/mp4"
                      />
                    </video>
                  </div>
                )}
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

                <div className="absolute bottom-[23px] flex h-[45px] w-1/3 flex-grow">
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
          )}

          {content == 'original subtitles' && (
            <div
              className={`fixed right-0 top-0 flex h-screen w-1/2 flex-col py-s5 pr-s5 pl-s1`}
            >
              <h2 className="mb-s2 text-2xl text-white">Content</h2>
              <div className="flex flex-row gap-s2">
                <div
                  className={`px-s2 py-[9px] ${
                    content == 'video'
                      ? 'bg-white text-indigo-2'
                      : 'bg-white-transparent text-white'
                  } mb-s2 h-[43px] w-fit cursor-pointer rounded-lg text-xl`}
                  onClick={() => setContent('video')}
                >
                  Video
                </div>
                <div
                  className={`px-s2 py-[9px] ${
                    content == 'original subtitles'
                      ? 'bg-white text-indigo-2'
                      : 'bg-white-transparent text-white'
                  } mb-s2 h-[43px] w-fit cursor-pointer rounded-lg text-xl`}
                  onClick={() => setContent('original subtitles')}
                >
                  {job ? job.originalLanguage : ''} subtitles
                </div>
              </div>
              <div className="relative h-full w-full flex-1 overflow-hidden rounded-2xl bg-white-transparent p-s2">
                <div className="h-full w-full overflow-y-auto rounded-2xl">
                  <div className="p-s2">
                    {englishSubtitles.map(
                      (subtitle) =>
                        subtitle.index && (
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
                        )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-screen w-screen items-center justify-center py-[40px]">
          <div className="flex h-full w-[1360px] justify-center overflow-y-auto overflow-x-hidden rounded-lg bg-white-transparent">
            <div>
              <div className="flex w-[656px] flex-col justify-center">
                <div className="my-[40px] flex-1">
                  <div
                    className="relative mb-s5 overflow-hidden"
                    style={{ paddingTop: '56.25%' }}
                  >
                    {downloadLink && (
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
                          src={downloadLink ? downloadLink : ''}
                          type="video/mp4"
                        />
                      </video>
                    )}
                  </div>

                  <div className="mb-[36px] grid grid-cols-3 grid-rows-2 justify-center gap-y-[40px] gap-x-[16px]">
                    <GridItem
                      label="CREATED BY"
                      value={creatorName ? creatorName : ''}
                    ></GridItem>
                    <GridItem
                      label="ORIGINAL LANGUAGE"
                      value={job ? job.originalLanguage : ''}
                    ></GridItem>
                    <GridItem
                      label="TRANSLATED LANGUAGE"
                      value={job ? job.translatedLanguage : ''}
                    ></GridItem>
                    <GridItem label="WORD COUNT" value={totalWords}></GridItem>
                    <GridItem
                      label="ESTIMATED PAY"
                      value={`$${pay}`}
                    ></GridItem>
                    <GridItem
                      label="DATE POSTED"
                      value={uploadDate ? uploadDate : ''}
                    ></GridItem>
                  </div>
                  {job && job.videoData.description != '' && (
                    <ExpandableText text="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
                  )}

                  <div className="h-[40px] w-[138px]">
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
      )}
    </div>
  );
};

export default QA;
