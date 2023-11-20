const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");

let db;
const connectionString = process.env.MONGO_URL;

mongoose.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, goose) => {
    if (err) console.log(`ERROR on connection MongoDB`);
    else {
      console.log("MongoDB connection succeed");
      // console.log(goose);
      const server = require("./app");

      let PORT = process.env.PORT || 3003;
      server.listen(PORT, function () {
        console.log(
          `server is running on port ${PORT}, http://localhost:${PORT}`
        );
      });
    }
  }
);