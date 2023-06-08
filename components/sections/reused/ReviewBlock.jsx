import React from 'react'
import OnboardingButton from '../../Onboarding/button';
import DottedBorder from '../../UI/DottedBorder';

const ReviewBlock = ( { textPlaceHolder }) => {
    
  return (
    <div className='relative -top-2'>
       <div className='w-full h-full flex flex-col gap-y-5 justify-between p-5'>
      <p className='font-semibold text-xl'>Click here to upload or download transcription files</p>
      <DottedBorder classes={'w-52 h-36 border-2'} borderRadius={'15px'}>
            download.txt
      </DottedBorder>
      <div className='flex flex-row justify-between w-full gap-5'>
          <div className="grow text-xl font-semibold">
            <OnboardingButton theme="light">Upload</OnboardingButton>
          </div>
          <div className="grow text-xl font-semibold">
            <OnboardingButton theme="dark">Download</OnboardingButton>
          </div>
      </div>
     </div>
    </div>
    
  )
}

export default ReviewBlock
