import React, { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { mockKits, type Kit, type KitAsset } from '../data/kits'
import { useUserStore } from '../store/userStore'
import { getKit } from '../lib/supabase'

const EditorPage: React.FC = () => {
  const { kitId } = useParams<{ kitId: string }>()
  const { purchasedKits } = useUserStore()
  const [kit, setKit] = useState<Kit | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<KitAsset | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadKit()
  }, [kitId])
  
  const loadKit = async () => {
    if (!kitId) return
    
    try {
      const { data, error } = await getKit(kitId)
      if (error) throw error
      
      const loadedKit = data || mockKits.find(k => k.id === kitId)
      setKit(loadedKit || null)
      setSelectedAsset(loadedKit?.assets[0] || null)
    } catch (error) {
      console.error('Error loading kit:', error)
      // Fallback to mock data
      const mockKit = mockKits.find(k => k.id === kitId)
      setKit(mockKit || null)
      setSelectedAsset(mockKit?.assets[0] || null)
    } finally {
      setLoading(false)
    }
  }
  
  // Check if user owns this kit
  const hasAccess = kit && purchasedKits.some(userKit => userKit.kit_id === kit.id)
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!kit) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Kit not found</h2>
          <p className="text-gray-600">The requested kit could not be found.</p>
        </div>
      </div>
    )
  }
  
  if (!hasAccess) {
    return <Navigate to="/" replace />
  }

  const renderEditor = () => {
    if (!selectedAsset) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-lg text-gray-600">Select an asset from the sidebar to start editing</p>
          </div>
        </div>
      )
    }

    switch (selectedAsset.type) {
      case 'template':
        return (
          <div className="h-full flex flex-col">
            <h3 className="text-2xl font-bold mb-4">{selectedAsset.name}</h3>
            <p className="text-gray-600 mb-6">{selectedAsset.description}</p>
            <textarea 
              className="flex-1 w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" 
              defaultValue={`# ${selectedAsset.name}\n\n${selectedAsset.description}\n\nStart editing your template here...`}
              placeholder="Start editing your template..."
            />
            <div className="mt-4 flex gap-2">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">Save Changes</button>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">Download</button>
            </div>
          </div>
        )
      case 'text':
        return (
          <div className="h-full flex flex-col">
            <h3 className="text-2xl font-bold mb-4">{selectedAsset.name}</h3>
            <p className="text-gray-600 mb-6">{selectedAsset.description}</p>
            <div className="flex-1 bg-gray-50 rounded-lg p-6">
              <p className="text-lg font-semibold mb-4">Text Editor</p>
              <textarea 
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                defaultValue={`Content for ${selectedAsset.name}\n\nEdit your copy here...`}
                placeholder="Start writing your content..."
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">Save Changes</button>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">Download as .txt</button>
            </div>
          </div>
        )
      case 'graphic':
        return (
          <div className="h-full flex flex-col">
            <h3 className="text-2xl font-bold mb-4">{selectedAsset.name}</h3>
            <p className="text-gray-600 mb-6">{selectedAsset.description}</p>
            <div className="flex-1 bg-gray-50 rounded-lg p-6 flex items-center justify-center">
              <div className="text-center">
                <div className="bg-white w-96 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
                  <p className="text-gray-500">Graphics Editor (Coming Soon)</p>
                </div>
                <p className="text-sm text-gray-600">Advanced graphics editing will be available soon</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button disabled className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">Save Changes</button>
              <button disabled className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">Download</button>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-lg text-gray-600">Select an asset to start editing</p>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/4 bg-white border-r border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{kit.name}</h2>
          <p className="text-sm text-gray-600">Assets ({kit.assets.length})</p>
        </div>
        <ul className="space-y-2">
          {kit.assets.map((asset) => (
            <li key={asset.id}>
              <button
                className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                  selectedAsset?.id === asset.id 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                onClick={() => setSelectedAsset(asset)}
              >
                <div className="font-medium">{asset.name}</div>
                <div className={`text-sm mt-1 ${
                  selectedAsset?.id === asset.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 p-8">
        {renderEditor()}
      </div>
    </div>
  )
};

export default EditorPage;