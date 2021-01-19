require("dotenv").config();
module.exports = {
  app: {
    title: "Facebook Comment Tracking",
    description: "Facebook Comment Tracking",
    keywords: "fb-comment-tracking",
  },
  baseURL:process.env.BASE_URL || "http://localhost:4000",
  db:
    process.env.MONGODB_URL || "mongodb://localhost:27017/fb-comment-tracking",
  jwtSecret: process.env.JWT_SECRET || "sayHellworld",
  port: process.env.PORT || 3000,
  logger: process.env.LOGGER || false,
};
