import Button from '../UI/Button';
import Image from 'next/image';
import Check from '../../public/img/icons/check-circle-green.svg';
import { downloadS3Object } from '../../services/apis';
import ErrorHandler from '../../utils/errorHandler';

const YoutubePlayer = ({ creatorData, vidData, loader, setLoader }) => {
  const handleDownload = async (date, key) => {
    try {
      setLoader('download');
      const { data } = await downloadS3Object(
        date,
        key,
        selectedJob.creatorId,
        'srt'
      );
      setLoader('');
      window.open(data, '_blank');
    } catch (error) {
      setLoader('');
      ErrorHandler(error);
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-semibold">{vidData.caption}</h2>
      <p className="my-s2 text-lg font-medium">{creatorData.name}</p>

      <iframe
        width="100%"
        height="300"
        src={`https://www.youtube.com/embed/${vidData.id}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>

      <div className="my-s3 grid grid-cols-3 gap-s2">
        <Button
          theme="light"
          onClick={() => handleDownload(vidData.date, vidData.objectS3Key)}
          isLoading={loader === 'download'}
        >
          Download
        </Button>
        <Button theme="dark">Upload</Button>
        <Button
          theme="success"
          classes="flex items-center"
          onClick={() => handleApproval(vidData.objectS3Key)}
          isLoading={loader === 'approve'}
        >
          <Image src={Check} alt="" width={24} height={24} />
          <span className="ml-2">Approve</span>
        </Button>
      </div>
    </div>
  );
};

export default YoutubePlayer;
