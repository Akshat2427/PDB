import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-hot-toast";
import { useDispatch } from 'react-redux'
import { login } from '../store/user'
export default function Login() {

    const [secretString, setSecretString] = useState(null)
    const [secretPassword, setSecretPassword] = useState(null)
    const [bypass, setBypass] = useState(false)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_name: username,
                password: password,
                otp: otp,
                secret_string: secretString,
                secret_password: secretPassword,
                bypass: bypass,
            }),
        })
        const data = await response.json()
        console.log(data)
        if (data.success) {
            dispatch(login(data.userId))
            navigate('/dashboard')
        } else {
            toast.error('Invalid username or password')
        }
    }

    useEffect(() => {
        const fetchSecretString = async () => {
            const response = await fetch('http://localhost:3000/api/login')
            const data = await response.json()
            setSecretString(data.secret_string)
            setSecretPassword(data.secret_password)
            setBypass(data.bypass)
            console.log(data)
        }
        fetchSecretString()
    }, [])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <Card text={secretString} />
            <div className="w-full max-w-sm bg-white rounded-lg shadow p-8 mt-4">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">Login</h1>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        name="username"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        name="password"
                    />
                    <input 
                        type="text" 
                        placeholder="OTP" 
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        name="otp"
                    />
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
