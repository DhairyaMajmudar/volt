import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CloseIcon, Hamburger, Logo } from '@/components';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = !!localStorage.getItem('token');
  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') as string)
    : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to={'/'}
            onClick={() => {
              setIsMenuOpen(false);
            }}
          >
            <span className="flex items-center text-lg font-semibold gap-2">
              <Logo />
              Volt
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <span className="text-gray-600 font-semibold">
                  Welcome, {user?.username || 'User'}!
                </span>

                <Link to="/dashboard">
                  <button
                    type="button"
                    className={`text-gray-700 hover:text-blue-700 transition-colors duration-200 font-medium px-3 py-2 hover:bg-gray-50 rounded-sm cursor-pointer ${
                      location.pathname === '/dashboard' ? 'hidden' : ''
                    }`}
                  >
                    Dashboard
                  </button>
                </Link>

                <Link to="/profile">
                  <button
                    type="button"
                    className={`text-gray-700 hover:text-blue-700 transition-colors duration-200 font-medium px-3 py-2 hover:bg-gray-50 rounded-sm cursor-pointer ${
                      location.pathname === '/profile' ? 'hidden' : ''
                    }`}
                  >
                    Profile
                  </button>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-700 transition-colors duration-200 font-medium px-3 py-2 hover:bg-gray-50 rounded-sm cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-700 transition-colors duration-200 px-4 py-2 hover:bg-gray-100 rounded-sm font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-200 font-semibold text-base shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700  cursor-pointer hover:text-blue-700  focus:outline-none focus:text-blue-700 p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <CloseIcon /> : <Hamburger />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-gray-600 font-semibold border-b border-gray-100">
                    Welcome, {user?.username || 'User'}!
                  </div>

                  {location.pathname !== '/dashboard' && (
                    <Link
                      to="/dashboard"
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      className="block px-3 py-2 text-gray-700 hover:text-blue-700 hover:bg-gray-50 rounded-md transition-colors duration-200 font-medium"
                    >
                      Dashboard
                    </Link>
                  )}

                  {location.pathname !== '/profile' && (
                    <Link
                      to="/profile"
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      className="block px-3 py-2 text-gray-700 hover:text-blue-700 hover:bg-gray-50 rounded-md transition-colors duration-200 font-medium"
                    >
                      Profile
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-red-700 hover:bg-gray-50 rounded-md transition-colors duration-200 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                    className="block px-3 py-2 text-gray-700 hover:text-blue-700 hover:bg-gray-50 rounded-md transition-colors duration-200 font-semibold"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                    className="block mx-3 my-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-200 font-semibold text-center shadow-md"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
