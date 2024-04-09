import { useEffect, useState } from 'react';
import {
  getRawSRT,
  finishTranslation,
  getDownloadLink,
  getTranslatorFromUserId,
  getJobAndVerify,
} from '../../services/apis';
import QATranslationBubble from '../../components/translation/QATranslationBubble';
import { useRouter } from 'next/router';
import Button from '/components/UI/Button';
import Check from '/public/img/icons/check-circle-green.svg';
import Image from 'next/image';
import useWindowSize from '../../hooks/useWindowSize';
import { SupportedLanguages } from '../../constants/constants';
import FullScreenLoader from '../../public/loaders/FullScreenLoader';
import ErrorHandler from '../../utils/errorHandler';
import SuccessHandler from '../../utils/successHandler';
import Popup from '../../components/UI/PopupWithBorder';
import warning from '/public/img/icons/warning.svg';
import PageTitle from '../../components/SEO/PageTitle';
import {
  getUserProfile,
  verifyTranslator,
} from '../../services/firebase';
import { authStatus } from '../../utils/authStatus';
import Cookies from 'js-cookie';

const QA = () => {
  const [subtitles, setSubtitles] = useState([]);
  const [englishSubtitles, setEnglishSubtitles] = useState([]);
  const [loader, setLoader] = useState('');
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [creatorName, setCreatorName] = useState('');
  const [lang, setLang] = useState('');
  const [popupSubmit, setPopupSubmit] = useState(false);
  const [content, setContent] = useState('video');
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

  const handleResetSRT = async () => {
    try{
        const verify = await verifyTranslator(translatorId, jobId);
        console.log(verify);
        if (!verify){
            throw new Error("Job has expired");
        }
        setLoader('reset');
        await getSrt(job.creatorId, jobId, lang)
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

  const handleApprove = async () => {
    try {
      const verify = await verifyTranslator(translatorId, jobId);
      console.log(verify);
      if (!verify) {
        throw new Error('Job has expired');
      }
      setLoader('approve');
      console.log(jobId, translatorId, getSrtText());
      await finishTranslation(jobId, translatorId, getSrtText())
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

  const getProfile = async () => {
    const res = await getUserProfile(job.creatorId);
    setCreatorName(res?.firstName + ' ' + res?.lastName);
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

  const getSrt = async (creatorId, jobId, key) => {
    const data = await getRawSRT(
      `dubbing-tasks/${creatorId}/${jobId}/${key}.srt`
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

    setSubtitles(processedSubtitles);
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

  const updateSubtitleText = (index, newText) => {
    const updatedSubtitles = subtitles.map((subtitle) => {
      if (subtitle.index === index) {
        return { ...subtitle, text: newText };
      }
      return subtitle;
    });

    setSubtitles(updatedSubtitles);
  };

  useEffect(() => {
    const token = Cookies.get("session");
    const userId = authStatus(token).data.user_id;
    console.log(token);
    console.log(userId);

    handleTranslator(userId);

  },[]);

  useEffect(() => {
    if(jobId && translatorId) {
      getJob(jobId, translatorId);
    }
  },[jobId, translatorId]);


  useEffect(() => {
    if (job) {
      setLang(
        SupportedLanguages.find(
          (language) => language.languageName === job.translatedLanguage
        ).translateCode
      );
      getProfile();
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
      }
    };
    fetchData();
  }, [lang]);

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
                  onClick={() => handleResetSRT()}
                  isLoading={loader === 'reset'}
                >
                  <span>Reset</span>
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
    </div>
  );
};

export default QA;
