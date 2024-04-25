import axios from 'axios';
import { baseUrl } from './baseUrl';
import FormData from 'form-data';
import Cookies from 'js-cookie';

// Create an Axios instance with default config
const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: 'Bearer ' + Cookies.get('token'),
  },
});

export const getSenders = async () => {
  const response = await axiosInstance.get(baseUrl + 'messages/senders');
  return response.data;
};

export const getUserMessages = async (id) => {
  const response = await axiosInstance.get(
    baseUrl + 'messages/convo?userId=' + id
  );
  return response.data;
};

export const getUserProfile = async (id) => {
  const response = await axiosInstance.get(baseUrl + 'auth/user?userId=' + id);
  return response.data;
};

export const getReviewerMessages = async () =>
  (await axiosInstance.get('/admin/get-all-translator-inquiries')).data;

export const markReviewerConcernAsCompleted = async (id) =>
  (await axiosInstance.put(`/admin/resolve-translator-inquiry/${id}`)).data;

export const getAllAdmins = async () =>
  (await axiosInstance.get('/admin/all-reviewers')).data;

export const uploadManualTranscription = async (file, setProgress) => {
  let formData = new FormData();
  formData.append('file', file);
  const response = await axiosInstance({
    method: 'POST',
    url: baseUrl + 'transcription/manual-transcription',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
    onUploadProgress: (progressEvent) =>
      setProgress(
        Math.round((progressEvent.loaded * 100) / progressEvent.total)
      ),
  });
  return response.data;
};

export const manualSeparation = async (file, setProgress) => {
  let formData = new FormData();
  formData.append('file', file);
  const response = await axiosInstance({
    method: 'POST',
    url: baseUrl + 'dubbing/manual/separation',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
    onUploadProgress: (progressEvent) =>
      setProgress(
        Math.round((progressEvent.loaded * 100) / progressEvent.total)
      ),
  });
  return response.data;
};

export const completeSeparation = async (timestamp) =>
  axiosInstance.delete(`dubbing/manual/separation/${timestamp}`);

export const getDownloadLink = async (s3Path) => {
  const response = axiosInstance.post(baseUrl + 'admin/download-object', {
    s3Path,
  });

  return response;
};

export const getFlaggedJobs = async () => {
  const response = axiosInstance.post(baseUrl + 'admin/get-flagged-jobs');

  return response;
}

export const getReviewersWithValidationImages = async() =>{
  const response = axiosInstance.post(baseUrl + 'admin/get-reviewers-with-validation-images');
  return response;
}

export const approveReferralValidationImage = async(translatorId) => {
  const response = axiosInstance.post(baseUrl + 'admin/approve-referral-validation-image', { translatorId });
  return response;

}