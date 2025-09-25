import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components';
import { DashboardPage, LandingPage, LoginPage, RegisterPage } from './pages';

export const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};
