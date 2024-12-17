import { Fragment, useState } from 'react';
import { getDownloadLink } from '../../services/apis';
import CircleLoader from '../../public/loaders/CircleLoader';
import { formatTimestamp } from '../../utils/formatDate';

const AllJobs = ({
  jobs,
  setPopupPreview,
  setPreviewJob,
  setPreviewJobType,
  setPreviewJobVideoLink,
}) => {
  const handlePreview = async (job) => {
    try {
      const videoPath = `dubbing-tasks/${job.creatorId}/${job.jobId}/video.mp4`;
      const downloadLink = await getDownloadLink(videoPath);
      setPreviewJobVideoLink(downloadLink.data);
      setPreviewJob(job);
      setPreviewJobType(job.status);
      setPopupPreview(true);
    } catch (error) {
      throw new Error('Unable to load preview. Please try again.');
    }
  };

  return (
    <div className="rounded-2xl bg-black p-4 text-left text-white">
      {jobs.length > 0 ? (
        jobs.map((job, i) => (
          <Fragment key={i}>
            <div className="grid grid-cols-6 gap-1 p-s3 hover:bg-white-transparent">
              <div className="capitalize">{job.status}</div>
              <div>{formatTimestamp(job.timestamp)}</div>
              <div>{job.videoData?.caption}</div>
              <div>{job.originalLanguage}</div>
              <div>{job.translatedLanguage}</div>
              <PreviewJob job={job} previewHandler={() => handlePreview(job)} />
            </div>
            <div className="h-[1px] w-full bg-white bg-opacity-25"></div>
          </Fragment>
        ))
      ) : (
        <p>No jobs available.</p>
      )}
    </div>
  );
};

const PreviewJob = ({ job, previewHandler }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePreviewClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const jobType =
        job.status === 'moderation'
          ? 'moderation'
          : job.status === 'subtitling'
          ? 'overlay'
          : 'pending';

      await previewHandler(job, jobType);
    } catch (error) {
      setError('Error loading preview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <CircleLoader />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="cursor-pointer underline" onClick={handlePreviewClick}>
      Preview Link
    </div>
  );
};

export default AllJobs;
