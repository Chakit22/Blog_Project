const mongoose = require("mongoose");
require("dotenv").config();
const mongoUrl = process.env.MONGO_URL;

function connect_db(){
    mongoose.connect(
        mongoUrl,
        {
            useNewUrlParser:true,
            useUnifiedTopology:true
        }
    ).then(() => {
        console.log("Succesfully connected to mongo db!!");
    }).catch((err) => {
        console.log(err);
    });
}

module.exports = connect_db;