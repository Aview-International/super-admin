import { useEffect, useState } from 'react';
import ErrorHandler from '../../utils/errorHandler';
import { 
  getTranslatorFromUserId,
  getAllOverlayJobs,
  acceptJob,
  getDownloadLink } from '../../services/apis';
import Cookies from 'js-cookie';
import { authStatus } from '../../utils/authStatus';

const OverlayJobs = ({setPopupPreview, setPreviewJob, setPreviewJobType, setPreviewJobVideoLink}) => {
  const [jobs, setJobs] = useState([]);
  const [translatorId, setTranslatorId] = useState(null);

  const handleTranslator = async (userId) => {
    const translator = await getTranslatorFromUserId(userId);
    console.log(translator.data._id);
    setTranslatorId(translator.data._id);
  };

  const getOverlayJobs = async () => {
    const res = await getAllOverlayJobs(translatorId);
    const resData = res.data;
    const pending = resData
      ? Object.values(resData).map((item, i) => ({
          ...item,
          jobId: Object.keys(resData)[i],
        }))
      : [];
    setJobs(pending);
  };

  const handleAccept = async (jobId) => {
    try {
      if (translatorId == null) {
        throw new Error('Invalid translatorId.');
      }
      await acceptJob(translatorId, jobId, "overlay");

      window.open(`/overlays?jobId=${jobId}`, '_blank');
    }catch(error){
      ErrorHandler(error);
    }
  };

  const handlePreview = async(job) => {
    const videoPath = `dubbing-tasks/${job.creatorId}/${job.jobId}/video.mp4`
    const downloadLink = await getDownloadLink(videoPath);
    console.log(downloadLink.data);
    setPreviewJobVideoLink(downloadLink.data);
    setPreviewJob(job);
    setPreviewJobType("overlay");
    setPopupPreview(true);
  }

  useEffect(() => {
    const token = Cookies.get("session");
    const userId = authStatus(token).data.user_id;
    console.log(token);
    console.log(userId);

    handleTranslator(userId);

  },[]);

  useEffect(() => {
    if (translatorId) {
      getOverlayJobs();
    }
  }, [translatorId]);

  useEffect(() => {
    console.log(jobs);
  }, [jobs]);

  return (
    <>
    <div className="rounded-2xl bg-white-transparent p-4">
        {jobs.length > 0 ? (
        <div>
            <div
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                gap: '1rem',
                textAlign: 'center',
            }}
            >
            <div className="text-left font-bold text-white text-lg">Job ID</div>
            <div className="text-left font-bold text-white text-lg">Title</div>
            <div className="text-left font-bold text-white text-lg">Original Language</div>
            <div className="text-left font-bold text-white text-lg">Translated Language</div>
            </div>

            <div className="mt-s2 mb-s2 h-[1px] w-full bg-white"></div>
            {jobs.map((job) => (
            <div key={job.jobId} className="">
                <div className="py-s2 hover:bg-white-transparent">
                <div
                    style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                    gap: '1rem',
                    textAlign: 'left',
                    }}
                >
                    <div className="text-left text-white">{job.jobId}</div>
                    <div className="text-left text-white">
                    {job.videoData.caption}
                    </div>
                    <div className="text-left text-white">
                    {job.originalLanguage}
                    </div>
                    <div className="text-left text-white">
                    {job.translatedLanguage}
                    </div>
                    <div
                    className="cursor-pointer text-white underline"
                    onClick={() => {
                      handlePreview(job);
                    }}
                    >
                    Preview job
                    </div>
                </div>
                <div className="h-[1px] w-full bg-white bg-opacity-25"></div>
                </div>
            </div>
            ))}
        </div>
        ) : (
        <p className="text-white">No jobs available.</p>
        )}
    </div>
    </>
  );
};


export default OverlayJobs;
