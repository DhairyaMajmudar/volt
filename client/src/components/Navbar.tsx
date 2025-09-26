import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '@/components';

export const Navbar = () => {
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem('token');
  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') as string)
    : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
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

          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <span className="text-gray-600 font-semibold">
                  Welcome, {user?.username || 'User'}!
                </span>
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
                  className="text-gray-700 hover:text-blue-700 transition-colors duration-200  px-4 py-2 hover:bg-gray-100 rounded-sm font-semibold"
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
        </div>
      </div>
    </nav>
  );
};
