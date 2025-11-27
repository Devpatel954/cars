import React from 'react'

const Login = ({setShowLogin}) => {
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const endpoint = state === "login" 
                ? "http://localhost:3020/api/user/login"
                : "http://localhost:3020/api/user/register"

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    ...(state === "register" && { name }),
                    email, 
                    password 
                })
            })

            const data = await res.json()
            if (data.success) {
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user || { email }))
                setShowLogin(false)
                alert(state === "login" ? "Login successful!" : "Account created!")
            } else {
                setError(data.message || "Something went wrong")
            }
        } catch (err) {
            setError("Network error: " + err.message)
        } finally {
            setLoading(false)
        }
    }
  return (
    <div onClick = {()=>setShowLogin(false)}className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm tex-gray-600 bg-black/50'>

<form onSubmit={onSubmitHandler} onClick = {(e)=>e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-indigo-500">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="text" required />
                </div>
            )}
            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="email" required />
            </div>
            <div className="w-full ">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="password" required />
            </div>
            {state === "register" ? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-indigo-500 cursor-pointer">click here</span>
                </p>
            ) : (
                <p>
                    Create an account? <span onClick={() => setState("register")} className="text-indigo-500 cursor-pointer">click here</span>
                </p>
            )}
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button disabled={loading} className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50">
                {loading ? "Loading..." : (state === "register" ? "Create Account" : "Login")}
            </button>
        </form>




    </div>
  )
}

export default Login