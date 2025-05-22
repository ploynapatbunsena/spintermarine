import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './router'
import axios from 'axios'

const $api = axios.create({
  baseURL: 'http://127.0.0.1:5001/api',
  // baseURL: 'https://iot.spintermarine.co.th/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

$api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
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

const CMMS_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRmluZ2VycHJpbnQiOiI0RkI1NTc1NDM3MEQzNEU0N0ZGRTg5RTVCNkY1RjM1MEI2NjJEQkM1N0U3QzhERTgwOUYyN0M0RkQ1RjYzNUY5IiwiaWF0IjoxNzQ3MzAyMjQxfQ.QZSdwjlA_Syz4uixhCrOm0szyp2UP3plh6UdPkg1CLw';
const open_api_company = 'f655b52094e9fa4ddeb3fbc770b9dce95d954c8de3a95692fdd59a12ad543513';

// CMMS
const $api_cmms = axios.create({
  baseURL: 'https://test-openapi-public.systemstone.com/',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': '__Secure-Fgp=bc9b23842a2a504b9d93dfe359487a81ab5db833847ff62248ad293dbafbf6bb56ac9ec51680f47be04c4ac3083d2fbae5f4; Path=/; Secure; HttpOnly',
    'Authorization': `Bearer ${CMMS_ACCESS_TOKEN}`,
    'Access-Control-Allow-Origin': '*'
  },
  withCredentials: true
});

const $api_vessel = axios.create({
  baseURL: 'http://dev.spintermarine.co.th:2053/services/api-miiot/auth-miiot',
  headers: {
    'Content-Type': 'application/json'
  }
});

let authToken = null;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

$api_vessel.interceptors.request.use(async (config) => {
  if (!authToken && !isRefreshing) {
    await authenticate_Vessel();
  }
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

$api_vessel.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if ((status === 401 || (status === 503 && message === 'Token is invalid or expired')) && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return $api_vessel(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      try {
        await authenticate_Vessel();
        processQueue(null, authToken);
        originalRequest.headers.Authorization = `Bearer ${authToken}`;
        return $api_vessel(originalRequest);
      } catch (refreshError) {
        console.error('Refresh Vessel token failed:', refreshError);
        processQueue(refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

async function authenticate_Vessel() {
  try {
    isRefreshing = true;
    const response = await $api_vessel.post('/authenticate', {
      username: 'rtm-01',
      password: '1234'
    });
    authToken = response.data.token;
  } catch (error) {
    console.error('Authentication from Vessel failed:', error);
    authToken = null;
    throw error;
  } finally {
    isRefreshing = false;
  }
}

authenticate_Vessel().catch(err => {
  console.error('Initial Vessel authentication failed:', err);
});

loadFonts()
createApp(App)
  .use(vuetify)
  .use(router)
  .provide('$api', $api)
  .provide('$api_cmms', $api_cmms)
  .provide('open_api_company', open_api_company)
  .provide('$api_vessel', $api_vessel)
  .mount('#app');