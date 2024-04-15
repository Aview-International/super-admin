import Border from './Border';
import Loader from '../../public/loaders/ButtonLoader';
import Shadow from './Shadow';

const Button = ({
  children,
  isLoading,
  onClick,
  disabled,
  theme,
  classes,
  type = 'button',
}) => {
  return disabled ? (
    <button
      className={`transition-300 w-full cursor-not-allowed rounded-full bg-gray-1 px-s5 pt-s1.5 pb-s1 text-black ${classes}`}
      onClick={() => null}
      disabled
    >
      {children}
    </button> ? (
      theme
    ) : (
      <button
        className={`transition-300 w-full cursor-pointer rounded-full px-s5 pt-s1.5 pb-s1 ${
          theme === 'success'
            ? 'bg-green text-black'
            : theme === 'error'
            ? 'bg-red text-white'
            : ''
        } ${classes}`}
        onClick={isLoading ? () => null : onClick}
        type={type}
      >
        {isLoading ? <Loader /> : children}
      </button>
    )
  ) : (
    <Shadow classes="w-full">
      <Border borderRadius="full" classes="w-full">
        <button
          className={`transition-300 w-full cursor-pointer rounded-full px-s5 pt-s1.5 pb-s1 
          ${theme === 'light' && 'text-black'} ${
            theme === 'dark' && 'bg-black text-white'
          } ${
            theme === 'gray' &&
            'from-7% bg-gradient-to-t from-gray-4 to-gray-3 text-white'
          } ${classes}`}
          onClick={isLoading ? () => null : onClick}
        >
          {isLoading ? <Loader /> : children}
        </button>
      </Border>
    </Shadow>
  );
};

export default Button;
