import { useCognitoAuth } from '../../context/CognitoAuthContext';
import { LogOut, User, Mail, Key } from 'lucide-react';

const CognitoLogin = () => {
  const { isLoading, isAuthenticated, error, user, signIn, signOut } = useCognitoAuth();

  // Estado de carga
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-udemy-purple mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Cargando autenticación...</p>
        </div>
      </div>
    );
  }

  // Error de autenticación
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error de Autenticación</h2>
            <p className="text-red-600 mb-6">{error.message}</p>
            <button
              onClick={signIn}
              className="w-full bg-udemy-purple hover:bg-udemy-purple-dark text-white font-bold py-3 rounded-lg transition"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Usuario autenticado
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-udemy-purple text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">¡Bienvenido!</h2>
                  <p className="text-gray-600">{user.name || user.email}</p>
                </div>
              </div>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                Cerrar sesión
              </button>
            </div>

            {/* Información del usuario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">ID de Usuario</p>
                  <p className="font-mono text-sm text-gray-900 break-all">{user.userId}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tokens (para desarrollo) */}
          {import.meta.env.DEV && (
            <div className="space-y-4">
              {/* ID Token */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Key className="w-5 h-5 text-udemy-purple" />
                  <h3 className="text-lg font-bold text-gray-900">ID Token</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">JWT</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all">
                    {user.idToken}
                  </pre>
                </div>
              </div>

              {/* Access Token */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Key className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-900">Access Token</h3>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Bearer</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all">
                    {user.accessToken}
                  </pre>
                </div>
              </div>

              {/* Nota de desarrollo */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Nota:</strong> Los tokens solo se muestran en modo desarrollo. 
                  En producción, estos estarán ocultos y se enviarán automáticamente en las peticiones API.
                </p>
              </div>
            </div>
          )}

          {/* Acciones rápidas */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-udemy-purple hover:bg-purple-50 transition text-left">
                <h4 className="font-semibold text-gray-900 mb-1">Mis Cursos</h4>
                <p className="text-sm text-gray-600">Ver mis cursos inscritos</p>
              </button>
              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-udemy-purple hover:bg-purple-50 transition text-left">
                <h4 className="font-semibold text-gray-900 mb-1">Explorar</h4>
                <p className="text-sm text-gray-600">Descubrir nuevos cursos</p>
              </button>
              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-udemy-purple hover:bg-purple-50 transition text-left">
                <h4 className="font-semibold text-gray-900 mb-1">Perfil</h4>
                <p className="text-sm text-gray-600">Editar mi información</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No autenticado - Mostrar pantalla de login
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-udemy-purple mb-2">miniCursos</h1>
            <p className="text-gray-600">Plataforma de aprendizaje en línea</p>
          </div>

          {/* Ilustración */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-udemy-purple to-purple-600 rounded-full mb-4">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Inicia tu aprendizaje</h2>
            <p className="text-gray-600">
              Accede con tu cuenta de AWS Cognito para continuar
            </p>
          </div>

          {/* Botón de inicio de sesión */}
          <button
            onClick={signIn}
            className="w-full bg-gradient-to-r from-udemy-purple to-purple-600 hover:from-udemy-purple-dark hover:to-purple-700 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 mb-6"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Iniciar sesión con Cognito
          </button>

          {/* Beneficios */}
          <div className="space-y-3 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Acceso seguro con AWS Cognito</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Miles de cursos disponibles</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Aprende a tu propio ritmo</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          ¿Primera vez aquí?{' '}
          <a href="#" className="text-udemy-purple hover:underline font-semibold">
            Crea una cuenta
          </a>
        </p>
      </div>
    </div>
  );
};

export default CognitoLogin;
