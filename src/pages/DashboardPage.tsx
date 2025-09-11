import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUserStore } from '../store/userStore'

const DashboardPage: React.FC = () => {
  const { purchasedKits, loading, loadPurchasedKits } = useUserStore()

  useEffect(() => {
    loadPurchasedKits()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent absolute top-0 left-0"></div>
          </div>
          <p className="text-purple-600 font-medium animate-pulse">Loading your awesome kits... 💼</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-4 left-4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-4 right-4 w-80 h-80 bg-yellow-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Welcome Back! 🎉
            </h1>
            <p className="text-xl text-white/90 mb-6">
              Your marketing arsenal awaits
            </p>
            <div className="flex justify-center items-center space-x-6 text-white/80">
              <span className="flex items-center">💼 {purchasedKits.length} Kits Owned</span>
              <span className="flex items-center">✨ Ready to Use</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
      
        {purchasedKits.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-8 animate-bounce">
              <div className="text-8xl mb-4">📦</div>
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Your Kit Collection Awaits!
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Start building your marketing empire with our professional templates
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <span className="mr-2">💼</span>
              Browse Amazing Kits
            </Link>
          </div>
        ) : (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your Marketing Toolkit 🎨
              </h2>
              <p className="text-gray-600">Click any kit to start creating amazing content</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {purchasedKits.map((userKit, index) => {
                const kit = userKit.kit
                if (!kit) return null
                
                return (
                  <div 
                    key={userKit.id} 
                    className="group bg-white/80 backdrop-blur-sm border border-purple-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-[1.02] hover:-translate-y-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative overflow-hidden">
                      {kit.image_url && (
                        <img 
                          src={kit.image_url} 
                          alt={kit.name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                          <span className="mr-1">✓</span>
                          OWNED
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-200">
                        {kit.name}
                      </h2>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {kit.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mb-6">
                        <span className="mr-2">📅</span>
                        Purchased {new Date(userKit.purchased_at).toLocaleDateString()}
                      </div>
                      <Link
                        to={`/editor/${kit.id}`}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                      >
                        <span>Start Creating</span>
                        <span className="text-lg">🎨</span>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage;
