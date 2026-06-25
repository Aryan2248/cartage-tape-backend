import api from "../services/axios";

export const loginUser = (data) =>
  api.post("/api/auth/login", data);

export const registerUser = (data) =>
  api.post("/api/auth/register", data);

export const getCurrentUser = () =>
  api.get("/api/auth/me");

export const registerEmployee = (
  employeeData
) =>
  api.post(
    "/api/auth/register",
    employeeData
  );