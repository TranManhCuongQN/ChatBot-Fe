/* eslint-disable jsx-a11y/no-autofocus */
import React, { useEffect } from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { chatCompletion, chatCreateImage, chatCreateTranscription } from '../api/chat.api'
import { toast } from 'react-toastify'
import { Box, Stack } from '@mui/system'
import Header from '../components/Header'
import { CircularProgress, FormControl, IconButton, OutlinedInput, Tooltip, Typography } from '@mui/material'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import TypeWriter from 'typewriter-effect'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import { Helmet } from 'react-helmet-async'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined'

const messageType = {
  answer: 'answer',
  question: 'question'
}
const HomePage = () => {
  const username = localStorage.getItem('username')

  const navigate = useNavigate()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  const chatWrapperRef = React.useRef<HTMLDivElement>(null)
  const [messagesText, setMessagesText] = React.useState<{ type: string; content: string }[]>([])
  const [messagesImage, setMessagesImage] = React.useState<{ type: string; content: string }[]>([])
  const [messagesAudio, setMessagesAudio] = React.useState<{ type: string; content: string }[]>([])
  const [question, setQuestion] = React.useState<string>('')
  const [questionAudio, setQuestionAudio] = React.useState<File | undefined>(undefined)
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

  const chatCreateAudioMutation = useMutation({
    mutationFn: () => chatCreateTranscription({ prompt: questionAudio as File }),
    onSuccess: (res) => {
      setMessagesAudio((messages) => [...messages, { type: messageType.answer, content: res.data.text }])
      setQuestionAudio(undefined)
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
    if (options === 'Audio') {
      if (!questionAudio) {
        toast.dismiss()
        toast.error('Please upload audio file')
        return
      }
      chatCreateAudioMutation.mutate()
    }
  }

  const onUploadAudio = (e: any) => {
    const file = e.target.files[0]
    if (!file) {
      toast.dismiss()
      toast.error('Please upload audio file')
      return
    }
    setQuestionAudio(file)
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
                        <img
                          src={item.content}
                          alt='img AI'
                          width='100%'
                          style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                            borderRadius: '5px'
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
            {options === 'Audio' &&
              messagesAudio.map((item, index) => (
                <Box key={index} padding={1}>
                  <Box
                    sx={{
                      padding: 2,
                      bgcolor: item.type === messageType.answer ? '#2f2f2f' : 'initial',
                      borderRadius: 3
                    }}
                  >
                    {index === messagesAudio.length - 1 ? (
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
          <Box
            padding={2}
            width='100%'
            maxWidth='md'
            flexDirection='row'
            alignItems='center'
            justifyContent='center'
            display='flex'
            columnGap={3}
          >
            {options === 'Audio' && (
              <>
                <input
                  type='file'
                  ref={inputFileRef}
                  accept='.m4a,.mp3,.webm,.mp4,.mpga,.wav,.mpeg'
                  style={{
                    display: 'none'
                  }}
                  onChange={onUploadAudio}
                />
                <Tooltip title='Attach file mp3, mp4' placement='top'>
                  <IconButton
                    onClick={() => {
                      ;(inputFileRef.current as HTMLInputElement).click()
                    }}
                  >
                    <AttachmentOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}

            <FormControl
              variant='outlined'
              sx={{
                flexGrow: 1
              }}
            >
              <OutlinedInput
                inputRef={inputRef}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  }
                }}
                endAdornment={
                  chatMutation.isLoading || chatCreateImageMutation.isLoading || chatCreateAudioMutation.isLoading ? (
                    <CircularProgress size='1.5rem' />
                  ) : (
                    <SendOutlinedIcon />
                  )
                }
                disabled={
                  chatMutation.isLoading || chatCreateImageMutation.isLoading || chatCreateAudioMutation.isLoading
                }
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
