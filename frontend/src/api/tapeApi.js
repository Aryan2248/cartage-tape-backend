import api from "../services/axios";

export const getAllTapes = () =>
  api.get("/api/tapes");

export const createTape = (data) =>
  api.post("/api/tapes", data);

export const updateTape = (id, data) =>
  api.put(`/api/tapes/${id}`, data);

export const deleteTape = (id) =>
  api.delete(`/api/tapes/admin/${id}`);

export const searchTapes = (query) =>
  api.get(`/api/tapes?search=${query}`);