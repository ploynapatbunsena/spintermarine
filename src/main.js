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

loadFonts()
createApp(App)
  .use(vuetify)
  .use(router)
  .provide('$api', $api)
  .mount('#app');