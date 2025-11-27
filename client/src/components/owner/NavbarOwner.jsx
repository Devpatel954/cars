import React, { useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom';

const NavbarOwner = () => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (userData) {
            try {
                setUser(JSON.parse(userData))
            } catch (e) {
                setUser(null)
            }
        }

        // Listen for auth changes
        const handler = () => {
            const userData = localStorage.getItem('user')
            if (userData) {
                try {
                    setUser(JSON.parse(userData))
                } catch (e) {
                    setUser(null)
                }
            }
        }

        window.addEventListener('authChange', handler)
        return () => window.removeEventListener('authChange', handler)
    }, [])

  return (
    <div className='flex flex-items-center justify-between px-6 md:px-10 p-4 text-gray-500 border-b border-borderColor relative transition-all'>

        <Link to='/'>
        <img src={assets.logo} className='h-7' alt="" />
        </Link>

        <p>Welcome, {user?.name || "Owner"}</p>

    </div>
  )
}

export default NavbarOwner