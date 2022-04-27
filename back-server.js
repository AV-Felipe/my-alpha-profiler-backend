const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const validateCookie = require("./middlewares/cookie-token-verification.js");

// endpoints for routes
const sessionControl = require("./routes/sessionControl.js");
const userManipulation = require("./routes/user-manipulation.js");

// local constants
const port = 3003;

const app = express();

//CORS parameters
const corsConfig = {
  origin: ["http://localhost:3000"],
  credentials: true, //required for using credential (cookies)
};

app.use(cors(corsConfig));

app.use(cookieParser());

app.use(express.json());

app.use(validateCookie);

// main routes
app.use("/session", sessionControl);
app.use("/user", userManipulation);

app.listen(port, () => {
  console.log(`listening http://192.168.0.100:${port}\nCTRL + C to terminate`);
});
