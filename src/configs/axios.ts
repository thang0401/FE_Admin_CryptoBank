import axios from 'axios'

// Base URL from environment variable
export const BaseURL = process.env.API_URL || 'http://localhost:3000'

// Regular expression to detect ISO date format
const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/

// Create an Axios instance
export const axiosBase = axios.create({
  baseURL: BaseURL,
  timeout: 10000, // Optional: set a timeout for requests (10 seconds)
  headers: {
    'Content-Type': 'application/json'
  },
  transformResponse: data => JSON.parse(data, (key, value) => (isoDateFormat.test(value) ? new Date(value) : value))
})

// Interceptors for requests
axiosBase.interceptors.request.use(
  async request => {
    console.log('Request:', request) // Thêm dòng này
    request.maxContentLength = Infinity
    request.maxBodyLength = Infinity
    return request
  },
  error => {
    console.error(`Request Error: ${error.message}`)
    return Promise.reject(error)
  }
)

// Interceptors for responses
axiosBase.interceptors.response.use(
  response => {
    return response?.data
  },
  async error => {
    console.error(`Response Error: ${error.message}`)
    return Promise.reject(error)
  }
)

// Function to get the base URL
export const getAxiosUrl = () => {
  return axiosBase.defaults.baseURL
}
