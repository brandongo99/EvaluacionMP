import axios from 'axios';

let startLoading = () => {};
let completeLoading = () => {};

// Función para establecer los manejadores de carga
export const setLoadingHandlers = (startFn, completeFn) => {
  startLoading = startFn;
  completeLoading = completeFn;
};

// Función para aplicar los interceptores a una instancia de axios
export const applyInterceptors = (axiosInstance) => {
  // Interceptor de solicitud
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

  // Interceptor de respuesta
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
