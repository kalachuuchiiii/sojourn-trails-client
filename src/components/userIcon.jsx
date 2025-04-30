const UserIcon = ({info}) => {

return <div className = ' p-2  rounded-lg flex items-center gap-4 '>
  <div  className = 'size-9 rounded-full bg-neutral-300 flex items-center justify-center'>
    <img src = {info?.icon || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'} className = 'size-8 rounded-full object-cover' />
  </div>

</div>

}

export default UserIcon