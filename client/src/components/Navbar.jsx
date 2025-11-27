import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {assets,menuLinks} from '../assets/assets'

const Navbar = ({setShowLogin}) => {
    const location = useLocation()
    const [open,setOpen]=useState(false)
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
        navigate('/')
    }
    
  return (
    <div className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b borderColor relative transition-all ${location.pathname==="/"&&"bg-light"}`}>
        
        <Link to='/'>
        <img src={assets.logo} alt="logo" className='h-8'/>
        </Link>
        <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max:sm p-4 tansition-all duration-300 z-50 ${location.pathname==="/"?"bg-light":"bg-white"}${open?"max-sm:translate-x-0":"max-sm:translate-x-full"}`}>
            {menuLinks.map((link,index)=>(
                <Link key={index} to={link.path}>
                {link.name}
                </Link>
            ))}

            <div className='hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56'>
                <input type="text" className='py-1.5 w-full bg-transparent outline-none placeholder-gray-500 'placeholder='Search Products'/>
                <img src={assets.search_icon} alt="search" />
            </div>
            <div className='flex mx-sm:flex-col items-start sm:items-center gap-6'>
                <button onClick={()=>navigate('/owner')}className='cursor-pointer'>
                    Dashboard 
                </button>
                {/* If logged in but not owner, show Become Owner */}
                {token && user && user.role !== 'owner' && (
                    <button
                        onClick={async ()=>{
                            try{
                                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3020'
                                const res = await fetch(`${apiUrl}/api/owner/changerole`,{
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
                            }catch(err){
                                console.error(err)
                                alert('Error switching role')
                            }
                        }}
                        className='cursor-pointer px-3 py-1 bg-green-600 text-white rounded-lg'
                    >Become Owner</button>
                )}
                {token ? (
                    <button onClick={handleLogout}className='cursor-pointer px-8 py-2 bg-red-500 hover:bg-red-600 transition-all text-white rounded-lg'>
                        Logout
                    </button>
                ) : (
                    <button onClick={()=>setShowLogin(true)}className='cursor-pointer px-8 py-2 bg-blue-600 hover:bg-blue-700 transition-all text-white rounded-lg'>Login</button>
                )}
            </div>
        </div>

        <button className='sm:hidden cursor-pointer' aria-label='Menu' onClick={()=>setOpen(!open)}>
            <img src={open ? assets.close_icon:assets.menu_icon} alt="menu" />
        </button>
       
    </div>
  )
}

export default Navbar