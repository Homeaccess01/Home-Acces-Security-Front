import { connect } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

/**
 * Rutas SOLO para superadmin.
 * - Si no hay sesión → /login
 * - Si el rol !== 'superadmin' → /panel (usuario normal)
 * - Si todo ok → renderiza <Outlet />
 */
const SuperadminRoute = ({ session, role }) => {
  const sessionActive = sessionStorage.getItem("session") === "true";
  if (!session || !sessionActive) return <Navigate to="/login" replace />;

  if (role !== "superadmin") return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

/**
 * Rutas para usuarios autenticados NO superadmin (usuario normal).
 * - Si no hay sesión → /login
 * - Si es superadmin → /admin-panel
 * - Si usuario normal → renderiza <Outlet />
 */
const UserRoute = ({ session, role }) => {
  const sessionActive = sessionStorage.getItem("session") === "true";
  if (!session || !sessionActive) return <Navigate to="/login" replace />;

  if (role === "superadmin") return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

/**
 * Rutas públicas (login, registro):
 * - Si autenticado y superadmin → /admin-panel
 * - Si autenticado y usuario → /panel
 * - Si no autenticado → renderiza <Outlet />
 */
const PublicRoute = ({ session, role }) => {
  const sessionActive = sessionStorage.getItem("session") === "true";
  if (session && sessionActive) {
    if (role === "superadmin") return <Navigate to="/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

const mapStateToProps = (state) => ({
  session: state.auth.session,
  role: state.auth.role,
});

export const ConnectedSuperadminRoute = connect(mapStateToProps)(SuperadminRoute);
export const ConnectedUserRoute = connect(mapStateToProps)(UserRoute);
export const ConnectedPublicRoute = connect(mapStateToProps)(PublicRoute);
