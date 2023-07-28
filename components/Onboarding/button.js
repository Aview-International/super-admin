import Border from '../UI/Border';
import Loader from '../../public/loaders/ButtonLoader';
import Shadow from '../UI/Shadow';

const OnboardingButton = ({
  children,
  isLoading,
  onClick,
  disabled,
  theme,
  classes,
}) => {
  return disabled ? (
    <button
      className={`transition-300 w-full cursor-not-allowed rounded-full bg-gray-1 px-s5 pt-s1.5 pb-s1 text-black ${classes}`}
      onClick={() => null}
      disabled
    >
      {children}
    </button>
  ) : theme === 'success' ? (
    <button
      className={`transition-300 w-full cursor-pointer rounded-full bg-green px-s5 pt-s1.5 pb-s1 text-black ${classes}`}
      onClick={isLoading ? () => null : onClick}
    >
      {isLoading ? <Loader /> : children}
    </button>
  ) : theme === 'error' ? (
    <button
      className={`transition-300 w-full cursor-pointer rounded-full bg-red px-s5 pt-s1.5 pb-s1 text-white ${classes}`}
      onClick={isLoading ? () => null : onClick}
    >
      {isLoading ? <Loader /> : children}
    </button>
  ) : (
    <Shadow classes="w-full">
      <Border borderRadius="full" classes="w-full">
        <button
          className={`transition-300 w-full cursor-pointer rounded-full px-s5 pt-s1.5 pb-s1 ${
            theme === 'light' && 'text-black'
          } ${theme === 'dark' && 'bg-black text-white'} ${classes}`}
          onClick={isLoading ? () => null : onClick}
        >
          {isLoading ? <Loader /> : children}
        </button>
      </Border>
    </Shadow>
  );
};

export default OnboardingButton;
