import api from "../../services/authService";
import { authConfig } from "./helpers";
import {
  PERSONS_LIST_SUCCESS,
  PERSON_CREATE_SUCCESS,
  PERSON_UPDATE_SUCCESS,
  PERSON_DELETE_SUCCESS,
  PERSON_GET_SUCCESS,
} from "../reducers/person";
import {
  SET_LOADING,
  REMOVE_LOADING,
  SET_MODAL_MESSAGE,
} from "../reducers/messages";

// Listar (con paginación y filtros opcionales)
export const fetchPersons =
  ({ page = 1, limit = 10, search = "", apartment } = {}) =>
  async (dispatch) => {
    dispatch(SET_LOADING());
    try {
      const q = new URLSearchParams({ page, limit, search });
      if (apartment) q.append("apartment", apartment);
      const res = await api.get(`/persons?${q.toString()}`, authConfig());
      if (res.status === 200) {
        dispatch(PERSONS_LIST_SUCCESS(res.data.body));
      }
    } catch (err) {
      dispatch(
        SET_MODAL_MESSAGE({
          message:
            err?.response?.data?.body ||
            "Error loading persons.",
          type_message: "error",
          time: 3000,
        })
      );
    } finally {
      dispatch(REMOVE_LOADING());
    }
  };

// Obtener uno
export const fetchPersonById = (id) => async (dispatch) => {
  dispatch(SET_LOADING());
  try {
    const res = await api.get(`/persons/${id}`, authConfig());
    if (res.status === 200) {
      dispatch(PERSON_GET_SUCCESS(res.data.body));
    }
  } catch (err) {
    dispatch(
      SET_MODAL_MESSAGE({
        message: err?.response?.data?.body || "Error loading person.",
        type_message: "error",
        time: 3000,
      })
    );
  } finally {
    dispatch(REMOVE_LOADING());
  }
};

// Crear
export const createPerson = (payload) => async (dispatch) => {
  dispatch(SET_LOADING());
  try {
    const res = await api.post(`/persons`, JSON.stringify(payload), authConfig());
    if (res.status === 201 || res.status === 200) {
      dispatch(PERSON_CREATE_SUCCESS(res.data.body));
      dispatch(
        SET_MODAL_MESSAGE({
          message: "Person created successfully.",
          type_message: "success",
          time: 3000,
        })
      );
    }
  } catch (err) {
    dispatch(
      SET_MODAL_MESSAGE({
        message: err?.response?.data?.body || "Error creating person.",
        type_message: "error",
        time: 3000,
      })
    );
  } finally {
    dispatch(REMOVE_LOADING());
  }
};

// Actualizar
export const updatePerson = (id, payload) => async (dispatch) => {
  dispatch(SET_LOADING());
  try {
    const res = await api.patch(`/persons/${id}`, JSON.stringify(payload), authConfig());
    if (res.status === 200) {
      dispatch(PERSON_UPDATE_SUCCESS(res.data.body));
      dispatch(
        SET_MODAL_MESSAGE({
          message: "Person updated successfully.",
          type_message: "success",
          time: 3000,
        })
      );
    }
  } catch (err) {
    dispatch(
      SET_MODAL_MESSAGE({
        message: err?.response?.data?.body || "Error updating person.",
        type_message: "error",
        time: 3000,
      })
    );
  } finally {
    dispatch(REMOVE_LOADING());
  }
};

// Eliminar
export const deletePerson = (id) => async (dispatch) => {
  dispatch(SET_LOADING());
  try {
    const res = await api.delete(`/persons/${id}`, authConfig());
    if (res.status === 200) {
      dispatch(PERSON_DELETE_SUCCESS(id));
      dispatch(
        SET_MODAL_MESSAGE({
          message: "Person deleted.",
          type_message: "success",
          time: 3000,
        })
      );
    }
  } catch (err) {
    dispatch(
      SET_MODAL_MESSAGE({
        message: err?.response?.data?.body || "Error deleting person.",
        type_message: "error",
        time: 3000,
      })
    );
  } finally {
    dispatch(REMOVE_LOADING());
  }
};
