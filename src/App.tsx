import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ModuleViewer from './pages/ModuleViewer';
import QuizViewer from './pages/QuizViewer';
import Certificate from './pages/Certificate';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="module/:id" element={<ModuleViewer />} />
          <Route path="quiz/:id" element={<QuizViewer />} />
          <Route path="certificate" element={<Certificate />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
