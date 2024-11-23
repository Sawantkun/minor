import React from 'react'
import Empty from "../assets/images/empty.png"

const JobPortal = () => {
  return (
    <div className="h-full w-full ml-[310px] flex-col items-center justify-center text-center">
        <img src={Empty} alt="" className='mx-auto mt-[15%]'/>
        <h1 className="text-5xl font-bold mt-5">No Jobs Available Yet, Damn</h1>
        <p className="text-4xl font-medium text-gray-600 mt-5">Stay Jobless Lil Bro</p>
    </div>
  )
}

export default JobPortal
