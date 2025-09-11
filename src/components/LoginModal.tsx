import React, { useState } from 'react'
import { signIn, signInWithGoogle } from '../lib/supabase'

interface LoginModalProps {
  onClose: () => void
  onSwitchToSignUp: () => void
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await signIn(email, password)
      if (error) {
        throw new Error(error.message)
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      const { error } = await signInWithGoogle()
      if (error) {
        throw new Error(error.message)
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl overflow-hidden transform animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">K</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Welcome Back!
          </h2>
          <p className="text-gray-600">Sign in to access your amazing kits 🎉</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 rounded-xl animate-slide-in-right">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-3" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-purple-400">📬</span>
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-purple-200 rounded-2xl bg-purple-50/30 focus:ring-4 focus:ring-purple-300/50 focus:border-purple-400 transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-3" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-purple-400">🔒</span>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-purple-200 rounded-2xl bg-purple-50/30 focus:ring-4 focus:ring-purple-300/50 focus:border-purple-400 transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 mr-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Signing In...
                </span>
              ) : (
                'Sign In 🚀'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-4 text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
        
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-purple-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
          </div>
        </div>
        
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:transform-none mb-6 flex items-center justify-center space-x-3"
        >
          <span>🌈</span>
          <span>{loading ? 'Signing In...' : 'Sign in with Google'}</span>
        </button>
        
        <div className="text-center">
          <p className="text-gray-600">
            New to Kitly?{' '}
            <button 
              onClick={onSwitchToSignUp} 
              disabled={loading}
              className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
            >
              Create Account ✨
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginModal;