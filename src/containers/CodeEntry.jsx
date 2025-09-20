import { useEffect, useState } from 'react'
import { ChevronRight, LogOut } from 'lucide-react'
import logo from "../assets/logo.webp"
import { logout } from '../redux/actions/auth'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUserLogs, sendCode } from '../redux/actions/code'
import Layout from '../hocs/Layout'

function CodeEntry({ logout, sendCode, getUserLogs, logs }) {
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    getUserLogs();
  }, []);

  console.log(logs)

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validar que el código contenga solo números
    if (!/^\d+$/.test(code)) {
      setError('El código debe contener solo números.')
      return
    }

    sendCode(code).then(() => {
      getUserLogs();
    });

    setError(null); // Limpiar el error si el código es válido
  }

  const handleLogout = () => {
    logout();
    navigate("/sign-in");
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 p-4 relative">
        {/* Botón de cerrar sesión */}
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 flex items-center px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition duration-300"
        >
          Cerrar Sesión <LogOut className="ml-2 h-4 w-4" />
        </button>

        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
          {/* Logo de GalaxiPapas */}
          <div className="flex flex-col items-center mb-6">
            <img src={logo} alt="GalaxiPapas Logo" className="w-20 h-20 mb-4 animate-bounce" />
            <div className="flex items-center space-x-2">
              <span className="text-4xl font-bold text-purple-600">Galaxi</span>
              <span className="text-4xl font-bold text-yellow-500">Papas</span>
            </div>
            <p className="text-cyan-500 text-sm mt-2 italic">¡Un mordisco fuera de este mundo!</p>
          </div>

          {/* Título de ingreso de código */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold">Ingresa tu Código</h2>
            <p className="text-gray-600">Descubre si has ganado un premio increíble</p>
          </div>

          {/* Formulario de ingreso de código */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ingresa tu código aquí"
                  className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  type="submit"
                  className="flex items-center px-4 py-3 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600 transition duration-300"
                >
                  Verificar <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
              {/* Mensaje de error de validación */}
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
            </div>
          </form>

          {/* Resultado del código */}
          {result && (
            <div
              className={`mt-4 p-4 rounded-lg ${result.prize.includes('Ganaste') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
            >
              <p className="font-semibold">Resultado: {result.prize}</p>
            </div>
          )}

          {/* Tabla de códigos ingresados */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Tus Códigos Ingresados</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Fecha</th>
                    <th className="p-2 border">Código</th>
                    <th className="p-2 border">Premio</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((entry, index) => (
                    <tr key={index} className="odd:bg-white even:bg-gray-50">
                      <td className="p-2 border">
                        {new Date(entry.date).toLocaleString('es-CO', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>

                      <td className="p-2 border">{entry.code}</td>
                      <td className="p-2 border">{entry.prize}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

const mapStateToProps = (state) => ({
  logs: state.code.logs,
});

export default connect(mapStateToProps, {
  logout,
  sendCode,
  getUserLogs
})(CodeEntry);
