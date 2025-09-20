import React, { useState } from 'react'
import { Gift, LogIn, UserPlus, ChevronRight, XCircle } from 'lucide-react'
import logo from "../assets/logo.webp"
import { Link, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'

function Home({ session }) {
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const handlePlayNowClick = () => {
    if (session) {
      navigate('/panel')
    } else {
      setShowModal(true)
    }
  }

  const handleSignInRedirect = () => {
    navigate('/sign-in')
  }

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-blue-600 to-purple-600">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Encabezado */}
        <header className="text-center mb-12 sm:mb-16">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-5xl sm:text-6xl font-bold text-purple-300">Galaxi</span>
              <span className="text-5xl sm:text-6xl font-bold text-yellow-300">Papas</span>
            </div>
            <p className="text-cyan-300 text-lg sm:text-xl mt-2 italic">¡Un mordisco fuera de este mundo!</p>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold mb-4">Lotería de Papas Fritas</h1>
          <p className="text-xl sm:text-2xl text-cyan-200">¡Encuentra el número ganador en tu empaque!</p>
        </header>

        {/* Tarjeta principal */}
        <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sección izquierda */}
            <div className="w-full md:w-1/2 p-8 sm:p-12">
              <h2 className="text-3xl sm:text-4xl font-semibold mb-6 flex items-center text-yellow-300">
                <Gift className="mr-3 h-8 w-8" />
                Cómo Funciona
              </h2>
              <ol className="list-decimal list-inside space-y-4 mb-8 text-cyan-100 text-lg sm:text-xl">
                <li>Compra un empaque de nuestras papas fritas.</li>
                <li>Encuentra el número único en el empaque.</li>
                <li>Ingresa el número en la web y verifica si ganaste.</li>
              </ol>
              <p className="text-xl sm:text-2xl mb-8 text-cyan-100">
                ¡Cada empaque puede convertir tus antojos en increíbles premios galácticos!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                {!session && <>
                  <Link to='/sign-in'>
                    <button className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out flex items-center justify-center shadow-lg text-lg">
                      <LogIn className="mr-2 h-5 w-5" />
                      Ingresar
                    </button>
                  </Link>
                  <Link to='/sign-up'>
                    <button className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out flex items-center justify-center shadow-lg text-lg">
                      <UserPlus className="mr-2 h-5 w-5" />
                      Registrarse
                    </button>
                  </Link>
                </>}
              </div>
            </div>

            {/* Sección derecha */}
            <div className="w-full md:w-1/2 relative">
              <img
                src={logo}
                alt="Lotería de Papas Fritas"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-700/80 to-transparent flex items-end justify-center p-8">
                <button 
                  onClick={handlePlayNowClick}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-bold py-4 px-8 rounded-full transition duration-300 ease-in-out flex items-center justify-center shadow-lg text-xl"
                >
                  Jugar Ahora
                  <ChevronRight className="ml-2 h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de inicio de sesión */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="bg-gradient-to-br from-purple-600 to-blue-500 p-8 rounded-xl shadow-xl transform transition-all duration-300 scale-105">
              <div className="flex justify-end">
                <button onClick={() => setShowModal(false)} className="text-white">
                  <XCircle className="h-8 w-8 hover:text-red-400 transition duration-300" />
                </button>
              </div>
              <h3 className="text-2xl font-bold text-yellow-300 mb-4">¡Atención!</h3>
              <p className="text-white text-lg mb-6">Tienes que iniciar sesión para jugar.</p>
              <div className="flex justify-center">
                <button 
                  onClick={handleSignInRedirect}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded-full font-semibold transition duration-300"
                >
                  Inicia Sesión
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  session: state.auth.session,
})

export default connect(mapStateToProps)(Home)
