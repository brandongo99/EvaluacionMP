import axios from 'axios';

let startLoading = () => {};
let completeLoading = () => {};

export const setLoadingHandlers = (startFn, completeFn) => {
  startLoading = startFn;
  completeLoading = completeFn;
};

export const applyInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      startLoading();
      return config;
    },
    (error) => {
      completeLoading();
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      completeLoading();
      return response;
    },
    (error) => {
      completeLoading();
      return Promise.reject(error);
    }
  );
};

export default axios;
