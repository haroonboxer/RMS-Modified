import {
  FC,
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react'
import {LayoutSplashScreen} from '../../../../_metronic/layout/core'
import {AuthModel, UserModel} from './_models'
import * as authHelper from './AuthHelpers'
// import {getUserByToken} from './_requests'
import {WithChildren} from '../../../../_metronic/helpers'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

type AuthContextProps = {
  auth: AuthModel | undefined
  saveAuth: (auth: AuthModel | undefined) => void
  currentUser: UserModel | undefined
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>
  logout: () => void
  hasPermission: (permission: string) => any
}

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => {},
  currentUser: undefined,
  setCurrentUser: () => {},
  logout: () => {},
  hasPermission: (permission: string) => {},
}

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState)

const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider: FC<WithChildren> = ({children}) => {
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth())
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>()
  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth)
    if (auth) {
      authHelper.setAuth(auth)
    } else {
      authHelper.removeAuth()
    }
  }

  const logout = async () => {
    await axios.post('api/user/logout')
    saveAuth(undefined)
    setCurrentUser(undefined)
  }

  const hasPermission = (permission: string) => {
     
    return currentUser?.permissions.some((p: string) => p === `${permission}`)
  }

  return (
    <AuthContext.Provider
      value={{auth, saveAuth, currentUser, setCurrentUser, logout, hasPermission}}
    >
      {children}
    </AuthContext.Provider>
  )
}

// const AuthInit: FC<WithChildren> = ({children}) => {
//   const {auth, logout, setCurrentUser} = useAuth()
//   const didRequest = useRef(false)
//   const [showSplashScreen, setShowSplashScreen] = useState(true)
//   // We should request user by authToken (IN OUR EXAMPLE IT'S API_TOKEN) before rendering the application
//   useEffect(() => {
//     const requestUser = async (apiToken: string) => {
//       try {
//         if (!didRequest.current) {
//           const {data} = await getUserByToken(apiToken)
//           if (data) {
//             setCurrentUser(data)
//           }
//         }
//       } catch (error) {
//         console.error(error)
//         if (!didRequest.current) {
//           logout()
//         }
//       } finally {
//         setShowSplashScreen(false)
//       }

//       return () => (didRequest.current = true)
//     }

//     if (auth && auth.api_token) {
//       requestUser(auth.api_token)
//     } else {
//       logout()
//       setShowSplashScreen(false)
//     }
//     // eslint-disable-next-line
//   }, [])

//   return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
// }
const AuthInit: FC<WithChildren> = ({ children }) => {
  const { auth, setCurrentUser } = useAuth()

  const [showSplashScreen, setShowSplashScreen] = useState(true)

  useEffect(() => {

    const initializeAuth = () => {

      try {

        if (!auth || !auth.api_token) {
          setShowSplashScreen(false)
          return
        }

        // Decode JWT
        const decoded = jwtDecode(auth.api_token)

        // Check JWT expiration
        if (decoded.exp) {

          const expirationTime = decoded.exp * 1000

          if (expirationTime <= Date.now()) {

            authHelper.removeAuth()
            setCurrentUser(undefined)

            setShowSplashScreen(false)
            return
          }
        }

        // Restore user from JWT
        setCurrentUser(decoded as UserModel)

      } catch (error) {

        console.error("❌ AUTH INIT ERROR:", error)

        authHelper.removeAuth()
        setCurrentUser(undefined)

      } finally {

        setShowSplashScreen(false)

      }
    }

    initializeAuth()

  }, [auth, setCurrentUser])

  return showSplashScreen ? (
    <LayoutSplashScreen />
  ) : (
    <>{children}</>
  )
}
export {AuthProvider, AuthInit, useAuth}
