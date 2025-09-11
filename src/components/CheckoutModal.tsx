import React, { useState } from 'react'
import { useUserStore } from '../store/userStore'
import { createCheckoutSession } from '../lib/stripe'
import type { Kit } from '../data/kits'

interface CheckoutModalProps {
  kit: Kit
  onClose: () => void
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ kit, onClose }) => {
  const { user } = useUserStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePurchase = async () => {
    if (!user) {
      setError('Please log in to purchase')
      return
    }

    setLoading(true)
    setError('')

    try {
      await createCheckoutSession(kit.id, user.id)
      // User will be redirected to Stripe Checkout
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create checkout session')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl overflow-hidden transform animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">🛒</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-2">
            Secure Checkout
          </h2>
          <p className="text-gray-600">You're one step away from greatness! 🎆</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 rounded-xl animate-slide-in-right">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </div>
          </div>
        )}
        
        {/* Kit Details */}
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl p-6 mb-8">
          <div className="flex items-start space-x-4">
            {kit.image_url && (
              <img 
                src={kit.image_url} 
                alt={kit.name}
                className="w-20 h-20 object-cover rounded-xl shadow-lg"
              />
            )}
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{kit.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">{kit.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  ${kit.price}
                </span>
                <div className="flex items-center text-yellow-500 text-sm">
                  <span className="mr-1">⭐</span>
                  <span className="font-semibold">Premium</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features */}
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center bg-white border border-purple-100 rounded-xl p-3">
              <span className="mr-2">💾</span>
              <span className="text-gray-700">Instant Download</span>
            </div>
            <div className="flex items-center bg-white border border-purple-100 rounded-xl p-3">
              <span className="mr-2">♾️</span>
              <span className="text-gray-700">Lifetime Access</span>
            </div>
            <div className="flex items-center bg-white border border-purple-100 rounded-xl p-3">
              <span className="mr-2">🔒</span>
              <span className="text-gray-700">Secure Payment</span>
            </div>
            <div className="flex items-center bg-white border border-purple-100 rounded-xl p-3">
              <span className="mr-2">🏆</span>
              <span className="text-gray-700">Commercial Use</span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Processing Payment...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <span className="mr-2">🚀</span>
                Purchase with Stripe - ${kit.price}
              </span>
            )}
          </button>
          
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-2xl transition-all duration-200 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
        
        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center text-xs text-gray-500 bg-gray-50 rounded-xl py-3 px-4">
            <span className="mr-2">🔒</span>
            <span>Secure payment powered by Stripe • SSL encrypted • Money-back guarantee</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutModal;