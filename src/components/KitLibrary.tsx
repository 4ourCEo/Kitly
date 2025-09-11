import React, { useState, useEffect } from 'react'
import { mockKits, type Kit } from '../data/kits'
import { getKits } from '../lib/supabase'
import KitDetailModal from './KitDetailModal'

const KitLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedKit, setSelectedKit] = useState<Kit | null>(null)
  const [kits, setKits] = useState<Kit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadKits()
  }, [])

  const loadKits = async () => {
    try {
      const { data, error } = await getKits()
      if (error) {
        throw error
      }
      setKits(data || [])
    } catch (err) {
      console.error('Error loading kits:', err)
      // Fallback to mock data for development
      setKits(mockKits)
      setError('Using demo data - database connection needed')
    } finally {
      setLoading(false)
    }
  }

  const filteredKits = kits.filter((kit) =>
    kit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kit.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent absolute top-0 left-0"></div>
          <div className="mt-4 text-center">
            <p className="text-purple-600 font-medium animate-pulse">Loading amazing kits... ✨</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-24 lg:py-32" style={{backgroundColor: 'var(--ui-gray)'}}>
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight" style={{color: 'var(--kitly-blue)'}}>
              Launch with Confidence
              <span className="block mt-2 text-gray-600 text-3xl md:text-4xl lg:text-5xl font-normal">
                Your genius, packaged for the world
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
              Turn your technical brilliance into compelling marketing that resonates with customers. 
              Pre-built templates and strategic guidance to accelerate your go-to-market timeline.
            </p>
            
            {/* Value Props */}
            <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-2xl" style={{backgroundColor: 'var(--accent-green)', color: 'white'}}>
                  ⚡
                </div>
                <h3 className="font-bold text-lg mb-2" style={{color: 'var(--kitly-blue)'}}>Accelerate Launch</h3>
                <p className="text-gray-600">Reduce your go-to-market timeline by 50% with pre-built, proven templates</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-2xl" style={{backgroundColor: 'var(--kitly-blue)', color: 'white'}}>
                  🎯
                </div>
                <h3 className="font-bold text-lg mb-2" style={{color: 'var(--kitly-blue)'}}>Build Authority</h3>
                <p className="text-gray-600">Professional templates that establish credibility with customers and investors</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-2xl" style={{backgroundColor: 'var(--accent-green)', color: 'white'}}>
                  📈
                </div>
                <h3 className="font-bold text-lg mb-2" style={{color: 'var(--kitly-blue)'}}>Drive Growth</h3>
                <p className="text-gray-600">Curated marketing strategies designed to attract and convert your first 100 users</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {error && (
          <div className="mb-8 mx-auto max-w-md">
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-orange-500 mr-2">⚠️</span>
                <span className="text-orange-800 font-medium">{error}</span>
              </div>
            </div>
          </div>
        )}
      
        {/* Search Section */}
        <div className="mb-16">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold mb-4" style={{color: 'var(--kitly-blue)'}}>
              Choose Your Kit
            </h2>
            <p className="text-gray-600 text-lg">Expertly curated marketing templates for technical founders</p>
          </div>
          <div className="max-w-lg mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name or category..."
                value={searchTerm}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {filteredKits.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2" style={{color: 'var(--kitly-blue)'}}>No kits found</h3>
            <p className="text-gray-600 text-lg mb-6">Try adjusting your search or browse all available kits</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="font-semibold py-3 px-6 rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105 text-white"
              style={{backgroundColor: 'var(--accent-green)'}}
            >
              Show All Kits
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredKits.map((kit, index) => (
              <div 
                key={kit.id} 
                className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  {kit.image_url && (
                    <img 
                      src={kit.image_url} 
                      alt={kit.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <span className="inline-block text-xs px-3 py-1 rounded-full font-medium border" style={{backgroundColor: 'var(--ui-gray)', color: 'var(--kitly-blue)', borderColor: 'var(--gray-200)'}}>
                      {kit.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{color: 'var(--kitly-blue)'}}>
                    {kit.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {kit.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <span className="text-2xl font-bold" style={{color: 'var(--accent-green)'}}>
                        ${kit.price}
                      </span>
                      <div className="text-xs text-gray-500">one-time purchase</div>
                    </div>
                    <button 
                      className="font-semibold py-2 px-4 rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105 text-white"
                      style={{backgroundColor: 'var(--kitly-blue)'}}
                      onClick={() => setSelectedKit(kit)}
                    >
                      View Kit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedKit && <KitDetailModal kit={selectedKit} onClose={() => setSelectedKit(null)} />}
    </div>
  )
}

export default KitLibrary;