import 'react-toastify/dist/ReactToastify.css'
import ProtectedRoute from '../components/ProtectedRoute'
import HomePage from '../pages/HomePage'
import SigninPage from '../pages/SigninPage'
import SignupPage from '../pages/SignupPage'
import AuthRoute from '../components/AuthRoute'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import { Route, Routes } from 'react-router-dom'

function App() {
  const theme = createTheme({
    palette: { mode: 'dark' }
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer
        position='bottom-left'
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnHover={false}
      />
      <Routes>
        <Route
          path='/login'
          index
          element={
            <AuthRoute>
              <SigninPage />
            </AuthRoute>
          }
        />

        <Route
          path='/register'
          element={
            <AuthRoute>
              <SignupPage />
            </AuthRoute>
          }
        />

        <Route
          path='/'
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  )
}

export default App
