import Button from '../UI/Button';
import Image from 'next/image';
import Check from '../../public/img/icons/check-circle-green.svg';
import { downloadS3Object, transcribeSocialLink } from '../../services/apis';
import ErrorHandler from '../../utils/errorHandler';

const YoutubePlayer = ({
  creatorData,
  vidData,
  loader,
  setLoader,
  selectedJob,
}) => {
  console.log(selectedJob, vidData);
  const handleTranscribe = async () => {
    try {
      setLoader('transcribe');
      await transcribeSocialLink(selectedJob);
      setLoader('');
    } catch (error) {
      setLoader('');
      ErrorHandler(error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold">{vidData.caption}</h2>
      <p className="my-s2 text-lg font-medium">
        Language: {selectedJob.language}
      </p>
      <p className="my-s2 text-lg font-medium">{creatorData.name}</p>

      <iframe
        width="100%"
        height="300"
        src={`https://www.youtube.com/embed/${vidData.id}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>

      <div className="my-s3 w-3/5">
        <Button
          theme="success"
          classes="flex items-center"
          onClick={handleTranscribe}
          isLoading={loader === 'transcribe'}
        >
          <Image src={Check} alt="" width={24} height={24} />
          <span className="ml-2">Transcribe</span>
        </Button>
      </div>
    </div>
  );
};

export default YoutubePlayer;
