import { useEffect, useState } from 'react';
import PageTitle from '../../components/SEO/PageTitle';
import { useRouter } from 'next/router';
import ErrorHandler from '../../utils/errorHandler';
import Popup from '../../components/UI/PopupWithBorder';
import {
  approveVideoReview,
  getJobAndVerify,
  flagJob,
} from '../../services/apis';
import Check from '../../public/img/icons/check-circle-green.svg';
import Button from '../../components/UI/Button';
import Image from 'next/image';
// import Timer from '../../components/UI/Timer';
import Textarea from '../../components/FormComponents/Textarea';
import FullScreenLoader from '../../public/loaders/FullScreenLoader';

const Pending = () => {
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videoLinks, setVideoLinks] = useState({
    original: null,
    serviced: null,
  });
  const [creatorName, setCreatorName] = useState(null);
  const [loader, setLoader] = useState(null);
  const [popupApprove, setPopupApprove] = useState(false);
  const [popupFlag, setPopupFlag] = useState(false);
  const [flagReason, setFlagReason] = useState(null);
  const [submitHeader, setSubmitHeader] = useState('Approved!');

  const { jobId } = router.query;

  const handleApproval = async () => {
    try {
      setLoader('approve');
      await approveVideoReview(jobId);
      setLoader('');
      setSubmitHeader('Approved!');
      setPopupApprove(true);
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const handleFlag = async () => {
    try {
      setLoader('flag');
      if (!flagReason) {
        throw new Error(`Invalid flag reason`);
      }
      await flagJob(jobId, flagReason, 'pending');
      setLoader('');
      setPopupFlag(false);
      setSubmitHeader('Flagged!');
      setPopupApprove(true);
    } catch (error) {
      ErrorHandler(error);
      setLoader('');
    }
  };

  const getJob = async (jobId) => {
    try {
      const { jobData, original, serviced, creatorName } =
        await getJobAndVerify('review', jobId);

      setJob(jobData);
      setVideoLinks({ original, serviced });
      setCreatorName(creatorName);
      setIsLoading(false);
    } catch (error) {
      ErrorHandler(error);
    }
  };

  useEffect(() => {
    if (jobId) {
      getJob(jobId);
    }
  }, [jobId]);

  return (
    <>
      <PageTitle title="Pending" />
      {isLoading && <FullScreenLoader />}
      <Popup show={popupApprove} disableClose={true}>
        <div className="w-[500px] rounded-2xl bg-indigo-2 p-s3 text-center">
          <h2 className="mb-s2 text-2xl">{submitHeader}</h2>
          <p className="text-lg">
            Please wait 1-2 business days for payment to process. Thank you.
          </p>
        </div>
      </Popup>
      <Popup show={popupFlag} onClose={() => setPopupFlag(false)}>
        <div className="w-[600px] rounded-2xl bg-indigo-2 p-s2">
          <h2 className="mb-s4 text-2xl text-white">Flag job?</h2>
          <h2 className="w-full text-lg text-white">Flag reason</h2>
          <Textarea
            placeholder="Write a short description of the problem"
            textAreaClasses="text-lg text-white font-light"
            onChange={(e) => setFlagReason(e.target.value)}
          />
          <div className="ml-auto w-40">
            <Button
              theme="error"
              onClick={handleFlag}
              isLoading={loader === 'flag'}
            >
              Submit
            </Button>
          </div>
        </div>
      </Popup>
      {/* <div className="fixed right-0 top-0 px-s2 py-s2">
        <Timer
          jobId={jobId}
          jobType={'pending'}
          setIsLoading={setIsLoading}
          jobTimestamp={job ? job.pendingStatus : null}
        />
      </div> */}
      <div className="flex w-full flex-col items-center justify-center px-s8 py-s7 font-bold text-white">
        <div className="text-2xl">
          <p>Video Title: {job?.videoData?.caption}</p>
          <p className="my-s3">Creator Name: {creatorName}</p>
        </div>
        <div className="flex w-full gap-s4">
          {/*  */}
          <div className="flex-1 rounded-2xl bg-white-transparent p-s2">
            <div className="my-s2 flex items-center justify-between">
              <p className="text-3xl">Original Video</p>
              <span className="rounded-full bg-white-transparent p-s1">
                {job ? job.originalLanguage : ''}
              </span>
            </div>
            {videoLinks['original'] && (
              <div>
                <video
                  className="h-full w-full bg-black object-contain max-h-96"
                  controls
                >
                  <source src={videoLinks['original']} type="video/mp4" />
                </video>
              </div>
            )}
          </div>

          <div className="flex-1 rounded-2xl bg-white-transparent p-s2">
            <div className="my-s2 flex items-center justify-between">
              <p className="text-3xl">Translated Video</p>
              <span className="rounded-full bg-white-transparent p-s1">
                {job ? job.translatedLanguage : ''}
              </span>
            </div>
            {videoLinks['serviced'] && (
              <div>
                <video
                  className="h-full w-full bg-black object-contain max-h-96"
                  controls
                >
                  <source src={videoLinks['serviced']} type="video/mp4" />
                </video>
              </div>
            )}
            <div className="mt-s2 flex flex-row gap-s3">
              <Button
                theme="error"
                onClick={() => {
                  setPopupFlag(true);
                }}
                isLoading={loader === 'flagged'}
              >
                Flag
              </Button>
              <Button
                theme="success"
                classes="flex items-center justify-center"
                onClick={handleApproval}
                isLoading={loader === 'approve'}
              >
                <Image src={Check} alt="" width={24} height={24} />
                <span className="ml-s1">Approve</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pending;
