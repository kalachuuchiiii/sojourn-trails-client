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

export const getRepliesOfComment = async(options, page) => {
  try{
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-replies-of-comment`, {
      params: {
        options: JSON.stringify(options)
      }
    }); 
     return res.data.replies;
  }catch(e){
    console.log(e)
  }
}

export const getCommentsOfAuthor = async(postId,authorId, highlightId) => {
  try{
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-comments-of-author/author=${authorId}/post=${postId}/highlightId=${highlightId}`); 
    console.log(res)
    return res.data.authorComments;
  }catch(e){
    console.log(e)
  }
}