import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './router'
import axios from 'axios'

const $api = axios.create({
  baseURL: 'http://127.0.0.1:5001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

$api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('No access token found in localStorage');
      router.push('/login');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

$api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Token expired or invalid, redirecting to login');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('member');
      localStorage.removeItem('menuPermission');
      router.push('/login');
    }
    
    return Promise.reject(error);
  }
);

$api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized access - token might be expired');
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

// CMMS
const $api_cmms = axios.create({
  baseURL: 'https://test-openapi-public.systemstone.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

const open_api_company = 'f655b52094e9fa4ddeb3fbc770b9dce95d954c8de3a95692fdd59a12ad543513'

// Vessel
const $api_vessel = axios.create({
  baseURL: 'http://dev.spintermarine.co.th:2053/services/api-miiot/auth-miiot',
  headers: {
    'Content-Type': 'application/json'
  }
});

let authToken = null;
let isRefreshing = false;

$api_vessel.interceptors.request.use(async (config) => {
  if(!authToken && !isRefreshing) {
    await authenticate_Vessel()
  }
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`
  }
  return config;
});


$api_vessel.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await authenticate_Vessel();
        originalRequest.headers.Authorization = `Bearer ${authToken}`;
        return $api_vessel(originalRequest);
      } catch (refreshError) {
        console.error('Refresh Vessel token failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

async function authenticate_Vessel() {
  try {
    isRefreshing = true;
    const response = await $api_vessel.post('/authenticate', 
      {
        username: "rtm-01",
        password: "1234"
      }
    )
    authToken = response.data.token
  } catch (error) {
    console.error('Authentication from Veseel failed:', error);
    authToken = null;
    throw error
  } finally {
    isRefreshing = false;
  }
};

loadFonts()
createApp(App)
  .use(vuetify)
  .use(router)
  .provide('$api', $api)
  .provide('$api_cmms', $api_cmms)
  .provide('open_api_company', open_api_company)
  .provide('$api_vessel', $api_vessel)
  .mount('#app');