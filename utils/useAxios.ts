import axios, { AxiosError } from 'axios';
import { useTokenStore } from '~/stores/token';

axios.interceptors.request.use((request)=> {
  const config = useRuntimeConfig();
  const tokenStore= useTokenStore();

  request.baseURL= config.public.apiBaseUrl; 
  request.headers.Authorization= `Bearer ${tokenStore.getToken()} `;

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