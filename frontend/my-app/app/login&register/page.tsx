'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setToken } from '@/utils/token';

const API_BASE_URL = 'http://localhost:5000/api/auth';

export default function LoginRegisterPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const endpoint = isLogin ? `${API_BASE_URL}/login` : `${API_BASE_URL}/register`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            // JWT token store karo localStorage me
            if (data.token) {
                setToken(data.token);
                setSuccess(data.message || (isLogin ? 'Login successful!' : 'Registration successful!'));
                
                // 1 second baad redirect to dashboard
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1000);
            } else if (isLogin) {
                throw new Error('Token not received from server');
            } else {
                setSuccess(data.message || 'Registration successful! Please login.');
                setIsLogin(true);
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                {/* Title */}
                <h1 className="text-3xl font-bold text-black mb-6 text-center">
                    Login Form
                </h1>

                {/* Toggle Tabs */}
                <div className="flex bg-gray-100 rounded-full p-1 mb-6">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 px-4 rounded-full font-semibold transition-all ${
                            isLogin
                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md'
                                : 'text-black hover:text-gray-700'
                        }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 px-4 rounded-full font-semibold transition-all ${
                            !isLogin
                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md'
                                : 'text-black hover:text-gray-700'
                        }`}
                    >
                        Signup
                    </button>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                        {success}
                    </div>
                )}

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    {/* Email Input */}
                    <div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                            required
                        />
                    </div>

                    {/* Forgot Password Link */}
                    {isLogin && (
                        <div className="text-left">
                            <a
                                href="#"
                                className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                            >
                                Forgot password?
                            </a>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? 'Processing...' : isLogin ? 'Login' : 'Signup'}
                    </button>
                </form>

                {/* Bottom Text */}
                <div className="mt-6 text-center text-sm">
                    <span className="text-black">
                        {isLogin ? 'Not a member? ' : 'Already a member? '}
                    </span>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                        {isLogin ? 'Signup now' : 'Login now'}
                    </button>
                </div>
            </div>
        </div>
    );
}