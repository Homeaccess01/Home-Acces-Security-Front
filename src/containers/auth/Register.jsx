import { useState, useEffect } from 'react'
import { User, Calendar, CreditCard, Mail, Phone, MapPin, Lock, ChevronRight } from 'lucide-react'
import logo from "../../assets/logo.webp"
import { connect } from 'react-redux'
import { signUp } from '../../redux/actions/auth'
import { useNavigate } from 'react-router-dom'

function Register({ signUp, successRegister, error_message }) {
  const [form, setForm] = useState({
    name: '',
    birthdate: '',
    document_number: '',
    email: '',
    phone: '',
    city: '',
    password: '',
  })
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (successRegister) {
      navigate('/sign-in')
    }
  }, [successRegister])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    // Validar nombre
    if (!form.name.trim()) {
      newErrors.name = 'El nombre es obligatorio.'
    } else if (form.name.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres.'
    }

    // Validar fecha de nacimiento
    if (!form.birthdate) {
      newErrors.birthdate = 'La fecha de nacimiento es obligatoria.'
    }

    // Validar cédula
    if (!form.document_number.trim()) {
      newErrors.document_number = 'La cédula es obligatoria.'
    } else if (!/^\d{6,20}$/.test(form.document_number)) {
      newErrors.document_number = 'La cédula debe tener entre 6 y 20 dígitos numéricos.'
    }

    // Validar correo
    if (!form.email.trim()) {
      newErrors.email = 'El correo es obligatorio.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'El correo no es válido.'
    }

    // Validar celular
    if (!form.phone.trim()) {
      newErrors.phone = 'El celular es obligatorio.'
    } else if (!/^\d{6,15}$/.test(form.phone)) {
      newErrors.phone = 'El celular debe tener entre 6 y 15 dígitos numéricos.'
    }

    // Validar ciudad
    if (!form.city.trim()) {
      newErrors.city = 'La ciudad es obligatoria.'
    }

    // Validar contraseña
    if (!form.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria.'
    } else if (form.password.length < 5) {
      newErrors.password = 'La contraseña debe tener al menos 5 caracteres.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      signUp(form.name, form.birthdate, form.document_number, form.email, form.phone, form.city, form.password)
      console.log('Formulario válido, enviando datos:', form)
    } else {
      console.log('Formulario inválido, no se puede enviar.')
    }
  }

  const fields = [
    { icon: User, name: 'name', label: 'Nombre', type: 'text', placeholder: 'Juan Pérez' },
    { icon: Calendar, name: 'birthdate', label: 'Fecha de Nacimiento', type: 'date', placeholder: '' },
    { icon: CreditCard, name: 'document_number', label: 'Cédula', type: 'text', placeholder: '1234567890' },
    { icon: Mail, name: 'email', label: 'Correo', type: 'email', placeholder: 'tu@ejemplo.com' },
    { icon: Phone, name: 'phone', label: 'Celular', type: 'tel', placeholder: '0987654321' },
    { icon: MapPin, name: 'city', label: 'Ciudad', type: 'text', placeholder: 'Cali' },
    { icon: Lock, name: 'password', label: 'Contraseña', type: 'password', placeholder: '••••••••' },
  ]

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 p-4">
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

        {/* Título de registro */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Registrarse</h2>
          <p className="text-gray-600">Crea tu cuenta para participar en GalaxiPapas</p>
        </div>

        {/* Formulario de registro */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 flex items-center">
                  <field.icon className="mr-2 h-4 w-4 text-gray-400" />
                  {field.label}
                </label>
                <input
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors[field.name] ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                />
                {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>}
              </div>
            ))}
          </div>

          {/* Mensaje del servidor */}
          {error_message && (
            <div className="mt-4 p-3 rounded-lg bg-red-100 text-red-700 text-center">
              {error_message}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Registrar <ChevronRight className="ml-2 h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  loading: state.auth.loading,
  successRegister: state.auth.successRegister,
  error_message: state.auth.error_message,
});

export default connect(mapStateToProps, {
  signUp,
})(Register);
