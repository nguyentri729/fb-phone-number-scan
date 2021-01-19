const apiURL =
  process.env.NODE_ENV === "production"
    ? "http://139.180.137.164:4000"
    : "http://localhost:4000";
const configs = {
  restAPIServer: apiURL,
};
export default configs;
