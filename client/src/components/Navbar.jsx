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
    const [darkMode, setDarkMode] = useState(false)

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Handle dark mode
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true'
        setDarkMode(savedDarkMode)
        if (savedDarkMode) {
            document.documentElement.classList.add('dark')
        }
    }, [])

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode
        setDarkMode(newDarkMode)
        localStorage.setItem('darkMode', newDarkMode)
        if (newDarkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

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
        <nav className={`sticky top-0 z-40 transition-all duration-300 ${
            scrolled 
                ? 'dark:bg-dark-900/95 dark:shadow-lg bg-white shadow-lg' 
                : 'dark:bg-dark-800/90 bg-white/80'
        } backdrop-blur-md`}>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
                <div className='flex items-center justify-between h-16'>
                    {/* Logo */}
                    <Link to="/" className='flex items-center gap-2 group'>
                        {assets.logo ? (
                            <img src={assets.logo} alt="logo" className='w-8 h-8 sm:w-10 sm:h-10' />
                        ) : (
                            <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-lg'></div>
                        )}
                        <span className='text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent group-hover:drop-shadow-lg transition-all'>
                            CarRent
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className='hidden md:flex items-center gap-8'>
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`font-medium transition-colors ${
                                    location.pathname === link.path
                                        ? 'text-primary-600 dark:text-primary-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side - Auth + Dark Mode */}
                    <div className='flex items-center gap-2 sm:gap-4'>
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className='p-2 rounded-lg dark:bg-dark-700 bg-gray-100 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors'
                        >
                            {darkMode ? '☀️' : '🌙'}
                        </button>

                        {token && user ? (
                            <div className='flex items-center gap-2 sm:gap-4'>
                                <span className='text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline'>
                                    {user.name || 'User'}
                                </span>
                                {user.role === 'owner' && (
                                    <Link to="/owner" className='px-3 sm:px-4 py-2 text-sm bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors'>
                                        Dashboard
                                    </Link>
                                )}
                                {user.role !== 'owner' && (
                                    <button
                                        onClick={() => navigate('/owner')}
                                        className='px-3 sm:px-4 py-2 text-sm border-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-dark-700 transition-colors'
                                    >
                                        Become Owner
                                    </button>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className='px-3 sm:px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors'
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowLogin(true)}
                                className='px-4 sm:px-6 py-2 bg-gradient-primary hover:shadow-glow text-white font-semibold rounded-lg transition-all hover:scale-105 transform'
                            >
                                Login
                            </button>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setOpenMenu(!openMenu)}
                            className='md:hidden p-2 text-gray-700 dark:text-gray-300'
                        >
                            {openMenu ? (
                                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                </svg>
                            ) : (
                                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {openMenu && (
                    <div className='md:hidden border-t border-gray-200 dark:border-dark-700 pt-4 pb-4 animate-slide-down'>
                        <div className='space-y-2'>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={closeMenu}
                                    className={`block px-4 py-2 rounded-lg transition-colors ${
                                        location.pathname === link.path
                                            ? 'bg-primary-100 dark:bg-dark-700 text-primary-600 dark:text-primary-400 font-semibold'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {token && user ? (
                                <div className='space-y-2 border-t border-gray-200 dark:border-dark-700 pt-4'>
                                    <p className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
                                        {user.name || 'User'}
                                    </p>
                                    {user.role === 'owner' && (
                                        <Link to="/owner" onClick={closeMenu} className='block px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg text-sm'>
                                            Dashboard
                                        </Link>
                                    )}
                                    {user.role !== 'owner' && (
                                        <button
                                            onClick={() => {
                                                navigate('/owner')
                                                closeMenu()
                                            }}
                                            className='w-full text-left px-4 py-2 border-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 rounded-lg text-sm'
                                        >
                                            Become Owner
                                        </button>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className='w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm'
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        setShowLogin(true)
                                        closeMenu()
                                    }}
                                    className='w-full px-4 py-2 mt-4 bg-gradient-primary text-white font-semibold rounded-lg'
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
