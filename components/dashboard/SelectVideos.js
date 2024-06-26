import { toast } from 'react-toastify';
import OnboardingButton from '../Onboarding/button';
import Insights from './insights/Insights';
import Videos from './Videos';

const SelectVideos = ({
  setIsSelected,
  isLoading,
  setSelectedVideos,
  selectedVideos,
}) => {
  const handleTranslate = () => {
    if (selectedVideos.length < 1) {
      toast.error('Please select a video');
    } else {
      setIsSelected(true);
    }
  };

  return (
    <>
      <Insights />
      <Videos
        isLoading={isLoading}
        selectedVideos={selectedVideos}
        setSelectedVideos={setSelectedVideos}
      />
      <br />
      <div className="ml-auto w-full md:w-[155px]">
        <OnboardingButton onClick={handleTranslate}>Next</OnboardingButton>
      </div>
    </>
  );
};

export default SelectVideos;
