require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const database = require("./config/db");
const corsOption = require("./config/corsOption");
const router = require("./routes/root");
const routerBrand = require("./routes/brandRoute");
const routerProduct = require("./routes/productRoutes");
const app = express();
const PORT = process.env.PORT || 5000;
const HOSTNAME = process.env.HOSTNAME || "localhost";

database.connect();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors(corsOption));

app.use("/", express.static(path.join(__dirname, "assets")));

app.use("/", router);

app.use("/test", routerBrand);

app.use("/test", routerProduct);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
