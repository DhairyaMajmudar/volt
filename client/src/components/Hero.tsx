import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section className="relative pt-8 md:pt-16 pb-20 md:pb-32 overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full max-w-6xl">
        <div className="absolute top-10 md:top-20 left-5 md:left-10 w-48 h-48 md:w-72 md:h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute top-10 md:top-20 right-5 md:right-10 w-48 h-48 md:w-72 md:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-10 md:bottom-20 left-1/2 transform -translate-x-1/2 w-48 h-48 md:w-72 md:h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs md:text-sm font-medium mb-6 md:mb-8">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse" />
            New: Advanced file management features
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 md:mb-8 leading-tight px-2">
            Manage Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {' '}
              Files
            </span>{' '}
            Like Never Before
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            Experience the future of file management with Volt. Secure, fast,
            and intuitive - everything you need to organize your digital life.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-blue-600 text-white px-6 md:px-8 py-3 md:py-3.5 rounded-md hover:bg-blue-700 transition-all duration-200 font-medium text-base md:text-lg shadow-md text-center"
            >
              Start Free Trial
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </Link>
            <button
              type="button"
              className="w-full sm:w-auto bg-white text-gray-700 px-6 md:px-8 py-3 md:py-3.5 rounded-md border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-medium text-base md:text-lg shadow-sm hover:shadow-md"
            >
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
