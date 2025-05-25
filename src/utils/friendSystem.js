import axios from 'axios';


export const follow = async ({ sender, recipient }) => {

  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/send-friend-request`, {
      recipient,
      sender
    })

    return res;


  } catch (e) {
    throw new Error(e)
    console.log("addfriend", e)
  }
}

export const followback = async ({ userOne, userTwo }) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/followback`, { userOne, userTwo });
    return res;
  } catch (e) {
    console.log("followback", e)
    throw new Error(e);
  }
}

export const unfriend = async ({ userOne, userTwo }) => {
  try {
    const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/unfriend`, {
      params: {
        userOne,
        userTwo
      }
    })
    return res;
  } catch (e) {
    console.log("unfollow", e)
  }
}