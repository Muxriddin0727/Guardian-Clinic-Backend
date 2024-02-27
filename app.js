console.log("Bismillahirrohmanirrohim");
const http = require("http");
const express = require("express");
const app = express();
const morgan = require("morgan");
const router_client = require("./router_client");
const router_secured = require("./router_secured");
const path = require('path');



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
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
console.log("Uploads directory path:", __dirname + "/uploads");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  cors({
    credentials: true,
    origin: 'http://guardian-clinic.uz/',
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
/** SOCKET.IO BACKEND SERVER **/
const io = require("socket.io")(server, {
  serveClient: false,
  origins: "*:*",
  transport: ["websocket", "xhr-polling"],
});

let online_users = 0;
io.on("connection", function (socket) { 
  online_users++;
  console.log("New user, total:", online_users);
  socket.emit("greetMsg", { text: "Welcome" });
  io.emit("infoMsg", { total: online_users });

  socket.on("disconnect", function () {
    online_users--;
    socket.broadcast.emit("infoMsg", { total: online_users });
    console.log("client disconnect, total: ", online_users);
  });

  socket.on("createMsg", function (data) {
    console.log("createMsg:", data);
    io.emit("newMsg", data);
  });
});
//socket.emit -- ulanag odam uchun yoziladigan xabar/ bu faqat osha odamga boradi
//socket.broadcast.emit -- ulangan odamdan tashqari userlarga malumot jonatadi
//io.emit -- hammag malumot joanatadi

/** SOCKET.IO BACKEND SERVER **/

module.exports = server;
