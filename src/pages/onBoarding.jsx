import { motion } from 'framer-motion';
import { fromBottomToTop, fade } from '../motionVariants/variant.js';
import { useState } from 'react';
import { countries, travelInterests } from '../data.js';
import { handleCustomizeFeed } from '../utils/customizeFeed.js';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MoonLoader } from 'react-spinners';
const OnBoarding = () => {
  const { user, authenticated } = useSelector(state => state.user);
  const [userForm, setUserForm] = useState({
    country: "", 
    interests: [...user?.interests],
    userId: user?._id
  })

  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async() => {
    setLoading(true);
    const {interests, country} = userForm; 
    const userId = user._id
    const { hasFinishedOnboarding } = user
    try{
          const res = await handleCustomizeFeed({interests, country, userId, hasFinishedOnboarding}); 
          if(res.data.success && authenticated){
            setLoading(false); 
            window.location.href = `${import.meta.env.VITE_HOMEPAGE}`
          }
        }catch(e){
          console.log("submit", e)
        }
  }
  
  const handleChangeCountry = (e) => {
    setUserForm(prev => ({...prev, country: e.target.value}));
  }
  
  const handleSetInterests = (e) => {
    const { value } = e.target;
    let cpyInterests = [...userForm.interests]
    const findIndex = cpyInterests.indexOf(value); 
    if(findIndex > -1){
      cpyInterests.splice(findIndex, 1);
    } else {
      cpyInterests.push(value);
    }
    setUserForm(prev => ({...prev, interests: cpyInterests}))
  }
  
  
  
  if(!authenticated){
    return <div></div>
  }

return <motion.div
variants = {fade} 
initial = "hidden"
animate = "visible"
className = 'fixed inset-0 bg-black/80' 
>
  <motion.div 
  variants = {fromBottomToTop}
  className = 'w-full h-full flex flex-col items-center overflow-y-scroll  pb-10 bg-neutral-100' 
  >


    <div className = 'flex px-3 my-8 flex-col gap-8'>

    <main className = 'mt-6'>
      <h1>Customizing Feed</h1>
      <h1 className = 'tracking-wide text-xl'>Your Travel Interests</h1>
      <p className = 'text-xs text-neutral-500 p-2'>You can customize your selected country and interests later at any time</p>
      <div className = 'grid grid-cols-2 gap-5 p-2'>
        {
          travelInterests.map(({name, emoji}) => <button value = {name} onClick = {handleSetInterests} className = {`p-2 outline flex gap-1 ${userForm.interests.includes(name) ? " outline-blue-300 bg-blue-100 " : " outline-gray-300 "} rounded-lg `}>
            <p className = 'pointer-events-none'>{emoji}</p><p className = 'truncate pointer-events-none'>{name}</p>
          </button>)
        }
      </div>
    </main>
              <section className = ' flex flex-col gap-3'>
      <h1 className = ' text-xl'>Which country are you from?</h1>
      <div className = 'outline rounded-lg p-2 w-6/12 '>
              <select className = " w-full outline-none" onChange = {handleChangeCountry} value = {user.country || userForm.country} >
                <option value = "" selected disabled hidden>Select</option>
        {
          countries.map((country) => <option value = {country}>{country}</option>)
        }
      </select>
      </div>
    </section>
    </div>
    <p className = 'text-xs text-neutral-500 p-6'>This list will be used to customize your feed based on your selected country and interests</p>
    <button disabled = {loading || !authenticated} onClick = {handleSubmit} className = 'bg-gradient-to-l text-neutral-100 w-11/12 from-blue-400 to-blue-300 p-2 rounded-lg flex items-center justify-center h-10'>{loading ? <MoonLoader size = "20" color = "white"/> : "Save"}</button>
    
  </motion.div>
</motion.div>

}

export default OnBoarding