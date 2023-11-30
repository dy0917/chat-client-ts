const a = import.meta.env.VITE_API_URL;
console.log('VITE_API_URL',a);
const apiUrl = `https://${a}` || 'http://localhost:5000/';


import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Define a custom Axios instance
const getAxios = (token?: string) => {
  const apiInstance: AxiosInstance = axios.create({
    baseURL: apiUrl, // Set your base URL
    timeout: 60000, // Set a timeout for requests (in milliseconds)
    headers: {
      'Content-Type': 'application/json',

    },
  });

  apiInstance.interceptors.request.use(
    (config) => {
      // Do something before request is sent
      const tToken = token || localStorage.getItem('token');
      if (tToken) config.headers['Authorization'] = 'Bearer ' + tToken;
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  apiInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      // You can modify the response data here
      return response;
    },
    (error) => {
      // Handle response errors
      return Promise.reject(error);
    }
  );
  return apiInstance;
};

export default getAxios;
