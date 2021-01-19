require("dotenv").config();
module.exports = {
  app: {
    title: "Facebook Comment Tracking",
    description: "Facebook Comment Tracking",
    keywords: "fb-comment-tracking",
  },
  db:
    process.env.MONGODB_URL || "mongodb://localhost:27017/fb-comment-tracking",
  jwtSecret: process.env.JWT_KEY || "sayHellworld",
  port: process.env.PORT || 3000,
  logger: process.env.LOG || false,
};
