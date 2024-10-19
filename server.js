// dependencies import statements
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");

// Configuring Middlewares
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

// Other import statements of database and routes
const DBPool = require('./database/DBPool.js');
const initSchema = require('./database/initSchema.js');
initSchema(DBPool);

// Testing the Server
app.get("/api/test", (req, res) => {
  res.status(200).json("Mediclined server is running just fine!!");
});

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(`[ERROR]: Error in Starting Server !!`, err);
  } else {
    console.log(
      `[LOG]: Server Listening in Port ${process.env.PORT}`
    );
  }
});