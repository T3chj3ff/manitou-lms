import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ModuleViewer from './pages/ModuleViewer';
import QuizViewer from './pages/QuizViewer';
import Certificate from './pages/Certificate';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { AuthProvider } from './lib/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="module/:id" element={<ModuleViewer />} />
              <Route path="quiz/:id" element={<QuizViewer />} />
              <Route path="certificate" element={<Certificate />} />
              <Route element={<AdminRoute />}>
                <Route path="admin" element={<Admin />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
