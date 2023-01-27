require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const encry = require("mongoose-encryption");

const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/secretUserDatabase');


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    requried: true
  }
});


userSchema.plugin(encry, {secret: process.env.PASSWORD, encryptedFields: ['password']});

const User = mongoose.model('User', userSchema);


const app = express();
const port = 3000;

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extened: true
}));



app.route('/')
  .get((req, res) => {
    res.render('home')
  })
  .post((req, res) => {
    res.send("Thank you for the post")
});



app.route('/login')
  .get((req, res) => {
    res.render('login')
  })
  .post((req, res) => {

    let username = req.body.username;
    let password = req.body.password;
    console.log(username, password);

    User.findOne({email: username}, (err, result) => {
      if(result){
        if (result.password === password){
          res.render('secrets');
        }
      } else{
        if(err){
          console.log(err);
          res.send('An Error Occured While Attempting to log you in');
        } else{
          console.log('Error: User Not Found');
          res.send('Error: User Not Found')
        }
      }
    });
});



app.route('/register')
  .get((req, res) => {
    res.render('register');
  })
  .post((req, res) => {
    const newUser = new User({

      email: req.body.username,
      password: req.body.password
    
    });

    newUser.save(err => {
      if (err){
        console.log(err);
      } else{
        console.log("Added");
        res.render('secrets');
      }
    });
  });



app.route('/submit')
  .get((req, res) => {
    res.render('submit')
});

app.get("/logout", (req, res) => {
  res.redirect("/");
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});