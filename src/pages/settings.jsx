import { NavLink } from 'react-router-dom';

const Settings = () => {
  
  const pages = [{ text: "Feed", url: "/customize-feed"}, {text: "Sent Requests", url: "/sent-requests"}];

return <div>
    <p className='text-xl ml-2 mb-2 font-bold'>Settings</p> 
    <div className = 'flex flex-col divide-y-1 '>
      {
        pages.map(({text, url}) => <NavLink className = 'p-3 active:bg-neutral-200/50 bg-neutral-100 ' to = {url}>
          {text}
        </NavLink>)
      }
    </div>
</div>

}

export default Settings