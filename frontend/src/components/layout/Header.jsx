import { Search, ShoppingCart, Bell, Menu, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const getUserInitial = () => {
    if (!user?.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y Menu Mobile */}
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded">
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-udemy-purple">miniCursos</span>
            </Link>
          </div>

        

          {/* Barra de búsqueda */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Busca cualquier tema"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-800 rounded-full focus:outline-none focus:border-udemy-purple focus:ring-2 focus:ring-udemy-purple/20"
              />
            </div>
          </div>

          {/* Acciones del usuario */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/my-learning" className="hidden lg:block text-sm hover:text-udemy-purple transition">
                  Mi aprendizaje
                </Link>
                <button className="p-2 hover:bg-gray-100 rounded relative">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute top-0 right-0 bg-udemy-purple text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Bell className="w-6 h-6" />
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold hover:bg-gray-800 transition"
                  >
                    {getUserInitial()}
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <Link 
                        to="/my-learning" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Mi aprendizaje
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/cart" className="p-2 hover:bg-gray-100 rounded relative">
                  <ShoppingCart className="w-6 h-6" />
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 border border-gray-900 text-gray-900 font-semibold rounded hover:bg-gray-100 transition"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gray-900 text-white font-semibold rounded hover:bg-gray-800 transition"
                >
                  Regístrate
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Barra de búsqueda mobile */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Busca cualquier tema"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-800 rounded-full focus:outline-none focus:border-udemy-purple"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
