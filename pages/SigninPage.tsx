import React from 'react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { userLogin } from '../api/user.api'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Stack } from '@mui/system'
import { LoadingButton } from '@mui/lab'
import InputField from '../components/InputField'
import { Button, IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Helmet } from 'react-helmet-async'

interface FormData {
  username: string
  password: string
}

const schema = yup.object({
  username: yup.string().required('username is required').min(6, 'username minimum 6 characters'),
  password: yup.string().required('password is required').min(8, 'password minimum 8 characters')
})

const Signin = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const { handleSubmit, control } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const loginMutation = useMutation({
    mutationFn: (body: FormData) => userLogin(body),
    onSuccess: (res) => {
      toast.dismiss()
      toast.success('Sign in success')
      localStorage.setItem('token', res.data.token)
      navigate('/')
    },
    onError: (error: any) => {
      toast.dismiss()
      toast.error(error.message)
    }
  })

  const onsubmit = handleSubmit((data) => {
    loginMutation.mutate(data)
  })
  return (
    <>
      <Helmet>
        <title>Login Page</title>
        <meta name='description' content='Login Page - Chat Bot AI' />
      </Helmet>
      <Box component='form' noValidate onSubmit={onsubmit}>
        <Stack spacing={3}>
          <InputField
            type='text'
            placeholder='Username'
            name='username'
            fullWidth
            control={control}
            color='success'
            label='Username'
          />

          <InputField
            name='password'
            label='Password'
            control={control}
            color='success'
            placeholder='Password'
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={() => setShowPassword(!showPassword)}
                    edge='end'
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <LoadingButton
            type='submit'
            size='large'
            variant='contained'
            loading={loginMutation.isLoading}
            color='success'
          >
            login
          </LoadingButton>
          <Button component={Link} to='/register' size='small'>
            register
          </Button>
        </Stack>
      </Box>
    </>
  )
}

export default Signin
