import React from 'react'
import { CssVarsProvider } from '@mui/joy/styles'
import './App.css'
import { BottomTab } from './components/BottomTab'
import { Box } from '@mui/joy'
import { Home } from './page/Home'
import { WarnModal } from './components/WarnModal'

function App() {
  return (
    <CssVarsProvider>
      <Box className="App" p={2}>
        <Home />
      </Box>
      <BottomTab />
      <WarnModal />
    </CssVarsProvider>
  )
}

export default App
