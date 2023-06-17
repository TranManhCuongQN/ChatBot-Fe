import { Box } from '@mui/system'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { userCheckTkn } from '../api/user.api'
import Loading from './Loading'
import React, { useEffect } from 'react'

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const { isLoading } = useQuery({
    queryKey: 'checkToken',
    queryFn: () => userCheckTkn(),
    onSuccess: (res) => {
      localStorage.setItem('username', res.data.username)
    },
    onError: () => {
      localStorage.removeItem('token')
      navigate('/login')
    },
    enabled: Boolean(token)
  })

  useEffect(() => {
    if (!token) navigate('/login')
  }, [token, navigate])

  return isLoading ? <Loading /> : <Box sx={{ height: '100vh' }}>{children}</Box>
}

export default ProtectedRoute
