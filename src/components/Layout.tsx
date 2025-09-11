import { Link, Outlet } from "react-router-dom";
import { useUserStore } from '../store/userStore';

function Layout() {
  const { isAuthenticated, logout } = useUserStore();

  return (
    <div className="App min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-all duration-200 shadow-lg" style={{backgroundColor: 'var(--kitly-blue)'}}>
                  <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center relative">
                    <div className="w-3 h-3 bg-gradient-to-tr from-green-400 to-green-500 rounded-sm transform rotate-45 origin-center" style={{backgroundColor: 'var(--accent-green)'}}></div>
                  </div>
                </div>
                <span className="text-2xl font-bold text-gray-900" style={{color: 'var(--kitly-blue)'}}>
                  Kitly
                </span>
                <span className="hidden sm:block text-sm text-gray-500 font-medium">
                  Launch with Confidence
                </span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-6">
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="text-gray-700 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      Dashboard
                    </Link>
                    <button 
                      onClick={logout} 
                      className="text-gray-600 hover:text-gray-800 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="text-gray-700 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/signup" 
                      className="font-semibold py-2 px-6 rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105 text-white" 
                      style={{backgroundColor: 'var(--accent-green)'}}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout;