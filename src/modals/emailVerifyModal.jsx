import { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; 
import { fade } from '../motionVariants/variant.js';
import { FaCheck } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MoonLoader } from 'react-spinners';

const EmailVerifyModal = ({username, password, email, sendOTP, onClose}) => {
  
  const [resendCountdown, setResendCountdown] = useState(60); 
  const [code, setCode] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifyingPending, setIsVerifyingPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isInputFieldInvalid, setIsInputFieldInvalid] = useState(false);
  const nav = useNavigate();
  
  
  const startCountdown = () => {
  let count = 60;
    const intervalId = setInterval(() => {
      if(count === 0){
        clearInterval(intervalId);
        return;
      }
      setResendCountdown(prev => prev - 1); 
      count--;
    }, 1000); 
  }
  
  const handleResend = () => {
    if(resendCountdown > 0){
      return;
    }
    setIsVerifyingPending(true);
    sendOTP().then(() => {
      if(resendCountdown === 0){
        setResendCountdown(60);
        setIsVerifyingPending(false);
      }
    }).catch((e) => {
      setIsError(true);
    })
  }
  
  useEffect(() => {
    if(resendCountdown === 60){
      startCountdown();
    }
  }, [resendCountdown]); 
  
  const handleSubmit = async() => {
    const isValidCode = !(/[^0-9]/.test(code.toString())) && code.toString().length === 6;
    
    if(!isValidCode){
      return;
    }
    try{
      setIsVerifyingPending(true);
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/verify-otp`, {
        username, 
        password, 
        email, 
        code
      })
      
      if(res.data.success){
        setIsVerified(true);
        setIsVerifyingPending(false);
        setTimeout(() => {
          nav('/login');
          window.location.reload();
        }, 2500)
      }
    }catch(e){
      console.log(e); 
      setIsVerifyingPending(false);
      setIsError(true);
      setErrorMessage(e.response.data.message || 'Internal Server Error');
    }
  }
  
  const handleChange = (e) => {
    const { value } = e.target;
    setCode(value);
   const isValidCode = !(/[^0-9]/.test(value.toString())) && value.length === 6;

    if(!isValidCode){
      setIsInputFieldInvalid(true); 
      setIsError(false);
      return;
    }
    setIsVerifyingPending(false); 
    setIsError(false); 
    setIsInputFieldInvalid(false);
    setErrorMessage('');
  }

  
  

return <motion.div
variants = {fade} 
initial = "hidden"
animate = "visible" 
exit = "hidden"
onClick = {(e) => e.stopPropagation()} className = "fixed inset-0 flex justify-center items-center bg-black/90" >
  <main className = "p-4 bg-neutral-100  w-11/12 md:w-8/12 lg:w-6/12 rounded-lg  flex flex-col items-start gap-3">
    
      <p>A verification code was sent to <strong>{email}</strong></p>
            <p className = "text-xs text-neutral-500">Check your inbox to get the 6-digit code to verify your email</p>
      <input onChange = {handleChange} required className = {`outline outline-[1.5px]  ${isInputFieldInvalid && 'outline-red-300'} w-11/12 p-2 text-xl italic rounded-lg`} type = "number" />
      <button disabled = {resendCountdown > 0} onClick = {handleResend} className = {`${(resendCountdown === 0 && !isVerified)? 'text-blue-400' : 'text-neutral-400'} my-2 text-sm`}>Resend code {resendCountdown !== 0 && resendCountdown}</button>
      {
        isError ? <p className = "text-xs text-red-400">{errorMessage}</p> : isVerified && <p className = "text-black text-sm grid text-blue-400">
          Successfully registered your account! <span className = "text-blue-350 text-xs">
          Redirecting to the login page...
        </span></p>
      }
      <div className = "flex gap-2 w-full">
              <button disabled = {isVerifyingPending || isInputFieldInvalid} onClick = {handleSubmit} className = "p-3 w-11/12 bg-gray-800 text-neutral-100 outline rounded-lg h-12 flex justify-center items-center hover:bg-white hover:text-gray-800">
        {isVerifyingPending? <MoonLoader color = "white" size = "16"/> : isVerified ? <FaCheck/> : 'Submit'}
      </button>
      <button disabled = {isVerified || isVerifyingPending} onClick = {onClose}>Cancel</button>
      </div>
  </main>
</motion.div>

}

export default EmailVerifyModal