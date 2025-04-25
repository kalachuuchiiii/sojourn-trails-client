import { useDispatch, useSelector } from 'react-redux';
import { MoonLoader } from 'react-spinners';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { setUser } from '../state/userSlice.js';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser } from "react-icons/fa";
import { PiEyeSlashThin, PiEyeThin } from "react-icons/pi";



const Login = () => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: ''
  });
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [currentDyk, setCurrentDyk] = useState(0);
  const [isLoggingInPending, setIsLoggingInPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const nav = useNavigate();
  const { username, password } = userInfo;

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingInPending(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/login`, { ...userInfo }, {
        withCredentials: true
      })
      const authenticated = res.data.authenticated;
      if (authenticated) {
        window.location.href = import.meta.env.VITE_HOMEPAGE
        setIsLoggingInPending(false);
      }
    } catch (e) {
      setIsError(true);
      setErrorMsg(e.response.data.message || 'Internal Server Error');
      setIsLoggingInPending(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIsError(false);
    setErrorMsg('');
    setUserInfo(prev => {
      return {
        ...prev, [name]: value
      }
    })
  }

  const toggleShowPassword = () => {
    setIsShowPassword(prev => !prev);
  }

  const didYouKnow = [
    'Sojourn was built not with a computer, but with a mobile phone!',
    'The developer of Sojourn Trails learned to code to secure a future with someone!',
  ]

  const startDykCountdown = () => {
    const lastIndex = didYouKnow.length - 1;

    const intervalId = setInterval(() => {
      setCurrentDyk(prev => prev === lastIndex ? 0 : prev + 1)
    }, 5000);
  }

  useEffect(() => {
    startDykCountdown();
  }, [])

  return <div className="w-full flex flex-col items-center justify-center flex flex-col gap-4 h-screen">
    <div className="text-left w-full">
      <h1 className="text-3xl grid gap-1 font-bold">Welcome back!</h1>
      <div className="ml-2 text-neutral-700 mt-4">
        <p className="text-xs">Did you know?</p>
        <p>
          {didYouKnow[currentDyk]}
        </p>
      </div>
    </div>
    <form onSubmit={handleLogin} className="w-full grid gap-5 shadow-md rounded-lg p-4">
      <section className="grid w-11/12" >
        <label className="text-sm">Username
        </label>
        <div className='flex rounded-lg overflow-hidden w-full outline outline-[1.5px]'>
          <input className='p-2 outline-none w-full' type="text" name="username" onChange={handleChange} />
          <div className="p-3 bg-neutral-100">
            <FaUser />
          </div>
        </div>
      </section>
      <section className="grid w-11/12" >
        <label className="text-sm">Password
        </label>
        <div className='flex rounded-lg overflow-hidden w-full outline outline-[1.5px]'>
          <input className='w-full p-2 outline-none' type={isShowPassword ? 'text' : 'password'} name="password" onChange={handleChange} />
          <button className="bg-neutral-100 p-3" onClick={toggleShowPassword}>
            {
              isShowPassword ? <PiEyeThin /> : <PiEyeSlashThin />
            }
          </button>
        </div>
      </section>
      {
        isError && <p className="text-xs text-red-400">{errorMsg}</p>
      }
      <button disabled={isLoggingInPending} type="submit" className="p-3 w-11/12 bg-gray-800 h-12 flex justify-center items-center text-neutral-100 outline rounded-lg hover:bg-white hover:text-gray-800">{
        isLoggingInPending ? <MoonLoader size="18" color="white" /> : 'Log in'}</button>

    </form>
    <p className='text-sm'>Doesn't have an account? <NavLink to="/register" className="text-blue-400 ">Register</NavLink></p>
  </div>

}

export default Login

