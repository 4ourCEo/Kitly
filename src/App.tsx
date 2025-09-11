import { useEffect } from 'react'
import {
  RouterProvider,
} from "react-router-dom"
import { router } from "./router"
import { useUserStore } from './store/userStore'

function App() {
  const checkAuth = useUserStore((state) => state.checkAuth)

  useEffect(() => {
    // Initialize authentication state on app startup
    checkAuth()
  }, [])

  return (
    <RouterProvider router={router} />
  )
}

export default App