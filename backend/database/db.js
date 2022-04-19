const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Database Connected!"))
  .catch((err) => {
    console.log(err);
  });
module.exports = mongoose;
