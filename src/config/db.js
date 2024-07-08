require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_URL = process.env.MONGO_URL || "";
const MONGO_DATABASE = process.env.MONGO_DATABASE || "";
const MONGO_OPTIONS = {
  retryWrites: true,
  w: "majority",
  appName: "Cluster0",
};

const connect = async () => {
  try {
    const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_URL}/${MONGO_DATABASE}?retryWrites=true&w=majority`;
    await mongoose.connect(uri, MONGO_OPTIONS);
    console.log("Connect success");
  } catch (error) {
    console.log("Connect fail");
    console.log(error);
  }
};

module.exports = { connect };
