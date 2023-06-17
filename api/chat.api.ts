import axiosClient from './axios.client'

export const chatCompletion = async ({ prompt }: { prompt: string }) => {
  const response = await axiosClient.post('chats', { prompt })
  return response
}
