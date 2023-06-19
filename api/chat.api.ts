import axios from 'axios'
import axiosClient from './axios.client'

export const chatCompletion = async ({ prompt }: { prompt: string }) => {
  const response = await axiosClient.post('chats', { prompt })
  return response
}

export const chatCreateImage = async ({ prompt }: { prompt: string }) => {
  const response = await axiosClient.post('chats/image', { prompt })
  return response
}

export const chatCreateTranscription = async ({ prompt }: { prompt: File }) => {
  // const formData = new FormData()
  // formData.append('file', prompt)
  const formData = new FormData()
  formData.append('file', prompt)
  formData.append('model', 'whisper-1')
  const response = await axios.post('https://api.openai.com/v1/audio/translations', formData, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
    }
  })
  console.log(response)
  return response
}
