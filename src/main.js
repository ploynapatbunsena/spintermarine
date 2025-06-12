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
      // router.push('/login');

      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// CMMS
const CMMS_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRmluZ2VycHJpbnQiOiJBREI1MDJDNTdFNDE2NzM0MzM4MDRFQzA3MzE2RkIzODgwOTg4QUMxODg4QkE3NzQ2QjlFRTI4RTJERjI0MDc4IiwiaWF0IjoxNzQ5NDY0MTM4fQ.XF86UIXHUhWuUejNuGhga2C6gTDF-dYcQldBvyhCIJQ';
const open_api_company = 'cc7633cfe644bcea3b2b4fb9e25b770ab48baacf9bcdb9cddc019b11dcfc474a';

const $api_cmms = axios.create({
  baseURL: 'https://openapi.systemstone.com/',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': '__Secure-Fgp=b7a69c8f0b3a646159ffff349e858700d234978ca6883b0c82ee244117fd876ef0370b9b63e51943495f08d950afbd67b285; Path=/; Secure',
    'Authorization': `Bearer ${CMMS_ACCESS_TOKEN}`, 
  },
  withCredentials: true
});

// Vessel
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

const app = createApp(App)

app
  .use(vuetify)
  .use(router)
  .provide('$api', $api)
  .provide('$api_cmms', $api_cmms)
  .provide('open_api_company', open_api_company)
  .provide('$api_vessel', $api_vessel)
  .mount('#app')