import axios from "axios";

export const removeRequest = async(options) => {
 
 console.log(options)   
    try{
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/remove-request`, {
        params: {
          options: JSON.stringify(options)
        }
      }); 
      console.log(res)
      
      return res;;
      
    }catch(e){
      console.log("rem", e)
      throw new Error(e);
    }
  }