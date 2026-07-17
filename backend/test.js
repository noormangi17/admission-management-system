const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://admin:Admin123@cluster0.ut47j3n.mongodb.net/admission_system")
  .then(() => {
    console.log("CONNECTED");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });