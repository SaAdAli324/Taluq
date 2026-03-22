import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, setCheckingAuth } from '../app/store/slices/authSlices.ts'
import api from '../api.ts'

const AuthCheck = ({ children }: { children: React.ReactNode }) => {

  const dispatch = useDispatch()
  const isCheckingAuth = useSelector((state: any) => state.protectRoutes.isCheckingAuth)
  
  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await api.get('api/get/profile', {
          withCredentials: true
        })
        dispatch(login(response.data.user))
        dispatch(setCheckingAuth(false))
      } catch (error) {
        dispatch(setCheckingAuth(false))
      }
    }
    authenticateUser()
  }, [dispatch])

    if (isCheckingAuth) {
    return <div className="flex items-center justify-center h-screen border text-lg">'loading...</div>
  }


  return <>{children}</>
}

export default AuthCheck
