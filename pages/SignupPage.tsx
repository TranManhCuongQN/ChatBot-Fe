import React from 'react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { userRegister } from '../api/user.api'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Stack } from '@mui/system'
import { LoadingButton } from '@mui/lab'
import InputField from '../components/InputField'
import { Button, IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

interface FormData {
  username: string
  password: string
}

const schema = yup.object({
  username: yup.string().required('username is required').min(6, 'username minimum 6 characters'),
  password: yup.string().required('password is required').min(8, 'password minimum 8 characters')
})

const Signup = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const { handleSubmit, control } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const registerMutation = useMutation({
    mutationFn: (body: FormData) => userRegister(body),
    onSuccess: (res) => {
      toast.dismiss()
      toast.success('Sign up success')
      navigate('/login')
    },
    onError: (error: any) => {
      toast.dismiss()
      toast.error(error.message)
    }
  })

  const onsubmit = handleSubmit((data) => {
    registerMutation.mutate(data)
  })
  return (
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
          loading={registerMutation.isLoading}
          color='success'
        >
          signup
        </LoadingButton>
        <Button component={Link} to='/login' size='small'>
          signin
        </Button>
      </Stack>
    </Box>
  )
}

export default Signup
