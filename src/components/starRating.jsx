import { FaRegStar, FaStar } from "react-icons/fa";

const StarRating = ({viewOnly = true, numOfStars = 5, rate = 1, setRate}) => {

return <div className = 'flex text-yellow-400 items-center  gap-2'>
  {
    Array(numOfStars).fill("").map((star, i) => i < rate ? <FaStar onClick = {viewOnly ? null :  () => setRate(i + 1) } /> : <FaRegStar onClick = {viewOnly ? null :() => setRate(i + 1)}/> )
  }
</div>

}

export default StarRating