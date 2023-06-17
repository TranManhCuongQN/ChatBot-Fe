/* eslint-disable jsx-a11y/no-autofocus */
import React, { useEffect } from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { chatCompletion } from '../api/chat.api'
import { toast } from 'react-toastify'
import { Box, Stack } from '@mui/system'
import Header from '../components/Header'
import { CircularProgress, FormControl, IconButton, OutlinedInput, Typography } from '@mui/material'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import TypeWriter from 'typewriter-effect'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'

const messageType = {
  answer: 'answer',
  question: 'question'
}
const HomePage = () => {
  const username = localStorage.getItem('username')

  const navigate = useNavigate()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const chatWrapperRef = React.useRef<HTMLDivElement>(null)
  const [messages, setMessages] = React.useState<{ type: string; content: string }[]>([])
  const [question, setQuestion] = React.useState<string>('')

  const chatMutation = useMutation({
    mutationFn: () => chatCompletion({ prompt: question }),
    onSuccess: (res) => {
      setMessages((messages) => [...messages, { type: messageType.answer, content: res.data.text }])
    },
    onError: (err: any) => {
      toast.dismiss()
      toast.error(err.message)
    }
  })

  const getAnswer = () => {
    if (chatMutation.isLoading) return
    setMessages((messages) => [...messages, { type: messageType.question, content: question }])
    setQuestion('')
    chatMutation.mutate()
  }

  const onEnterPress = (e: any) => {
    if (e.keyCode === 13) getAnswer()
  }

  const onSignOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/login')
  }

  useEffect(() => {
    setTimeout(() => {
      if (chatWrapperRef.current) {
        chatWrapperRef.current.addEventListener('DOMNodeInserted', (e: any) => {
          e?.currentTarget?.scroll({
            top: e.currentTarget.scrollHeight,
            behavior: 'smooth'
          })
        })
      }
    }, 200)
  }, [])
  return (
    <Stack alignItems='center' justifyContent='space-between' sx={{ height: '100%' }}>
      <Header bg borderBottom>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
            paddingX: 2,
            maxWidth: 'md'
          }}
        >
          <Typography
            variant='h6'
            fontWeight='700'
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            {username}
          </Typography>
          <IconButton
            onClick={onSignOut}
            sx={{
              position: 'absolute',
              top: '50%',
              right: '16px',
              transform: 'translateY(-50%)'
            }}
          >
            <LogoutOutlinedIcon />
          </IconButton>
        </Box>
      </Header>

      <Box
        ref={chatWrapperRef}
        sx={{
          height: '100%',
          position: 'fixed',
          zIndex: 1,
          maxWidth: 'md',
          width: '100%',
          overflowY: 'auto',
          paddingTop: '60px',
          paddingBottom: '90px',
          '&::-webkit-scrollbar': {
            width: '0px'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            maxWidth: 'md',
            width: '100%'
          }}
        >
          {messages.map((item, index) => (
            <Box key={index} padding={1}>
              <Box
                sx={{
                  padding: 2,
                  bgcolor: item.type === messageType.answer ? '#2f2f2f' : 'initial',
                  borderRadius: 3
                }}
              >
                {index === messages.length - 1 ? (
                  item.type === messageType.answer ? (
                    <TypeWriter
                      onInit={(writer) => {
                        writer
                          .typeString(item.content)
                          .callFunction(() => {
                            setTimeout(() => {
                              ;(inputRef.current as HTMLElement).focus()
                            }, 200)
                          })
                          .changeDelay(50)
                          .start()
                      }}
                    />
                  ) : (
                    item.content
                  )
                ) : (
                  item.content
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Stack
        width='100%'
        alignItems='center'
        justifyContent='center'
        borderTop='1px solid #2c2c2c'
        bgcolor='#000'
        zIndex={3}
      >
        <Box padding={2} width='100%' maxWidth='md'>
          <FormControl fullWidth variant='outlined'>
            <OutlinedInput
              inputRef={inputRef}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                }
              }}
              endAdornment={chatMutation.isLoading ? <CircularProgress size='1.5rem' /> : <SendOutlinedIcon />}
              disabled={chatMutation.isLoading}
              autoFocus
              onKeyUp={onEnterPress}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder='Ask something...'
            />
          </FormControl>
        </Box>
      </Stack>
    </Stack>
  )
}

export default HomePage
