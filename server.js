const path = require('path');
const express = require("express");
const cors = require("cors"); // Require the cors middleware
const { APP_PORT, DB_URL } = require("./config/index");
const routes = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const mongoose = require("mongoose");
//const holidayUpdateScript = require('./script/holidayUpdateScript');


const app = express();

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Middleware for parsing incoming requests from the body
global.appRoot = path.resolve(__dirname);
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    //holidayUpdateScript();
    // Define APP_PORT before using it in app.listen()
    app.listen(APP_PORT, () => {
      console.log(`Server is running on http://localhost:${APP_PORT}`);
    });
  })
  .catch((error) => console.error("Error connecting to MongoDB:", error));

app.use("/app", routes);
app.use(errorHandler);
