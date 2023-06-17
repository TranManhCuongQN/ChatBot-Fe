import { Box } from '@mui/system'
import React from 'react'

const Header = ({
  bg,
  borderBottom,
  children
}: {
  bg?: boolean
  borderBottom?: boolean
  children: React.ReactElement
}) => {
  return (
    <Box
      sx={{
        zIndex: 2,
        width: '100%',
        height: 60,
        bgcolor: (bg as boolean) ? '#000' : 'initial',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: (borderBottom as boolean) ? '1px solid #2c2c2c' : 'none'
      }}
    >
      {children}
    </Box>
  )
}

export default Header
