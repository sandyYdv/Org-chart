import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://worksync.global/api",
});

apiClient.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_ORG_CHART_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
