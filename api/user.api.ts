import axiosClient from './axios.client'

export const userRegister = async ({ username, password }: { username: string; password: string }) => {
  const response = await axiosClient.post('users/register', { username, password })
  return response
}

export const userLogin = async ({ username, password }: { username: string; password: string }) => {
  const response = await axiosClient.post('users/login', { username, password })
  return response
}

export const userCheckTkn = async () => {
  const response = await axiosClient.get('users/check-token')
  return response
}
