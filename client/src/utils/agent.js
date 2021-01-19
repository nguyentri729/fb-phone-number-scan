import axios from "axios";
import config from "../config";
const axiosApiInstance = axios.create({
  baseURL: config.restAPIServer,
});

axiosApiInstance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers = {
        Authorization: `Bearer ${accessToken}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosApiInstance;
