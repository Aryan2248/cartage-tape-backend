import api from "../services/axios";

export const createTape = (data) =>
  api.post("/api/tapes", data);

export const updateTape = (id, data) =>
  api.put(`/api/tapes/${id}`, data);

export const deleteTape = (id) =>
  api.delete(`/api/tapes/admin/${id}`);

export const searchTapes = (
  query,
  page = 0) =>
  api.get(
    `/api/tapes?search=${query}&page=${page}&size=10`
  );

export const getAllTapes = (page = 0) =>
  api.get(`/api/tapes?page=${page}&size=10`);