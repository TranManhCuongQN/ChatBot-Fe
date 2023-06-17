import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { userCheckTkn } from '../api/user.api'
import Loading from './Loading'
import { Box, Container } from '@mui/system'
import Header from './Header'
import { Typography } from '@mui/material'

const AuthRoute = ({ children }: { children: React.ReactElement }) => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const { isLoading } = useQuery({
    queryKey: 'checkToken',
    queryFn: () => userCheckTkn(),
    onSuccess: (res) => {
      navigate('/')
    },
    onError: () => {
      localStorage.removeItem('token')
    },
    enabled: Boolean(token)
  })

  return isLoading ? (
    <Loading />
  ) : (
    <Container
      component='main'
      maxWidth='md'
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Header>
        <Typography variant='h5' fontWeight='600'>
          Bot Chat
        </Typography>
      </Header>

      <Box width='100%'>{children}</Box>

      <Box padding={2}>
        <Typography variant='caption' color='primary'>
          Created by Tran Manh Cuong based on OpenAI GPT-3
        </Typography>
      </Box>
    </Container>
  )
}

export default AuthRoute
