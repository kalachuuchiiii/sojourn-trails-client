import axios from 'axios'; 


export const addFriend = async({requestSender, requestRecepient}) => {
  
  try{
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/add-friend`, {
      requestSender, 
      requestRecepient
    })
    
    return res.data;
  }catch(e){
    console.log("addfriend", e)
  }
}

export const followback = async({userOne, userTwo}) => {
  try{
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/followback`, {userOne, userTwo}); 
        return res;
      }catch(e){
        console.log("followback", e)
        throw new Error(e);
      }
}

export const unfriend = async({userOne, userTwo}) => {
  try{
        const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/unfriend`, {
          params: {
            userOne, 
            userTwo
          }
        })
        return res;
      }catch(e){
        console.log("unfollow", e)
      }
}