import Image from 'next/image';
import { getUserProfile } from '../../pages/api/firebase';
import { useEffect, useState } from 'react';

const AllVideos = ({ job, setSelectedJob, selectedJob }) => {
  const [creatorData, setCreatorData] = useState({
    name: '',
    picture: '',
  });

  const getProfile = async () => {
    const res = await getUserProfile(job.creatorId);
    setCreatorData({
      name: res?.firstName + ' ' + res?.lastName,
      picture: res?.picture,
    });
  };

  useEffect(() => {
    getProfile();
  }, [job.creatorId]);

  return (
    <div
      className={`cursor-pointer p-s2 hover:bg-white-transparent ${
        selectedJob?.jobId === job?.jobId ? 'bg-white-transparent' : ''
      }`}
      onClick={() => setSelectedJob(job)}
    >
      <div>
        {creatorData.picture && (
          <Image
            src={creatorData.picture}
            alt=""
            width={56}
            height={56}
            className="rounded-full"
          />
        )}
        <div>
          <p className="text-xl font-semibold">{job.caption}</p>
          <p className="text-lg">{creatorData.name}</p>
        </div>
      </div>
    </div>
  );
};

export default AllVideos;
