import axios from 'axios'; 

export const getOneCommentById = async(id) => {
  try{
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-one-comment-by-id/${id}`); 
    console.log("one", res); 
    return res.data.comment;
  }catch(e){
    console.log(e) 
    throw new Error(e.message);
  }
}

export const getCommentsOfAuthor = async(postId,authorId) => {
  try{
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-comments-of-author/author=${authorId}/post=${postId}`); 
    console.log(res)
    return res.data.authorComments;
  }catch(e){
    console.log(e)
  }
}