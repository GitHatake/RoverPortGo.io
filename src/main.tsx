import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PostsProvider } from './context/PostsContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostsProvider>
      <App />
    </PostsProvider>
  </StrictMode>,
)
