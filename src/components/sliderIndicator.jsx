const SliderIndicator = ({number, currIndex, setCurrentIndex}) => {
  

return <div className = 'w-full h-12 flex items-center justify-center gap-2 z-80 bg-gradient-to-t from-black/50 to-transparent'>
  {
    Array(number).fill().map((_,i) => {
      return <div className = {`h-[5px] transition-transform duration-200 z-50 w-[5px] rounded-full ${currIndex === i ? 'bg-white scale-150' : 'bg-white/60'} `}></div>
    })
  }
</div>

}

export default SliderIndicator