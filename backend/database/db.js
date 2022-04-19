const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose
  .connect(
    "mongodb+srv://uditesh:jha.udit@cluster0.cgwdo.mongodb.net/taskmanager?retryWrites=true&w=majority"
  )
  .then(() => console.log("Database Connected!"))
  .catch((err) => {
    console.log(err);
  });
module.exports = mongoose;
