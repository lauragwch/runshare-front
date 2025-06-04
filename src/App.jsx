import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Contextes/AuthContext';
import './App.css';

// Composants layout
import Layout from './Components/Layout/Layout';
import ProtectedRoute from './Components/Auth/ProtectedRoute';

// Pages
import HomePage from './Pages/HomePage';
import AuthPage from './Pages/AuthPage';
import ResetPasswordPage from './Pages/ResetPasswordPage';
import RunsListPage from './Pages/RunsListPage';
import RunDetailPage from './Pages/RunDetailPage';
import CreateRunPage from './Pages/CreateRunPage';
import UserProfilePage from './Pages/UserProfilePage';
import EditRunPage from './Pages/EditRunPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="runs" element={<RunsListPage />} />
            <Route path="runs/:id" element={<RunDetailPage />} />

            {/* Routes protégées */}
            <Route path="runs/create" element={
              <ProtectedRoute>
                <CreateRunPage />
              </ProtectedRoute>
            } />

            <Route path="profile" element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            } />

            <Route path="runs/:id/edit" element={
              <ProtectedRoute>
                <EditRunPage />
              </ProtectedRoute>
            } />

            <Route path="users/:id" element={<UserProfilePage />} />

          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
