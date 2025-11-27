import React, { useState } from 'react'
import { assets } from '../assets/assets'

const Login = ({ setShowLogin }) => {
    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3020'
            const endpoint = state === "login" 
                ? `${apiUrl}/api/user/login`
                : `${apiUrl}/api/user/register`

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ 
                    ...(state === "register" && { name }),
                    email, 
                    password 
                })
            })

            const data = await res.json()
            if (data.success) {
                if (state === "login") {
                    localStorage.setItem('token', data.token)
                    localStorage.setItem('user', JSON.stringify(data.user || { email }))
                    window.dispatchEvent(new Event('authChange'))
                    setShowLogin(false)
                    alert("✨ Welcome! Login successful!")
                } else {
                    alert("🎉 Account created! Please login with your credentials.")
                    setState("login")
                    setEmail("")
                    setPassword("")
                    setName("")
                }
            } else {
                setError(data.message || "Something went wrong")
            }
        } catch (err) {
            setError("Network error: " + err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setShowLogin(false)
        setError("")
    }

    return (
        <div 
            onClick={handleClose}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4 animate-fade-in'
        >
            <form 
                onSubmit={onSubmitHandler} 
                onClick={(e) => e.stopPropagation()} 
                className="w-full max-w-md bg-white dark:bg-dark-800 rounded-2xl shadow-2xl p-8 animate-slide-up"
            >
                {/* Close Button */}
                <button
                    type="button"
                    onClick={handleClose}
                    className='absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors'
                >
                    <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-dark-900 dark:text-white mb-2">
                        {state === "login" ? "Welcome Back" : "Create Account"}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {state === "login" 
                            ? "Sign in to your account to continue"
                            : "Join thousands of happy renters"}
                    </p>
                </div>

                {/* Name Field - Register Only */}
                {state === "register" && (
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                        <input 
                            onChange={(e) => setName(e.target.value)} 
                            value={name} 
                            placeholder="John Doe" 
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-dark-600 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-0 outline-none transition-colors bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" 
                            type="text" 
                            required 
                        />
                    </div>
                )}

                {/* Email Field */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <input 
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email} 
                        placeholder="you@example.com" 
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-dark-600 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-0 outline-none transition-colors bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" 
                        type="email" 
                        required 
                    />
                </div>

                {/* Password Field */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                    <input 
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password} 
                        placeholder="••••••••" 
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-dark-600 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-0 outline-none transition-colors bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" 
                        type="password" 
                        required 
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
                        <p className="text-red-700 dark:text-red-400 text-sm font-medium">⚠️ {error}</p>
                    </div>
                )}

                {/* Submit Button */}
                <button 
                    disabled={loading} 
                    className="w-full bg-gradient-primary hover:shadow-lg disabled:opacity-60 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                >
                    {loading ? (
                        <span className='flex items-center justify-center'>
                            <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        state === "register" ? "Create Account" : "Sign In"
                    )}
                </button>

                {/* Divider */}
                <div className="my-6 flex items-center">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-dark-700"></div>
                    <span className="px-3 text-sm text-gray-500 dark:text-gray-400">or</span>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-dark-700"></div>
                </div>

                {/* Toggle Auth State */}
                <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                    {state === "register" ? (
                        <>
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => {
                                    setState("login")
                                    setError("")
                                    setEmail("")
                                    setPassword("")
                                    setName("")
                                }}
                                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold hover:underline"
                            >
                                Sign In
                            </button>
                        </>
                    ) : (
                        <>
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={() => {
                                    setState("register")
                                    setError("")
                                }}
                                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold hover:underline"
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </p>
            </form>
        </div>
    )
}

export default Login