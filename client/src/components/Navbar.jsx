import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { assets, menuLinks } from '../assets/assets'

const Navbar = ({ setShowLogin }) => {
    const location = useLocation()
    const [open, setOpen] = useState(false)
    const [token, setToken] = useState('')
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const readToken = () => {
            const savedToken = localStorage.getItem('token')
            setToken(savedToken || '')
        }

        const fetchUser = async (t) => {
            try {
                if (!t) return setUser(null)
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3020'
                const res = await fetch(`${apiUrl}/api/user/data`, {
                    headers: { Authorization: `Bearer ${t}` }
                })
                const data = await res.json()
                if (data && data.success && data.data) setUser(data.data)
                else setUser(null)
            } catch (err) {
                console.error('Error fetching user:', err)
                setUser(null)
            }
        }

        readToken()
        fetchUser(localStorage.getItem('token'))

        // Listen for auth changes (login/register/logout)
        const handler = () => {
            readToken()
            fetchUser(localStorage.getItem('token'))
        }
        window.addEventListener('authChange', handler)

        return () => {
            window.removeEventListener('authChange', handler)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken('')
        setUser(null)
        setOpen(false)
        window.dispatchEvent(new Event('authChange'))
        navigate('/')
    }

    const closeMenu = () => {
        setOpen(false)
    }
    
    return (
        <nav className={`flex items-center justify-between px-4 sm:px-6 md:px-12 lg:px-20 py-4 text-gray-600 border-b border-gray-200 relative transition-all ${location.pathname === "/" && "bg-light"}`}>
            
            {/* Logo */}
            <Link to='/' onClick={closeMenu} className='flex-shrink-0'>
                <img src={assets.logo} alt="logo" className='h-7 sm:h-8'/>
            </Link>

            {/* Desktop Menu */}
            <div className={`hidden md:flex items-center gap-6 lg:gap-8`}>
                {menuLinks.map((link, index) => (
                    <Link 
                        key={index} 
                        to={link.path}
                        className='text-sm lg:text-base hover:text-indigo-500 transition-colors'
                    >
                        {link.name}
                    </Link>
                ))}

                {/* Search Bar */}
                <div className='hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 py-2 rounded-full hover:border-indigo-500 transition-colors'>
                    <input 
                        type="text" 
                        className='py-1 w-40 bg-transparent outline-none placeholder-gray-500 text-sm' 
                        placeholder='Search...'
                    />
                    <img src={assets.search_icon} alt="search" className='w-4 h-4' />
                </div>
            </div>

            {/* Right Section - Desktop */}
            <div className='hidden md:flex items-center gap-3 lg:gap-4'>
                <button 
                    onClick={() => navigate('/owner')}
                    className='text-sm lg:text-base hover:text-indigo-500 transition-colors cursor-pointer font-medium'
                >
                    Dashboard 
                </button>

                {/* If logged in but not owner, show Become Owner */}
                {token && user && user.role !== 'owner' && (
                    <button
                        onClick={async () => {
                            try {
                                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3020'
                                const res = await fetch(`${apiUrl}/api/owner/changerole`, {
                                    method: 'POST',
                                    headers: { Authorization: `Bearer ${token}` }
                                })
                                const d = await res.json()
                                if (d && d.success) {
                                    window.dispatchEvent(new Event('authChange'))
                                    alert('Role changed to owner. You can now add cars.')
                                } else {
                                    alert(d.message || 'Failed to change role')
                                }
                            } catch (err) {
                                console.error(err)
                                alert('Error switching role')
                            }
                        }}
                        className='text-sm px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors cursor-pointer font-medium'
                    >
                        Become Owner
                    </button>
                )}

                {token ? (
                    <button 
                        onClick={handleLogout}
                        className='text-sm px-4 sm:px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer font-medium'
                    >
                        Logout
                    </button>
                ) : (
                    <button 
                        onClick={() => setShowLogin(true)}
                        className='text-sm px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer font-medium'
                    >
                        Login
                    </button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button 
                className='md:hidden cursor-pointer p-1' 
                aria-label='Menu' 
                onClick={() => setOpen(!open)}
            >
                <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" className='w-6 h-6' />
            </button>

            {/* Mobile Menu */}
            {open && (
                <div className={`fixed md:hidden top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40 p-4 sm:p-6 max-h-[calc(100vh-4rem)] overflow-y-auto`}>
                    <div className='flex flex-col gap-4'>
                        {/* Mobile Navigation Links */}
                        {menuLinks.map((link, index) => (
                            <Link 
                                key={index} 
                                to={link.path}
                                onClick={closeMenu}
                                className='text-base font-medium hover:text-indigo-500 transition-colors py-2 border-b border-gray-100 last:border-0'
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Mobile Search */}
                        <div className='flex items-center gap-2 border border-gray-300 px-3 py-2.5 rounded-lg my-2'>
                            <input 
                                type="text" 
                                className='flex-1 bg-transparent outline-none placeholder-gray-500 text-sm' 
                                placeholder='Search cars...'
                            />
                            <img src={assets.search_icon} alt="search" className='w-4 h-4' />
                        </div>

                        <hr className='my-2' />

                        {/* Mobile Action Buttons */}
                        <button 
                            onClick={() => {
                                navigate('/owner')
                                closeMenu()
                            }}
                            className='text-base font-medium hover:text-indigo-500 transition-colors py-2 w-full text-left'
                        >
                            Dashboard
                        </button>

                        {token && user && user.role !== 'owner' && (
                            <button
                                onClick={async () => {
                                    try {
                                        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3020'
                                        const res = await fetch(`${apiUrl}/api/owner/changerole`, {
                                            method: 'POST',
                                            headers: { Authorization: `Bearer ${token}` }
                                        })
                                        const d = await res.json()
                                        if (d && d.success) {
                                            window.dispatchEvent(new Event('authChange'))
                                            alert('Role changed to owner!')
                                            closeMenu()
                                        } else {
                                            alert(d.message || 'Failed to change role')
                                        }
                                    } catch (err) {
                                        alert('Error switching role')
                                    }
                                }}
                                className='w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium text-sm'
                            >
                                Become Owner
                            </button>
                        )}

                        {token ? (
                            <button 
                                onClick={handleLogout}
                                className='w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium text-sm'
                            >
                                Logout
                            </button>
                        ) : (
                            <button 
                                onClick={() => {
                                    setShowLogin(true)
                                    closeMenu()
                                }}
                                className='w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm'
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar