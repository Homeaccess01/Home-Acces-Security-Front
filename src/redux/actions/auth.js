import axios from "axios";
import api from "../../services/authService";
import {
  SET_AUTH_LOADING,
  LOGIN_SUCCESS,
  REMOVE_AUTH_LOADING,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGOUT,
  REMOVE_ERROR_MESSAGE,
  REFRESH_SESSION_SUCCESS,
} from "../reducers/auth";

// Helper: setea el Authorization header del axios de tu app
const setAuthHeader = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// LOGIN (guarda access/refresh en localStorage y setea Authorization)
export const login = (email, password) => async (dispatch) => {
  dispatch(SET_AUTH_LOADING());
  dispatch(REMOVE_ERROR_MESSAGE());

  const config = { headers: { "Content-Type": "application/json" } };
  const body = JSON.stringify({ username: email, password });

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_REACT_APP_API_URL}/auth/sign-in`,
      body,
      config
    );

    if (res.status === 200) {
      const { session, user, accessToken, refreshToken } = res.data.body;

      // tokens en localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setAuthHeader(accessToken);

      dispatch(LOGIN_SUCCESS({ session, user }));
    } else {
      dispatch(LOGIN_FAIL(res.data.body || "Unknown login error."));
    }
  } catch (err) {
    let errorMessage = "Unknown login error.";
    if (err.response) errorMessage = err.response.data.body || "Server error.";
    else if (err.request) errorMessage = "Cannot reach server.";
    else errorMessage = err.message;

    dispatch(LOGIN_FAIL(errorMessage));
  } finally {
    dispatch(REMOVE_AUTH_LOADING());
  }
};

// REGISTER (usuario)
export const signUp =
  (email, password) => async (dispatch) => {
    dispatch(SET_AUTH_LOADING());
    dispatch(REMOVE_ERROR_MESSAGE());

    const config = { headers: { "Content-Type": "application/json" } };
    const body = JSON.stringify({ email, password, rol: "user" });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/auth/register`,
        body,
        config
      );

      if (res.status === 200) {
        const { success, message } = res.data.body;
        dispatch(REGISTER_SUCCESS({ success, message }));
      } else {
        dispatch(REGISTER_FAIL(res.data.body || "Unknown register error."));
      }
    } catch (err) {
      let errorMessage = "Unknown register error.";
      if (err.response) errorMessage = err.response.data.body || "Server error.";
      else if (err.request) errorMessage = "Cannot reach server.";
      else errorMessage = err.message;

      dispatch(REGISTER_FAIL(errorMessage));
    } finally {
      dispatch(REMOVE_AUTH_LOADING());
    }
  };

// REGISTER (admin)
export const signUpAdmin = (email, password) => async (dispatch) => {
  dispatch(SET_AUTH_LOADING());
  dispatch(REMOVE_ERROR_MESSAGE());

  const config = { headers: { "Content-Type": "application/json" } };
  const body = JSON.stringify({ email, password, rol: "admin" });

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_REACT_APP_API_URL}/auth/register-admin`,
      body,
      config
    );

    if (res.status === 200) {
      const { success, message } = res.data.body;
      dispatch(REGISTER_SUCCESS({ success, message }));
    } else {
      dispatch(REGISTER_FAIL(res.data.body || "Unknown register error."));
    }
  } catch (err) {
    let errorMessage = "Unknown register error.";
    if (err.response) errorMessage = err.response.data.body || "Server error.";
    else if (err.request) errorMessage = "Cannot reach server.";
    else errorMessage = err.message;

    dispatch(REGISTER_FAIL(errorMessage));
  } finally {
    dispatch(REMOVE_AUTH_LOADING());
  }
};

// REFRESH ACCESS TOKEN (usa refresh guardado en localStorage)
export const refreshSession = () => async (dispatch) => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return;

  dispatch(SET_AUTH_LOADING());
  try {
    const res = await api.post(
      `/auth/refresh`,
      { refreshToken },
      { headers: { "Content-Type": "application/json" } }
    );

    if (res.status === 200) {
      const { session, user, accessToken } = res.data.body;

      localStorage.setItem("accessToken", accessToken);
      setAuthHeader(accessToken);

      dispatch(REFRESH_SESSION_SUCCESS({ session, user }));
    }
  } catch (err) {
    // si falla, limpiamos y forzamos logout
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAuthHeader(null);
    dispatch(LOGOUT());
  } finally {
    dispatch(REMOVE_AUTH_LOADING());
  }
};

// VERIFY SESSION (opcional, si tu back expone /auth/me)
export const verifySession = () => async (dispatch) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return;

  dispatch(SET_AUTH_LOADING());
  try {
    setAuthHeader(accessToken);
    const res = await api.get(`/auth/me`);
    if (res.status === 200) {
      const { session, user } = res.data.body;
      dispatch(REFRESH_SESSION_SUCCESS({ session, user }));
    }
  } catch (err) {
    // token inválido
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAuthHeader(null);
    dispatch(LOGOUT());
  } finally {
    dispatch(REMOVE_AUTH_LOADING());
  }
};

// LOGOUT (solo limpiar client-side; endpoint es opcional)
export const logout = () => async (dispatch) => {
  dispatch(SET_AUTH_LOADING());
  dispatch(REMOVE_ERROR_MESSAGE());
  try {
    // opcional: await api.get(`/auth/logout`);
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAuthHeader(null);
    dispatch(LOGOUT());
    dispatch(REMOVE_AUTH_LOADING());
  }
};
