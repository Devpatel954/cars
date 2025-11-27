import React from 'react'
import { assets, dummyUserData } from '../../assets/assets'
import { Link } from 'react-router-dom';

const NavbarOwner = () => {

    const user = dummyUserData;

  return (
    <div className='flex flex-items-center justify-between px-6 md:px-10 p-4 text-gray-500 border-b border-borderColor relative transition-all'>

        <Link to='/'>
        <img src={assets.logo} className='h-7' alt="" />
        </Link>

        <p>Welcome, {user.name || "owner"}</p>




    </div>
  )
}

export default NavbarOwner