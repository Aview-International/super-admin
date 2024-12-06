import { useEffect, useState } from 'react';
import ErrorHandler from '../../utils/errorHandler';
import { getDownloadLink } from '../../services/apis';
import { TableHeader } from '../../constants/constants';
import { formatTimestamp } from '../../utils/formatDate';

const OverlayJobs = ({
  jobs,
  setPopupPreview,
  setPreviewJob,
  setPreviewJobType,
  setPreviewJobVideoLink,
}) => {
  const handlePreview = async (job) => {
    const videoPath = `dubbing-tasks/${job.creatorId}/${job.jobId}/video.mp4`;
    const downloadLink = await getDownloadLink(videoPath);
    console.log(downloadLink.data);
    setPreviewJobVideoLink(downloadLink.data);
    setPreviewJob(job);
    setPreviewJobType('overlay');
    setPopupPreview(true);
  };

  useEffect(() => {
    console.log(jobs);
  }, [jobs]);

  return (
    <div className="rounded-2xl bg-black p-4 text-white">
      {jobs.length > 0 ? (
        <div className="relative h-auto overflow-y-auto">
          <div className="sticky top-0">
            <div className="absolute inset-0 bg-white bg-opacity-20 backdrop-blur-md" />

            <div className="relative grid grid-cols-6 gap-1 py-2 text-center">
              {TableHeader.map((headerItem, index) => (
                <div className="text-left text-lg font-bold" key={index}>
                  {headerItem}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-s2 mb-s2 h-[1px] w-full bg-white"></div>
          {jobs.map((job) => (
            <div key={job.jobId} className="">
              <div className="py-s2 hover:bg-white-transparent">
                <div className="grid grid-cols-6 gap-1">
                  <div className="text-left">
                    {formatTimestamp(job.timestamp)}
                  </div>
                  <div className="text-left">{job.videoData.caption}</div>
                  <div className="text-left">{job.originalLanguage}</div>
                  <div className="text-left">{job.translatedLanguage}</div>
                  <div
                    className="cursor-pointer underline"
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
        <p>No jobs available.</p>
      )}
    </div>
  );
};

export default OverlayJobs;
