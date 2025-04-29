import Comment from './comment.jsx';

const Comments = ({comments}) => {
  
  console.log(comments)

return <div className = 'grid gap-2'>
{
  comments.length > 0 && comments.map(comment => <Comment info = {comment} />)
}
</div>

}

export default Comments