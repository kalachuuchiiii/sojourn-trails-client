import axios from "axios";

export const getUserInfo = async(userId) => {
  if(!userId)return; 
      try{
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-user-by-id/${userId}`);
        return res.data.userInfo
      }catch(e){
        throw new Error(e);
        console.log(e)
      }
    }