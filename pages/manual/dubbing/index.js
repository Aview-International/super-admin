import Image from 'next/image';
import DottedBorder from '../../../components/UI/DottedBorder';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import UploadIcon from '../../../public/img/icons/upload-icon1.svg';
import Border from '../../../components/UI/Border';
import { useState } from 'react';
import PageTitle from '../../../components/SEO/PageTitle';
import FormInput from '../../../components/FormComponents/FormInput';
import { uploadManualSrtDubbing } from '../../../services/apis';

const ManualDubbing = () => {
  const [file, setFile] = useState(null);
  const [voiceId, setVoiceId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async () => {
    try {
      setIsLoading(true);
      const res = await uploadManualSrtDubbing(file, voiceId);
      setIsLoading(false);
      window.open(res, '_blank');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <PageTitle title="Manual Translation" />

      <div className="w-11/12 text-white">
        <DottedBorder classes="relative block md:inline-block w-full">
          {file && (
            <button
              onClick={() => setFile(null)}
              className={`gradient-2 absolute top-4 right-4 z-50 mx-auto block w-[80px] cursor-pointer rounded-full pt-1 pb-1 text-center text-sm`}
            >
              Remove
            </button>
          )}
          <input
            type="file"
            className="hidden"
            accept=".srt"
            onChange={(e) => setFile(e.target.files[0])}
            id="srt_upload"
          />

          <div className="flex flex-col items-center py-s3">
            <div className="flex h-[80px] w-[80px] place-content-center rounded-full bg-gray-1">
              <Image src={UploadIcon} alt="Upload" width={40} height={40} />
            </div>

            {!file && (
              <label className="mt-s5 cursor-pointer" htmlFor="srt_upload">
                <Border borderRadius="full">
                  <span
                    className={`transition-300 mx-auto block rounded-full bg-black px-s3 pt-s1.5 pb-s1 text-center text-white`}
                  >
                    Upload Srt File for dubbing
                  </span>
                </Border>
              </label>
            )}
            {file && <p className="my-s5">{file.name}</p>}
          </div>
        </DottedBorder>
        <br />
        <br />
        <FormInput
          label="Input Voice Id"
          onChange={(e) => setVoiceId(e.target.value)}
          placeholder="Input voice id"
        />
        {file && voiceId && (
          <button
            onClick={handleUpload}
            className={`gradient-2 z-50 mx-auto block w-[140px] cursor-pointer rounded-full pt-s1.5 pb-s1 text-center`}
          >
            Proceed
          </button>
        )}
        <p className="cursor-not-allowed py-s2 text-center text-lg underline opacity-30">
          {isLoading ? 'Processing, please wait' : ''}
        </p>
      </div>
    </>
  );
};

ManualDubbing.getLayout = DashboardLayout;

export default ManualDubbing;
