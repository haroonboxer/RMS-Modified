
import { useEffect } from 'react'
const initialValues = {
  email: '',
  password: '',
}



const Login = () => {
  useEffect(() => {
    console.log("1 Hello world");
    const ssoUrl = process.env.REACT_APP_SSO_LIVE_SERVER_ADDRESS

    if (ssoUrl) {
    //   window.location.href = ssoUrl
    }
  }, [])

  return null
}

export default Login