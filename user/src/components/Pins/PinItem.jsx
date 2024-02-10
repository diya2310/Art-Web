import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiHeart, HiOutlineHeart } from 'react-icons/hi'

function PinItem({ pin }) {

  // const user = {
  //   displayName: pin.userName,
  //   photoURL: pin.userImage,
  // }
  // const email = { email: pin.email }

  return (

    <div className=''>

      <NavLink to={`/pin/${pin.id}`}>
        <motion.div whileHover={{ scale: 1.1 }} className="relative before:absolute before:h-full before:w-full before:rounded-3xl before:z-10 hover:before:bg-gray-600 before:opacity-50
        cursor-pointer"
        >
          <img src={pin.image} alt={pin.title} width={500} height={500} className='rounded-3xl cursor-pointer relative mt-3' />

          {/* <div className='pin-content'>
            <h3>Sample Name</h3>
          </div> */}
        </motion.div>
      </NavLink>

      <div className='flex items-center justify-around gap-5'>

        <div className='flex justify-evenly'>
          <h2 className='text-[18px] mt-2'>{pin.title}</h2>
        </div>

        {
          pin.fav.length !== 0
            ? <div className='float-right mt-2 flex gap-1'>
              <HiHeart className='text-red-600 text-xl' />
              <h4>{pin.fav.length}</h4>
            </div>
            : <div className='float-right mt-2 flex gap-1'>
              <HiOutlineHeart className='text-red-600 text-xl' />
              <h4>{pin.fav.length}</h4>
            </div>
        }


      </div>

      {/* <UserTag user={user} id={email} /> */}
    </div>

  )
}

export default PinItem