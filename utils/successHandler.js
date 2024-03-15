import { toast } from 'react-toastify';

const SuccessHandler = (message) => {
    toast.success(message);
    return;
};

export default SuccessHandler;