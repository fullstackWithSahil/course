import Newcourse from './Newcourse'
import Oldcourses from './Oldcourses'

export default function page() {
  return (
    <div className='h-[95%] overflow-y-scroll'>
      <Newcourse/>
      <Oldcourses/>
    </div>
  )
}
