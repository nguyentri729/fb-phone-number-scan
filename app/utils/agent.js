const axios = require("axios");
const mongoose = require("mongoose");
const Token = mongoose.model("Token");
const _ = require("lodash");
const axiosApiInstance = axios.create({
  baseURL: "https://graph.facebook.com/",
});
const randomToken = async () => {
  const tokens = await Token.find({
    status: "live",
  })
    .lean()
    .exec();
  const token = tokens[_.random(0, tokens.length - 1)];
  return token;
};
axiosApiInstance.interceptors.request.use(
  async (config) => {
    const token = await randomToken();
    if (token.accessToken) {
      config.params.access_token = token.accessToken;
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosApiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const token = await randomToken();
      if (token.accessToken) {
        originalRequest.params.access_token = token.accessToken;
        return axiosApiInstance(originalRequest);
      }
      return Promise.reject(
        new Error("Có lỗi xảy ra ! Vui lòng thử lại sau !!! ")
      );
    }
    return Promise.reject(error);
  }
);

module.exports = axiosApiInstance;
