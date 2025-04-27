const UserIcon = ({info}) => {

return <div className = '  p-2 rounded-lg flex items-center gap-4 '>
  <div  className = 'size-8 rounded-full bg-neutral-300 flex items-center justify-center'>
    <div className = 'size-7 rounded-full bg-neutral-100'>
      
    </div>
  </div>
  <p>{info?.username}</p>
</div>

}

export default UserIcon