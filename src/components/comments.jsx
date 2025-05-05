import Comment from './comment.jsx';
import { useState } from 'react';

const Comments = ({ highlightedComment, authorComments, comments, postAuthor, setIsProhibited }) => {
  const [replyingTo, setReplyingTo] = useState(null);

  return <div className='grid gap-2 '>
    <div>
      {
        highlightedComment !== null && <Comment postAuthor={postAuthor} setIsProhibited={setIsProhibited} replyingTo={replyingTo} setReplyingTo={setReplyingTo} info={highlightedComment} />
      }
    </div>
    <div>
      {
        authorComments.length > 0 && authorComments.map(comment => <Comment postAuthor={postAuthor} setIsProhibited={setIsProhibited} replyingTo={replyingTo} setReplyingTo={setReplyingTo} key={comment._id} info={comment} />)
      }
    </div>
    <div>
      {
        comments.length > 0 && comments.map(comment => <Comment postAuthor={postAuthor} setIsProhibited={setIsProhibited} replyingTo={replyingTo} setReplyingTo={setReplyingTo} key={comment._id} info={comment} />)
      }
    </div>
  </div>

}

export default Comments