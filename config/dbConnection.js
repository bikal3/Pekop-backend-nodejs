const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/hotelfinance", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected successfully..."))
  .catch((error) => console.log(error));
