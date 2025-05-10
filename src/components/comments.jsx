import Comment from './comment.jsx';
import { useState } from 'react';

const Comments = ({ parentComment = null, highlightedComment = null, authorComments = [], comments = [], postAuthor, setIsProhibited = false}) => {
  const [replyingTo, setReplyingTo] = useState(null);

  return <div>
    <div>
      {
        parentComment && <Comment postAuthor={postAuthor} setIsProhibited={setIsProhibited} replyingTo={replyingTo} setReplyingTo={setReplyingTo} info={parentComment} />
      }
    </div>
    <div className = {parentComment && ' pl-4 '}>
          <div>
      {
        highlightedComment !== null && <Comment postAuthor={postAuthor} setIsProhibited={setIsProhibited} highlighted = {true} replyingTo={replyingTo} setReplyingTo={setReplyingTo} info={highlightedComment} />
      }
    </div>
    <div >
      {
        authorComments && authorComments.length > 0 && authorComments.map(comment => <Comment postAuthor={postAuthor} setIsProhibited={setIsProhibited} replyingTo={replyingTo} setReplyingTo={setReplyingTo} key={comment._id} info={comment} />)
      }
    </div>
    <div>
      {
        comments && comments.length > 0 && comments.map(comment => <Comment postAuthor={postAuthor} setIsProhibited={setIsProhibited} replyingTo={replyingTo} setReplyingTo={setReplyingTo} key={comment._id} info={comment} />)
      }
    </div>
    </div>
  </div>

}

export default Comments