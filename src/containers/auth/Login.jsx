import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/actions/auth";
import logo from '../../assets/logo.jpg'

function LoginPage({ login, session, rol, loading, error_message }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      if (rol === "admin") navigate("/admin-panel");
      else navigate("/");
    }
  }, [session, rol, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="min-h-screen login-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden">
          {/* CardHeader */}
          <div className="text-center pb-8 p-6">
            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32">
                <img
                  src={logo}
                  alt="HOME-ACCES Security Logo"
                  className="object-contain w-32 h-32"
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Iniciar Sesión</h2>
            <p className="text-muted-foreground">Accede al panel de administración</p>
          </div>

          {/* CardContent */}
          <div className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@home-acces.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full h-12 text-base font-semibold rounded-md bg-cyan-600 text-white hover:bg-cyan-700 transition disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-primary hover:text-primary/80 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {error_message && (
              <p className="mt-4 text-center text-sm text-red-500">{error_message}</p>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/80 text-sm">© 2024 HOME-ACCES Security. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  loading: state.auth.loading,
  session: state.auth.session,
  rol: state.auth.role,
  error_message: state.auth.error_message,
});

export default connect(mapStateToProps, { login })(LoginPage);
