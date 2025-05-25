import axios from "axios";

export const handleCustomizeFeed = async({userId, interests, country, hasFinishedOnboarding}) => {
   try{
         const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/customize-feed`, { userId, interests, country, hasFinishedOnboarding}); 
         return res;
       }catch(e){
         console.log("handleCustomizeFeed", e)
       }
  }