const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const profile = require('./controllers/profile');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '1234',
      database : 'smart-brain'
    }
  });

db.select('*').table('users').then( data => {
    console.log(data);
})

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res)=> {
    res.send(database.users);
})

app.post('/signin', (req, res) => {signin.handleSignIn(req, res, db, bcrypt)})

app.post('/register', (req, res) => {register.handleRegister(req,res, db, bcrypt)})

app.put('/image', (req, res) => {image.handleImage(req, res, db)})

app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, db)})

app.post('/imageurl', (req, res) => {image.handleApiCall(req,res)})



// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });



app.listen(3000, () => {
    //console.log('app is shit');
})