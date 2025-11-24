import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import CoursePage from './pages/CoursePage';
import MyLearning from './pages/MyLearning';
import Learn from './pages/Learn';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas con layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="course/:id" element={<CoursePage />} />
            <Route path="my-learning" element={<MyLearning />} />
          </Route>

          {/* Rutas sin layout (player de video) */}
          <Route path="course/:id/learn" element={<Learn />} />

          {/* Rutas de autenticación */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
