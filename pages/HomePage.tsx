/* eslint-disable jsx-a11y/no-autofocus */
import React, { useEffect } from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { chatCompletion, chatCreateImage } from '../api/chat.api'
import { toast } from 'react-toastify'
import { Box, Stack } from '@mui/system'
import Header from '../components/Header'
import { CircularProgress, FormControl, IconButton, OutlinedInput, Typography } from '@mui/material'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import TypeWriter from 'typewriter-effect'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import { Helmet } from 'react-helmet-async'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'

const messageType = {
  answer: 'answer',
  question: 'question'
}
const HomePage = () => {
  const username = localStorage.getItem('username')

  const navigate = useNavigate()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const chatWrapperRef = React.useRef<HTMLDivElement>(null)
  const [messagesText, setMessagesText] = React.useState<{ type: string; content: string }[]>([])
  const [messagesImage, setMessagesImage] = React.useState<{ type: string; content: string }[]>([])
  const [question, setQuestion] = React.useState<string>('')
  const [options, setOptions] = React.useState<string>('Text')

  const chatMutation = useMutation({
    mutationFn: () => chatCompletion({ prompt: question }),
    onSuccess: (res) => {
      setMessagesText((messages) => [...messages, { type: messageType.answer, content: res.data.text }])
    },
    onError: (err: any) => {
      toast.dismiss()
      toast.error(err.message)
    }
  })

  const chatCreateImageMutation = useMutation({
    mutationFn: () => chatCreateImage({ prompt: question }),
    onSuccess: (res) => {
      setMessagesImage((messages) => [...messages, { type: messageType.answer, content: res.data.image }])
    },
    onError: (err: any) => {
      toast.dismiss()
      toast.error(err.message)
    }
  })

  const getAnswer = () => {
    if (chatMutation.isLoading) return
    if (chatCreateImageMutation.isLoading) return
    if (options === 'Text') {
      setMessagesText((messages) => [...messages, { type: messageType.question, content: question }])
      setQuestion('')
      chatMutation.mutate()
    }
    if (options === 'Image') {
      setMessagesImage((messages) => [...messages, { type: messageType.question, content: question }])
      setQuestion('')
      chatCreateImageMutation.mutate()
    }
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
    <>
      <Helmet>
        <title>Chat Page</title>
        <meta name='description' content='Chat Page - Chat Bot AI' />
      </Helmet>
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
            <Box
              sx={{
                marginTop: '10px'
              }}
            >
              <PopupState variant='popover' popupId='demo-popup-menu'>
                {(popupState) => (
                  <React.Fragment>
                    <Button
                      variant='contained'
                      {...bindTrigger(popupState)}
                      sx={{
                        fontWeight: '700',
                        textTransform: 'revert-layer'
                      }}
                    >
                      Option: {options}
                    </Button>
                    <Menu
                      {...bindMenu(popupState)}
                      sx={{
                        '& .MuiPaper-root': {
                          marginTop: '5px',
                          width: '135px'
                        }
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          setOptions('Text')
                          popupState.close()
                        }}
                      >
                        Text
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setOptions('Image')
                          popupState.close()
                        }}
                      >
                        Image
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setOptions('Audio')
                          popupState.close()
                        }}
                      >
                        Audio
                      </MenuItem>
                    </Menu>
                  </React.Fragment>
                )}
              </PopupState>
            </Box>
            <Typography
              variant='h6'
              fontWeight='700'
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: { sm: 'block', xs: 'none' }
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
            {options === 'Text' &&
              messagesText.map((item, index) => (
                <Box key={index} padding={1}>
                  <Box
                    sx={{
                      padding: 2,
                      bgcolor: item.type === messageType.answer ? '#2f2f2f' : 'initial',
                      borderRadius: 3
                    }}
                  >
                    {index === messagesText.length - 1 ? (
                      item.type === messageType.answer ? (
                        <TypeWriter
                          onInit={(writer) => {
                            writer
                              .typeString(item.content)
                              .callFunction(() => {
                                ;(document.querySelector('.Typewriter__cursor') as HTMLElement).style.display = 'none'

                                setTimeout(() => {
                                  ;(inputRef.current as HTMLInputElement).focus()
                                }, 100)
                              })
                              .changeDelay(5)
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
            {options === 'Image' &&
              messagesImage.map((item, index) => (
                <Box key={index} padding={1}>
                  <Box
                    sx={{
                      padding: 2,
                      bgcolor: item.type === messageType.answer ? '#2f2f2f' : 'initial',
                      borderRadius: 3
                    }}
                  >
                    {index === messagesImage.length - 1 ? (
                      item.type === messageType.answer ? (
                        <img src={item.content} alt='img AI' />
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
                disabled={chatMutation.isLoading || chatCreateImageMutation.isLoading}
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
    </>
  )
}

export default HomePage
