"use client";

import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await auth.signIn(username, password);
      router.push('/home');
    } catch (error) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="flex-1 flex items-center justify-center bg-gray-100 p-8">
        <img src="/mascot/main.png" alt="CVSwitch Logo" className="w-40 h-40" />
      </div>
      <div className="flex-1 flex flex-col justify-center p-8 bg-white">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">CVSwitch</h1>
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-700">Build Your Dream Resume in Minutes</h2>
        
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg px-6 py-3 text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Demo credentials:</p>
          <p>Username: demo</p>
          <p>Password: demo123</p>
        </div>
      </div>
    </div>
  );
}
