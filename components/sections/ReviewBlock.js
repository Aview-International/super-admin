import React from 'react';
import OnboardingButton from '../../Onboarding/button';
import DottedBorder from '../../UI/DottedBorder';

const ReviewBlock = ({ textPlaceHolder }) => {
  return (
    <div className="relative -top-2">
      <div className="flex h-full w-full flex-col justify-between gap-y-5 p-5">
        <p className="text-xl font-semibold">
          Click here to upload or download transcription files
        </p>
        <DottedBorder classes={'w-52 h-36 border-2'} borderRadius={'15px'}>
          download.txt
        </DottedBorder>
        <div className="flex w-full flex-row justify-between gap-5">
          <div className="grow text-xl font-semibold">
            <OnboardingButton theme="light">Upload</OnboardingButton>
          </div>
          <div className="grow text-xl font-semibold">
            <OnboardingButton theme="dark">Download</OnboardingButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewBlock;
