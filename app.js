const http = require("http");
const express = require("express");
const app = express();
const morgan = require("morgan");
const router_client = require("./router_client");
const router_secured = require("./router_secured");

 
const cookieParser = require("cookie-parser");
const cors = require("cors");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

// 1: Kirish code
app.use(express.static("public"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(cookieParser());

// 2: Session code
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 30, // for 30 minutes
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(function (req, res, next) {
  res.locals.member = req.session.member;
  next();
});

// 3: Views code
app.set("views", "views");
app.set("view engine", "ejs");


// 4: Routing code
app.use("/client", router_client); 
app.use("/secured", router_secured);

const server = http.createServer(app);


module.exports = server;

