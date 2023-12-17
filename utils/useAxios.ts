import axios, { AxiosError } from 'axios';
import { useTokenStore } from '~/stores/token';

function isFileOrNull(property: any) {
  return property instanceof File;
}

axios.interceptors.request.use((request) => {
  const config = useRuntimeConfig();
  const tokenStore= useTokenStore();

  request.baseURL= config.public.apiBaseUrl; 
  
  request.headers.Authorization= `Bearer ${tokenStore.getToken() || localStorage.getItem('token')} `;

  request.headers['Content-Type'] = 'application/json';
  for (const key in request.data) {
    // eslint-disable-next-line no-prototype-builtins
    if (request.data.hasOwnProperty(key)) {
      if (isFileOrNull(request.data[key])) {
        request.headers['Content-Type'] = 'multipart/form-data';
      }
    }
  }
  
  // if (request.data instanceof FormData && request.data.has('file')) {
  //   request.headers['Content-Type'] = 'multipart/form-data';
  // } else {
  //   request.headers['Content-Type'] = 'application/json';
  // }

  return request;
}, (error)=> {
  return Promise.reject(error);
});

axios.interceptors.response.use((data)=> {
  return data;
}, (error: AxiosError)=> {
  const errorResponse= error.response;
  // const errorBody= errorResponse?.data?.data as {error: string} || '';

  if (errorResponse?.status == 401) {
    const tokenStore= useTokenStore();

    tokenStore.deleteToken();
  }

  return Promise.reject(error);
});

export default axios;