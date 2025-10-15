import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { signIn, error, clearError } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        clearError()
        setIsLoading(true)

        try {
            const { error } = await signIn(email, password)
            if (!error) {
                // Redirect or show success message
                console.log('Login successful!')
            }
        } catch (err) {
            console.error('Login error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
            
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                        required
                    />
                </div>
                
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                        required
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
            </form>
        </div>
    )
}

export default LoginForm;
