require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});
console.log(process.env.API_KEY);
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("Users", userSchema);

app.get("/", (req, res) => {
    res.render("home");
})
app.get("/login", (req, res) => {
    res.render("login");
})
app.get("/register", (req, res) => {
    res.render("register");
})

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save((err) => {
        if(err) throw err;
        else {
            res.render("secrets");
        }
    });
});

app.post("/login", (req, res) => {
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({email: userName}, (err, found) => {
        if(err) throw err;
        else {
            console.log(found.password);
            if(found.password === password) {
                res.render("secrets");
            }
        }
    });
});

app.listen(3000, () => console.log("server started on port 3000"));
