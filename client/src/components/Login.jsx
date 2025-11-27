import React, { useState } from 'react'

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
                // Only log in after successful login, not after registration
                if (state === "login") {
                    try {
                        localStorage.setItem('token', data.token)
                        localStorage.setItem('user', JSON.stringify(data.user || { email }))
                        window.dispatchEvent(new Event('authChange'))
                    } catch (e) {
                        console.error('Storage error:', e)
                    }
                    setShowLogin(false)
                    alert("Login successful!")
                } else {
                    // After registration, ask user to login
                    alert("Account created! Please login with your credentials.")
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
            console.error('Login error:', err)
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
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
        >
            <form 
                onSubmit={onSubmitHandler} 
                onClick={(e) => e.stopPropagation()} 
                className="flex flex-col gap-4 w-full max-w-sm sm:max-w-md p-6 sm:p-8 text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
            >
                <div className="text-center mb-2">
                    <p className="text-2xl sm:text-3xl font-medium">
                        <span className="text-indigo-500">User</span> {state === "login" ? "Login" : "Sign Up"}
                    </p>
                </div>

                {state === "register" && (
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                        <input 
                            onChange={(e) => setName(e.target.value)} 
                            value={name} 
                            placeholder="Enter your name" 
                            className="border border-gray-200 rounded w-full p-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-300 transition-all" 
                            type="text" 
                            required 
                        />
                    </div>
                )}

                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <input 
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email} 
                        placeholder="Enter your email" 
                        className="border border-gray-200 rounded w-full p-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-300 transition-all" 
                        type="email" 
                        required 
                    />
                </div>

                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                    <input 
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password} 
                        placeholder="Enter your password" 
                        className="border border-gray-200 rounded w-full p-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-300 transition-all" 
                        type="password" 
                        required 
                    />
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                        {error}
                    </div>
                )}

                <button 
                    disabled={loading} 
                    className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 transition-all text-white w-full py-2.5 rounded-lg cursor-pointer font-medium disabled:opacity-75"
                >
                    {loading ? "Processing..." : (state === "register" ? "Create Account" : "Login")}
                </button>

                <div className="text-center text-sm">
                    {state === "register" ? (
                        <p>
                            Already have account? {' '}
                            <span 
                                onClick={() => {
                                    setState("login")
                                    setError("")
                                    setEmail("")
                                    setPassword("")
                                    setName("")
                                }} 
                                className="text-indigo-500 cursor-pointer hover:underline font-medium"
                            >
                                Login here
                            </span>
                        </p>
                    ) : (
                        <p>
                            Don't have account? {' '}
                            <span 
                                onClick={() => {
                                    setState("register")
                                    setError("")
                                }} 
                                className="text-indigo-500 cursor-pointer hover:underline font-medium"
                            >
                                Sign up here
                            </span>
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleClose}
                    className="text-gray-500 hover:text-gray-700 text-sm mt-2 text-center w-full"
                >
                    Close
                </button>
            </form>
        </div>
    )
}

export default Login