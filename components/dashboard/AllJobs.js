import { useEffect } from 'react';
import ErrorHandler from '../../utils/errorHandler';
import { getAllJobs, acceptJob, getDownloadLink } from '../../services/apis';
import { useDispatch, useSelector } from 'react-redux';
import { setAllJobs } from '../../store/reducers/jobs.reducer';

const AllJobs = ({
  setPopupPreview,
  setPreviewJob,
  setPreviewJobType,
  setPreviewJobVideoLink,
}) => {
  const jobs = useSelector((el) => el.jobs);
  const dispatch = useDispatch();
  const handleTranslator = async () => {
    getJobs();
  };

  const getJobs = async () => {
    const res = await getAllJobs();
    const resData = res.data;
    const pending = resData
      ? Object.values(resData).map((item, i) => ({
          ...item,
          jobId: Object.keys(resData)[i],
        }))
      : [];
    dispatch(setAllJobs(pending));
  };

  const handleAccept = async (jobId, jobType) => {
    let translatorId;
    try {
      if (translatorId == null) {
        throw new Error('Invalid translatorId.');
      }
      await acceptJob(jobId, jobType);

      if (jobType == 'moderation') {
        window.open(`/moderation?jobId=${jobId}`, '_blank');
      } else if (jobType == 'pending') {
        window.open(`/pending?jobId=${jobId}`, '_blank');
      } else if (jobType == 'overlay') {
        window.open(`/overlays?jobId=${jobId}`, '_blank');
      }
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const handlePreview = async (job, jobType) => {
    const videoPath = `dubbing-tasks/${job.creatorId}/${job.jobId}/video.mp4`;
    const downloadLink = await getDownloadLink(videoPath);
    setPreviewJobVideoLink(downloadLink.data);
    setPreviewJob(job);
    setPreviewJobType(jobType);
    setPopupPreview(true);
  };

  useEffect(() => {
    handleTranslator();
  }, []);

  return (
    <>
      <div className="rounded-2xl bg-white-transparent p-4">
        {jobs.length > 0 ? (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
                gap: '1rem',
                textAlign: 'center',
              }}
            >
              <div className="text-left text-lg font-bold text-white">
                Job Type
              </div>
              <div className="text-left text-lg font-bold text-white">
                Job ID
              </div>
              <div className="text-left text-lg font-bold text-white">
                Title
              </div>
              <div className="text-left text-lg font-bold text-white">
                Original Language
              </div>
              <div className="text-left text-lg font-bold text-white">
                Translated Language
              </div>
            </div>

            <div className="mt-s2 mb-s2 h-[1px] w-full bg-white"></div>
            {jobs.map((job) => (
              <div key={job.jobId} className="">
                <div className="py-s2 hover:bg-white-transparent">
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
                      gap: '1rem',
                      textAlign: 'left',
                    }}
                  >
                    <div className="text-left text-white">
                      {job.status == 'moderation'
                        ? 'Moderation'
                        : job.status == 'subtitling'
                        ? 'Overlay'
                        : 'Pending'}
                    </div>
                    <div className="text-left text-white">{job.jobId}</div>
                    <div className="text-left text-white">
                      {job.videoData?.caption}
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
                        handlePreview(
                          job,
                          job.status == 'moderation'
                            ? 'moderation'
                            : job.status == 'subtitling'
                            ? 'overlay'
                            : 'pending'
                        );
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

export default AllJobs;
