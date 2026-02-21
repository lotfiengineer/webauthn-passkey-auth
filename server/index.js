const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send(`client url is  ${process.env.CLIENT_URL}`);
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
