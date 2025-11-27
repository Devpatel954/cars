import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Navbar = ({ setShowLogin }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const [openMenu, setOpenMenu] = useState(false)
    const [token, setToken] = useState('')
    const [user, setUser] = useState(null)
    const [scrolled, setScrolled] = useState(false)

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

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
        setOpenMenu(false)
        window.dispatchEvent(new Event('authChange'))
        navigate('/')
    }

    const closeMenu = () => {
        setOpenMenu(false)
    }

    const navLinks = [
        { label: 'Home', path: '/' },
        { label: 'Cars', path: '/cars' },
        { label: 'My Bookings', path: '/bookings' },
    ]

    return (
        <nav className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg backdrop-blur-md' : 'bg-white/80 backdrop-blur-md'}`}>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-16 sm:h-20'>
                    
                    {/* Logo */}
                    <Link to='/' className='flex-shrink-0 flex items-center gap-2 group'>
                        <div className='p-2 bg-gradient-primary rounded-xl group-hover:shadow-glow transition-all duration-300'>
                            <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                            </svg>
                        </div>
                        <span className='text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent hidden sm:inline'>CarRent</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className='hidden md:flex items-center gap-8'>
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`font-medium transition-colors duration-200 ${
                                    location.pathname === link.path
                                        ? 'text-primary-600'
                                        : 'text-gray-700 hover:text-primary-600'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Section - Desktop */}
                    <div className='hidden md:flex items-center gap-4'>
                        <button
                            onClick={() => navigate('/owner')}
                            className='px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors'
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
                                            alert('✨ Role changed! You can now add cars.')
                                        } else {
                                            alert(d.message || 'Failed to change role')
                                        }
                                    } catch (err) {
                                        alert('Error switching role')
                                    }
                                }}
                                className='px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg font-medium transition-all hover:shadow-lg'
                            >
                                Become Owner
                            </button>
                        )}

                        {token ? (
                            <button
                                onClick={handleLogout}
                                className='px-6 py-2 bg-gradient-primary hover:shadow-lg text-white rounded-lg font-semibold transition-all hover:scale-105'
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowLogin(true)}
                                className='px-6 py-2 bg-gradient-primary hover:shadow-lg text-white rounded-lg font-semibold transition-all hover:scale-105'
                            >
                                Login
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setOpenMenu(!openMenu)}
                        className='md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'
                    >
                        {openMenu ? (
                            <svg className='w-6 h-6 text-gray-900' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        ) : (
                            <svg className='w-6 h-6 text-gray-900' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {openMenu && (
                <div className='md:hidden bg-white border-t border-gray-200 animate-slide-down'>
                    <div className='px-4 py-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto'>
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={closeMenu}
                                className={`block px-4 py-2.5 rounded-lg font-medium transition-colors ${
                                    location.pathname === link.path
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <hr className='my-3' />

                        <button
                            onClick={() => {
                                navigate('/owner')
                                closeMenu()
                            }}
                            className='w-full block text-left px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors'
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
                                            alert('✨ Role changed!')
                                            closeMenu()
                                        } else {
                                            alert(d.message || 'Failed')
                                        }
                                    } catch (err) {
                                        alert('Error')
                                    }
                                }}
                                className='w-full px-4 py-2.5 bg-accent-600 hover:bg-accent-700 text-white rounded-lg font-medium transition-all'
                            >
                                Become Owner
                            </button>
                        )}

                        <hr className='my-3' />

                        {token ? (
                            <button
                                onClick={handleLogout}
                                className='w-full px-4 py-2.5 bg-gradient-primary hover:shadow-lg text-white rounded-lg font-semibold transition-all'
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setShowLogin(true)
                                    closeMenu()
                                }}
                                className='w-full px-4 py-2.5 bg-gradient-primary hover:shadow-lg text-white rounded-lg font-semibold transition-all'
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