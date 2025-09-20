import api from "../../services/authService";
import { authConfig } from "./helpers";
import {
  APARTMENTS_LIST_SUCCESS,
  APARTMENT_GET_SUCCESS,
  APARTMENT_CREATE_SUCCESS,
  APARTMENT_UPDATE_SUCCESS,
  APARTMENT_DELETE_SUCCESS,
} from "../reducers/apartment";
import {
  SET_LOADING,
  REMOVE_LOADING,
  SET_MODAL_MESSAGE,
} from "../reducers/messages";

export const fetchApartments =
  ({ page = 1, limit = 10, tower, number } = {}) =>
  async (dispatch) => {
    dispatch(SET_LOADING());
    try {
      const q = new URLSearchParams({ page, limit });
      if (tower) q.append("tower", tower);
      if (number) q.append("number", number);
      const res = await api.get(`/apartments?${q.toString()}`, authConfig());
      if (res.status === 200) dispatch(APARTMENTS_LIST_SUCCESS(res.data.body));
    } catch (err) {
      dispatch(
        SET_MODAL_MESSAGE({
          message: err?.response?.data?.body || "Error loading apartments.",
          type_message: "error",
          time: 3000,
        })
      );
    } finally {
      dispatch(REMOVE_LOADING());
    }
  };

export const fetchApartmentById = (id) => async (dispatch) => {
  dispatch(SET_LOADING());
  try {
    const res = await api.get(`/apartments/${id}`, authConfig());
    if (res.status === 200) dispatch(APARTMENT_GET_SUCCESS(res.data.body));
  } catch (err) {
    dispatch(
      SET_MODAL_MESSAGE({
        message: err?.response?.data?.body || "Error loading apartment.",
        type_message: "error",
        time: 3000,
      })
    );
  } finally {
    dispatch(REMOVE_LOADING());
  }
};

export const createApartment = (payload) => async (dispatch) => {
  dispatch(SET_LOADING());
  try {
    const res = await api.post(`/apartments`, JSON.stringify(payload), authConfig());
    if (res.status === 201 || res.status === 200) {
      dispatch(APARTMENT_CREATE_SUCCESS(res.data.body));
      dispatch(
        SET_MODAL_MESSAGE({
          message: "Apartment created.",
          type_message: "success",
          time: 3000,
        })
      );
    }
  } catch (err) {
    dispatch(
      SET_MODAL_MESSAGE({
        message: err?.response?.data?.body || "Error creating apartment.",
        type_message: "error",
        time: 3000,
      })
    );
  } finally {
    dispatch(REMOVE_LOADING());
  }
};

export const updateApartment = (id, payload) => async (dispatch) => {
  dispatch(SET_LOADING());
  try {
    const res = await api.patch(`/apartments/${id}`, JSON.stringify(payload), authConfig());
    if (res.status === 200) {
      dispatch(APARTMENT_UPDATE_SUCCESS(res.data.body));
      dispatch(
        SET_MODAL_MESSAGE({
          message: "Apartment updated.",
          type_message: "success",
          time: 3000,
        })
      );
    }
  } catch (err) {
    dispatch(
      SET_MODAL_MESSAGE({
        message: err?.response?.data?.body || "Error updating apartment.",
        type_message: "error",
        time: 3000,
      })
    );
  } finally {
    dispatch(REMOVE_LOADING());
  }
};

export const deleteApartment = (id) => async (dispatch) => {
  dispatch(SET_LOADING());
  try {
    const res = await api.delete(`/apartments/${id}`, authConfig());
    if (res.status === 200) {
      dispatch(APARTMENT_DELETE_SUCCESS(id));
      dispatch(
        SET_MODAL_MESSAGE({
          message: "Apartment deleted.",
          type_message: "success",
          time: 3000,
        })
      );
    }
  } catch (err) {
    dispatch(
      SET_MODAL_MESSAGE({
        message: err?.response?.data?.body || "Error deleting apartment.",
        type_message: "error",
        time: 3000,
      })
    );
  } finally {
    dispatch(REMOVE_LOADING());
  }
};
