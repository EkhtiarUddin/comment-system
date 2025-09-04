import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import CommentsPage from './pages/CommentsPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import './styles/App.scss';

function App() {
  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return !isAuthenticated ? children : <Navigate to="/" />;
  };

  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Navbar />
          <div className="container">
            <Routes>
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <CommentsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login onToggleMode={() => window.location.href = '/register'} />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register onToggleMode={() => window.location.href = '/login'} />
                  </PublicRoute>
                } 
              />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
