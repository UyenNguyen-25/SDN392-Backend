const allowedOrigins = require("./allowedOrigin");

const corsOption = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: [
    "Content-Type",
    "Access-Control-Allow-Credentials",
    "Authorization" || "authorization",
  ],
};

module.exports = corsOption;
