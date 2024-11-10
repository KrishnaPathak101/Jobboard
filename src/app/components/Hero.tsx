import React from 'react'

const Hero = () => {
  return (
    <section className=' py-12'>
        <h1 className=' font-bold text-center text-4xl'
        >Find your next <br /> dream job</h1>
        <form className=' flex gap-2 my-5 items-center' action="">
            <input type="search" className='  p-2 py-2 rounded-md w-full border' placeholder='Search phrase...' />
            <button className=' bg-blue-600 text-white py-2 px-4 rounded-md'>Search</button>
        </form>
    </section>
  )
}

export default Hero