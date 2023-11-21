const dotenv = require("dotenv");

dotenv.config();

const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

const connectionString = process.env.MONGO_URL;

mongoose.connect(connectionString, )
  .then(() => {
    console.log("MongoDB connection succeed");
    const server = require("./app");

    let PORT = process.env.PORT || 3002;
    server.listen(PORT, function () {
      console.log(`server is running on port ${PORT}, http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.log(`ERROR on connection MongoDB: ${err}`);
  });