import { useDispatch } from 'react-redux';
import { REFRESH_SESSION_SUCCESS, LOGIN_FAIL, REMOVE_AUTH_LOADING, SET_AUTH_LOADING } from "../redux/reducers/auth";
import api from "../services/authService";

// Hook personalizado para cargar el usuario desde la cookie
const useAuth = () => {
  const dispatch = useDispatch();

  const loadUser = async () => {
    dispatch(SET_AUTH_LOADING());
    console.log('ee')
    try {
      const res = await api.get(`/auth/me`);
      if (res.status === 200) {
        const { session, user } = res.data.body;
        dispatch(REFRESH_SESSION_SUCCESS({ session, user }));
      } else {
        dispatch(
          LOGOUT()
        );
      }
    } catch (err) {
      let errorMessage = "Error desconocido al cargar los datos del usuario.";
      // Verifica si hay una respuesta del servidor
      if (err.response) {
        const { body, error } = err.response.data;
        if (error) {
          // El servidor envió un mensaje de error en el cuerpo de la respuesta
          errorMessage = body || "Error en el servidor.";
        } else {
          errorMessage = "Respuesta inesperada del servidor.";
        }
      } else if (err.request) {
        // No se pudo contactar al servidor
        errorMessage = "No se pudo contactar al servidor. Verifica tu conexión.";
      } else {
        // Otro error (p.ej., error de código)
        errorMessage = err.message;
      }

      // dispatch(LOGIN_FAIL(errorMessage)); // Despachar error
    } finally {
      dispatch(REMOVE_AUTH_LOADING());
    }
  };

  return { loadUser }; // Devuelve la función para cargar el usuario
};

export default useAuth;
