import api from "../../services/authService";
import { authConfig } from "./helpers";
import {
  TOWERS_LIST_SUCCESS,
  TOWER_GET_SUCCESS,
  TOWER_CREATE_SUCCESS,
  TOWER_UPDATE_SUCCESS,
  TOWER_DELETE_SUCCESS,
} from "../reducers/tower";
import {
  SET_LOADING,
  REMOVE_LOADING,
  SET_MODAL_MESSAGE,
} from "../reducers/messages";

export const getTowers =
  ({ page = 1, limit = 10, search = "" } = {}) =>
  async (dispatch) => {
    dispatch(SET_LOADING());
    try {
      const q = new URLSearchParams({ page, limit, search });
      const res = await api.get(`/towers?${q.toString()}`, authConfig());
      if (res.status === 200) dispatch(TOWERS_LIST_SUCCESS(res.data.body));
    } catch (err) {
      dispatch(
        SET_MODAL_MESSAGE({
          message: err?.response?.data?.body || "Error loading towers.",
          type_message: "error",
          time: 3000,
        })
      );
    } finally {
      dispatch(REMOVE_LOADING());
    }
  };

export const getTower = (id) => async (dispatch) => {
  dispatch(SET_LOADING());
  console.log(id)
  try {
    const res = await api.get(`/towers/${id}`, authConfig());
    if (res.status === 200) dispatch(TOWER_GET_SUCCESS(res.data.body));
  } catch (err) {
    dispatch(
      SET_MODAL_MESSAGE({
        message: err?.response?.data?.body || "Error loading tower.",
        type_message: "error",
        time: 3000,
      })
    );
  } finally {
    dispatch(REMOVE_LOADING());
  }
};

export const createTower = (payload) => async (dispatch) => {
  dispatch(SET_LOADING());
  try {
    const res = await api.post(`/towers`, JSON.stringify(payload), authConfig());
    if (res.status === 201 || res.status === 200) {
      dispatch(TOWER_CREATE_SUCCESS(res.data.body));
      dispatch(
        SET_MODAL_MESSAGE({
          message: "Tower created.",
          type_message: "success",
          time: 3000,
        })
      );
    }
  } catch (err) {
    dispatch(
      SET_MODAL_MESSAGE({
        message: err?.response?.data?.body || "Error creating tower.",
        type_message: "error",
        time: 3000,
      })
    );
  } finally {
    dispatch(REMOVE_LOADING());
  }
};

export const updateTower = (id, payload) => async (dispatch) => {
  dispatch(SET_LOADING());
  try {
    const res = await api.patch(`/towers/${id}`, JSON.stringify(payload), authConfig());
    if (res.status === 200) {
      dispatch(TOWER_UPDATE_SUCCESS(res.data.body));
      dispatch(
        SET_MODAL_MESSAGE({
          message: "Tower updated.",
          type_message: "success",
          time: 3000,
        })
      );
    }
  } catch (err) {
    dispatch(
      SET_MODAL_MESSAGE({
        message: err?.response?.data?.body || "Error updating tower.",
        type_message: "error",
        time: 3000,
      })
    );
  } finally {
    dispatch(REMOVE_LOADING());
  }
};

export const deleteTower = (id) => async (dispatch) => {
  dispatch(SET_LOADING());
  try {
    const res = await api.delete(`/towers/${id}`, authConfig());
    if (res.status === 200) {
      dispatch(TOWER_DELETE_SUCCESS(id));
      dispatch(
        SET_MODAL_MESSAGE({
          message: "Tower deleted.",
          type_message: "success",
          time: 3000,
        })
      );
    }
  } catch (err) {
    dispatch(
      SET_MODAL_MESSAGE({
        message: err?.response?.data?.body || "Error deleting tower.",
        type_message: "error",
        time: 3000,
      })
    );
  } finally {
    dispatch(REMOVE_LOADING());
  }
};
