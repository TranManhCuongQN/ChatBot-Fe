import axios from 'axios'
import queryString from 'query-string'

const baseURL = 'https://chatbot-be.vercel.app/api/v1/'
const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  paramsSerializer: {
    encode: (params) => queryString.stringify(params)
  }
})

axiosClient.interceptors.request.use(
  (config) => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    return config
  },
  (error) => Promise.reject(error)
)

axiosClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    throw error.response.data
  }
)

export default axiosClient
