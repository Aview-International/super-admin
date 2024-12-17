import { toast } from 'react-toastify';

const ErrorHandler = (error, message) => {
  
  if (!error) {
    toast.error(message || 'Oops, something went wrong');
    return;
  }

  if (!error.response?.data) {
    toast.error(error.message);
    return;
  }

  if (typeof error.response.data.message === 'string') {
    toast.error(error.response.data.message);
  } else {
    toast.error(error.response.data.message?.[0] || 'Unknown error');
  }
};

export default ErrorHandler;