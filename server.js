const dotenv = require("dotenv");

dotenv.config();

const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const connectionString = process.env.MONGO_URL;
console.log(connectionString);
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connection succeed");
    const server = require("./app");

    let PORT = process.env.PORT || 3002;
    server.listen(PORT, function () {
      console.log(
        `server is running on port ${PORT}, http://46.28.44.182:${PORT}`
      );
    });
  })
  .catch((err) => {
    console.log(`ERROR on connection MongoDB: ${err}`);
  });
