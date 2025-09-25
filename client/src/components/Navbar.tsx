import { Link } from 'react-router-dom';
import { Logo } from '@/components';

export const Navbar = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') as string)
    : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className="border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={'/'}>
            <span className="flex items-center text-lg font-semibold gap-2">
              <Logo />
              Volt
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700 font-medium">
                  Welcome, {user?.username || 'User'}!
                </span>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
