import Comment from './comment.jsx';
import { useState } from 'react'; 

const Comments = ({comments}) => {
  const [replyingTo, setReplyingTo] = useState(null);

return <div className = 'grid gap-2 '>
{
  comments.length > 0 && comments.map(comment => <Comment replyingTo = {replyingTo} setReplyingTo = {setReplyingTo} key = {comment._id} info = {comment} />)
}
</div>

}

export default Comments