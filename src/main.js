import { createApp } from "vue"
import App from "./App.vue"
import vuetify from "./plugins/vuetify"
import { loadFonts } from "./plugins/webfontloader"
import router from "./router"
import axios from "axios"

const $api = axios.create({
  // baseURL: 'http://127.0.0.1:5001/api',
  baseURL: "https://iot.spintermarine.co.th/api",
  headers: {
    "Content-Type": "application/json",
  },
})

let isRefreshToken = false
let failedRequestsQueue = []

$api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add Refresh Token
$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/Member/refresh"
    ) {
      if (isRefreshToken) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject })
        })
          .then(() => {
            originalRequest.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`
            return $api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshToken = true

      try {
        const response = await $api.post("/Member/refresh")
        const newToken = response.data

        localStorage.setItem("accessToken", newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`

        failedRequestsQueue.forEach((pending) => pending.resolve())

        return $api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("member")
        localStorage.removeItem("menuPermission")

        failedRequestsQueue.forEach((pending) => pending.reject(refreshError))
        window.location.href = "/login"
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
        failedRequestsQueue = []
      }
    }
    return Promise.reject(error)
  },
)

// CMMS_Product
// const CMMS_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRmluZ2VycHJpbnQiOiJBREI1MDJDNTdFNDE2NzM0MzM4MDRFQzA3MzE2RkIzODgwOTg4QUMxODg4QkE3NzQ2QjlFRTI4RTJERjI0MDc4IiwiaWF0IjoxNzQ5NDY0MTM4fQ.XF86UIXHUhWuUejNuGhga2C6gTDF-dYcQldBvyhCIJQ';
// const open_api_company = 'cc7633cfe644bcea3b2b4fb9e25b770ab48baacf9bcdb9cddc019b11dcfc474a';

// const $api_cmms = axios.create({
//   baseURL: 'https://openapi.systemstone.com/',
//   headers: {
//     'Content-Type': 'application/json',
//     'Cookie': '__Secure-Fgp=b7a69c8f0b3a646159ffff349e858700d234978ca6883b0c82ee244117fd876ef0370b9b63e51943495f08d950afbd67b285; Path=/; Secure',
//     'Authorization': `Bearer ${CMMS_ACCESS_TOKEN}`,
//   },
//   withCredentials: true
// });

// CMMS_TEST
// const CMMS_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRmluZ2VycHJpbnQiOiI0RkI1NTc1NDM3MEQzNEU0N0ZGRTg5RTVCNkY1RjM1MEI2NjJEQkM1N0U3QzhERTgwOUYyN0M0RkQ1RjYzNUY5IiwiaWF0IjoxNzQ3MzAyMjQxfQ.QZSdwjlA_Syz4uixhCrOm0szyp2UP3plh6UdPkg1CLw';
// const open_api_company = 'f655b52094e9fa4ddeb3fbc770b9dce95d954c8de3a95692fdd59a12ad543513';

// const $api_cmms = axios.create({
//   baseURL: 'https://test-openapi-public.systemstone.com/',
//   headers: {
//     'Content-Type': 'application/json',
//     'Cookie': '__Secure-Fgp=bc9b23842a2a504b9d93dfe359487a81ab5db833847ff62248ad293dbafbf6bb56ac9ec51680f47be04c4ac3083d2fbae5f4; Path=/; Secure; HttpOnly',
//     'Authorization': `Bearer ${CMMS_ACCESS_TOKEN}`,
//   },
//   withCredentials: true
// });

// Vessel
const $api_vessel = axios.create({
  baseURL: "http://dev.spintermarine.co.th:2053/services/api-miiot/auth-miiot",
  headers: {
    "Content-Type": "application/json",
  },
})

let authToken = null
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token)
    } else {
      prom.reject(error)
    }
  })
  failedQueue = []
}

$api_vessel.interceptors.request.use(
  async (config) => {
    if (!authToken && !isRefreshing) {
      await authenticate_Vessel()
    }
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

$api_vessel.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status
    const message = error.response?.data?.message

    if (
      (status === 401 ||
        (status === 503 && message === "Token is invalid or expired")) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return $api_vessel(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      try {
        await authenticate_Vessel()
        processQueue(null, authToken)
        originalRequest.headers.Authorization = `Bearer ${authToken}`
        return $api_vessel(originalRequest)
      } catch (refreshError) {
        console.error("Refresh Vessel token failed:", refreshError)
        processQueue(refreshError)
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

async function authenticate_Vessel() {
  try {
    isRefreshing = true
    const response = await $api_vessel.post("/authenticate", {
      username: "rtm-01",
      password: "1234",
    })
    authToken = response.data.token
  } catch (error) {
    console.error("Authentication from Vessel failed:", error)
    authToken = null
    throw error
  } finally {
    isRefreshing = false
  }
}

authenticate_Vessel().catch((err) => {
  console.error("Initial Vessel authentication failed:", err)
})

// Factorium - Vessel
const $api_fac = axios.create({
  // baseURL: 'http://dev.spintermarine.co.th:2053/services/api-factorium/auth-factorium',
  baseURL:
    "http://dev.spintermarine.co.th:2053/services/api-factorium/auth-factorium",
  headers: {
    "Content-Type": "application/json",
  },
})

let authToken_fac = null
let isRefreshing_fac = false
let failedQueue_fac = []

const processQueue_fac = (error, token = null) => {
  failedQueue_fac.forEach((prom) => {
    if (token) {
      prom.resolve(token)
    } else {
      prom.reject(error)
    }
  })
  failedQueue_fac = []
}

$api_fac.interceptors.request.use(
  async (config) => {
    if (!authToken_fac && !isRefreshing_fac) {
      await authenticate_Fac()
    }
    if (authToken_fac) {
      config.headers.Authorization = `Bearer ${authToken_fac}`
      // console.log('📦 Using token:', authToken_fac);
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

$api_fac.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status
    const message = error.response?.data?.message

    if (
      (status === 401 ||
        (status === 503 && message === "Token is invalid or expired")) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      if (isRefreshing_fac) {
        return new Promise((resolve, reject) => {
          failedQueue_fac.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return $api_fac(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      try {
        await authenticate_Fac()
        processQueue_fac(null, authToken_fac)
        originalRequest.headers.Authorization = `Bearer ${authToken_fac}`
        return $api_fac(originalRequest)
      } catch (refreshError) {
        console.error("Refresh Factorium Vessel token failed:", refreshError)
        processQueue_fac(refreshError)
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

async function authenticate_Fac() {
  try {
    isRefreshing_fac = true
    const response = await $api_fac.post("/authenticate", {
      username: "rtm-01",
      password: "1234",
    })
    // console.log('Factorium Vessel authentication response:', response.data);

    authToken_fac = response.data.token
    localStorage.setItem("factoriumToken", authToken_fac)
  } catch (error) {
    console.error("Authentication from Factorium Vessel failed:", error)
    authToken_fac = null
    throw error
  } finally {
    isRefreshing_fac = false
  }
}

authenticate_Fac().catch((err) => {
  console.error("Initial Factorium (Vessel) authentication failed:", err)
})

loadFonts()

const app = createApp(App)

app
  .use(vuetify)
  .use(router)
  .provide("$api", $api)
  // .provide('$api_cmms', $api_cmms)
  // .provide('open_api_company', open_api_company)
  .provide("$api_vessel", $api_vessel)
  .provide("$api_fac", $api_fac)
  .mount("#app")
