import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react'; 
import Comments from '../components/comments.jsx';
import Comment from '../components/comment.jsx';
import { getOneCommentById, getRepliesOfComment } from '../utils/getComment.js';
import { NavLink } from 'react-router-dom';

const CommentReply = () => {
  const [commentInfo, setCommentInfo] = useState(null); 
  const [highlightedReply, setHighlightedReply] = useState(null);
  const [replies, setReplies] = useState([]); 
  const [page, setPage] = useState(0); 
  
  const { commentId, replyId } = useParams();
  
  const getRequiredData = async() => {
    
    const replyOptions = {
      replyTo: commentId, 
      _id: { $ne: replyId }
    }
    
    const [comment, highlightedRep, regularReplies] = await Promise.all([
      getOneCommentById(commentId),
      getOneCommentById(replyId),
      getRepliesOfComment(replyOptions, 0)
      ]);
      
      setCommentInfo(comment); 
      setHighlightedReply(highlightedRep); 
      setReplies(regularReplies);
  }
  
  useEffect(() => {
    if(commentId && replyId){
      getRequiredData();
    }
  }, [commentId, replyId])
  
  if(!commentInfo){
    return <div>Loading...</div>
  }

return <div className = 'w-full flex flex-col'>
  <NavLink to = {`/post/${commentInfo.toPost}`} className = 'w-full text-blue-400 text-sm text-center'>Go to original post</NavLink>
  <div className = ''>
    {
      (replies?.length > 0 || commentInfo || highlightedReply) && <Comments parentComment = {commentInfo} highlightedComment = {highlightedReply}
      comments = {replies}/>
    }
  </div>
</div>

}

export default CommentReply