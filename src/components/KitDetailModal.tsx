import React, { useState } from 'react'
import type { Kit } from '../data/kits'
import CheckoutModal from './CheckoutModal'
import { useUserStore } from '../store/userStore'

interface KitDetailModalProps {
  kit: Kit
  onClose: () => void
}

const KitDetailModal: React.FC<KitDetailModalProps> = ({ kit, onClose }) => {
  const [showCheckout, setShowCheckout] = useState(false)
  const { isAuthenticated, purchasedKits } = useUserStore()
  const isPurchased = purchasedKits.some(userKit => userKit.kit_id === kit.id)

  const handleBuy = () => {
    setShowCheckout(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full flex items-center justify-center z-40 p-4 animate-fade-in">
        <div className="relative mx-auto max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden transform animate-scale-in">
          {/* Header */}
          <div className="relative p-8" style={{backgroundColor: 'var(--ui-gray)'}}>
            <div className="flex justify-between items-start mb-6">
              <span className="inline-block text-xs px-3 py-1 rounded-full font-medium border" style={{backgroundColor: 'var(--ui-white)', color: 'var(--kitly-blue)', borderColor: 'var(--gray-200)'}}>
                {kit.category}
              </span>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 hover:bg-white rounded-full p-2 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <h3 className="text-3xl font-bold mb-4" style={{color: 'var(--kitly-blue)'}}>{kit.name}</h3>
            <p className="text-gray-700 text-lg leading-relaxed">{kit.description}</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-8">
              <h4 className="text-xl font-bold mb-6" style={{color: 'var(--kitly-blue)'}}>
                What's included in this kit:
              </h4>
              <div className="space-y-4">
                {kit.assets.map((asset, index) => (
                  <div 
                    key={asset.id} 
                    className="flex items-start p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0 text-white font-semibold" style={{backgroundColor: 'var(--accent-green)'}}>
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <h5 className="font-semibold mb-1" style={{color: 'var(--kitly-blue)'}}>{asset.name}</h5>
                      <p className="text-sm text-gray-600 mb-2">{asset.description}</p>
                      <span className="inline-block text-xs px-2 py-1 rounded font-medium" style={{backgroundColor: 'var(--ui-gray)', color: 'var(--kitly-blue)'}}>
                        {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price and Actions */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-3xl font-bold" style={{color: 'var(--accent-green)'}}>
                    ${kit.price}
                  </div>
                  <div className="text-sm text-gray-500">One-time purchase • Lifetime access</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium mb-1" style={{color: 'var(--kitly-blue)'}}>
                    ✓ Expert Curated
                  </div>
                  <div className="text-sm text-gray-600">Instant download</div>
                </div>
              </div>
              
              <div className="space-y-4">
                {isAuthenticated && !isPurchased && (
                  <button
                    onClick={handleBuy}
                    className="w-full font-bold py-4 px-6 rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105 text-white"
                    style={{backgroundColor: 'var(--accent-green)'}}
                  >
                    Get This Kit →
                  </button>
                )}
                
                {isPurchased && (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center px-6 py-3 rounded-lg font-semibold border" style={{backgroundColor: 'var(--ui-gray)', color: 'var(--accent-green)', borderColor: 'var(--accent-green)'}}>
                      <span className="mr-2">✓</span>
                      Kit Purchased - Ready to Use
                    </div>
                  </div>
                )}
                
                {!isAuthenticated && (
                  <div className="text-center py-4">
                    <div className="bg-orange-50 border border-orange-200 text-orange-800 px-6 py-3 rounded-lg font-medium">
                      Sign in to purchase this kit
                    </div>
                  </div>
                )}
                
                <button
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showCheckout && <CheckoutModal kit={kit} onClose={() => setShowCheckout(false)} />}
    </>
  )
};

export default KitDetailModal;
