import axios from 'axios';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { PiEyeSlashThin, PiEyeThin } from "react-icons/pi";
import { AnimatePresence } from 'framer-motion';
import { HiOutlineMail } from "react-icons/hi";
import { MoonLoader } from 'react-spinners';
import EmailVerifyModal from '../modals/emailVerifyModal.jsx';
import validator from 'validator';


const Register = () => {

  const [userInfo, setUserInfo] = useState({
    username: '',
    password: '',
    email: '',
  })
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isEmailAlreadyUsed, setIsEmailAlreadyUsed] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isUsernameAlreadyUsed, setIsUsernameAlreadyUsed] = useState(false);
  const [isSomeFieldEmpty, setIsSomeFieldEmpty] = useState(false);
  const [isCodeSendingPending, setIsCodeSendingPending] = useState(false); 

  const { email, username, password } = userInfo;
 
 
 
  const sendOTP = async (e) => {
    e?.preventDefault();
    if (!email || !username || !password) {
      setIsSomeFieldEmpty(true);
      return;
    }
    if (!validator.isEmail(email)) {
      setIsEmailInvalid(true);
      return; 
    }
    
    try {
      setIsCodeSendingPending(true);
      const apiKey = import.meta.env.VITE_ABSTRACT_API;
      const { data }  = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`); 
console.log(data);
    const isDataValid = data.is_valid_format.value &&
    data.is_mx_found.value &&
    data.is_disposable_email.value === false &&
    data.deliverability === "DELIVERABLE" &&
    parseFloat(data.quality_score) >= 0.6; 
    
    
    if(!isDataValid){
      setIsEmailInvalid(true); 
      setIsCodeSendingPending(false);
      return;
    }
    
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/send-otp`, {
        email,
        username
      })
      console.log(res);
      if (res.data.success) {
        setIsOTPSent(true);
        setIsCodeSendingPending(false);
      }
      
    } catch (e) {
      console.log(e)
      if (e.status === 409) {
        const { conflict } = e.response.data;
        if (conflict === 'USERNAME') {
          setIsUsernameAlreadyUsed(true);
          setIsEmailAlreadyUsed(false);
          setIsEmailInvalid(false);
        } else {
          setIsEmailAlreadyUsed(true)
          setIsUsernameAlreadyUsed(false);
          setIsEmailInvalid(false);
        }
      }
      setIsCodeSendingPending(false);
      
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIsEmailAlreadyUsed(false);
    setIsUsernameAlreadyUsed(false);
    setIsSomeFieldEmpty(false);
    setIsEmailInvalid(false);
    setUserInfo(prev => {
      return {
        ...prev, [name]: value
      }
    })
  }


  const toggleShowPassword = () => {
    setIsShowPassword(prev => !prev);
  }

  return <div className="w-full flex flex-col justify-center  items-center gap-4">
    <AnimatePresence>
      {
        isOTPSent === true && <EmailVerifyModal username={username} email={email} password={password} onClose={() => setIsOTPSent(false)} sendOTP={sendOTP} />
      }
    </AnimatePresence>
    <div className="my-5" >
      <p className="text-xs">Sojourn Trails</p>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">Create an account to begin discussions with fellow travellers!</h1>
    </div>
    <form onSubmit={sendOTP} className="bg-white rounded-lg grid gap-4 shadow-lg px-5 py-10 w-full">
      <section className="grid w-11/12" >
        <label className="text-sm">Username
          <span className="text-neutral-400 text-xs mx-2 italic">(Atleast 6 characters required)</span>
        </label>
        <div className={`flex rounded-lg overflow-hidden w-full outline outline-[1.5px] ${username.length < 6 && 'outline-red-300'}`}>
          <input className='p-2 outline-none w-full' type="text" name="username" onChange={handleChange} />
          <div className="p-3 bg-neutral-100">
            <FaUser />
          </div>
        </div>
        {
          isUsernameAlreadyUsed && <p className="text-red-400 text-xs mt-2">This username is already used</p>
        }
      </section>
      <section className="grid w-11/12" >
        <label className="text-sm">Password
          <span className="text-neutral-400 text-xs mx-2 italic">(Atleast 8 characters required)</span></label>
        <div className={`flex rounded-lg overflow-hidden w-full outline outline-[1.5px] ${password.length < 8 && 'outline-red-300'}`}>
          <input className='w-full p-2 outline-none' type={isShowPassword ? 'text' : 'password'} name="password" onChange={handleChange} />
          <button className="bg-neutral-100 p-3" onClick={toggleShowPassword}>
            {
              isShowPassword ? <PiEyeThin /> : <PiEyeSlashThin />
            }
          </button>
        </div>
      </section>
      <section className="grid w-11/12" >
        <label className="text-sm">Email</label>
        <div className={`flex rounded-lg overflow-hidden w-full outline outline-[1.5px] ${(!validator.isEmail(email) || email.length === 0) && 'outline-red-300'}`}>
          <input className='p-2 outline-none w-full' type="text" name="email" onChange={handleChange} />
          <div className="p-3 bg-neutral-100">
            <HiOutlineMail />
          </div>
        </div>
        {isEmailInvalid ? <p className="text-red-400 text-xs mt-2">Invalid or undeliverable email address</p> : isEmailAlreadyUsed && <p className="text-red-400 text-xs mt-2">This email is already used</p>}
      </section>
      {
        isSomeFieldEmpty && <p className="text-red-400 text-xs">Please fill up all the required fields, and make sure to  provide a valid document</p>
      }
      <button type="submit" className="p-3 w-11/12 bg-gray-800 h-12 flex justify-center items-center text-neutral-100 outline rounded-lg hover:bg-white hover:text-gray-800">{isCodeSendingPending ? <MoonLoader size = "18" color = "white"/> : 'Register'}</button>
    </form>
    <p className="text-sm">Already have an account? <NavLink className="text-blue-400 hover:underline" to="/login" >Login</NavLink></p>
  </div>

}

export default Register