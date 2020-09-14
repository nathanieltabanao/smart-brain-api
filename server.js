const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const { response } = require('express');

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

const database = {
    users: [   
        {
            id: '123',
            name: 'Nate',
            email: 'nate@gmail.com',
            password: 'pass',
            entries: 0,
            joined: new Date(),
        },
        {
            id: '122',
            name: 'Sally',
            email: 'sallu@gmail.com',
            password: 'pass1',
            entries: 0,
            joined: new Date(),
        },
        {
            id: '125',
            name: 'Bwesit',
            email: 'giatayu@gmail.com',
            password: 'pass1',
            entries: 0,
            joined: new Date(),
        }
    ],
    login: [
        {
            id: '234',
            hash: '',
            email:'nate@gmail.com'
        }
    ]
}

app.get('/', (req,res)=> {
    res.send(database.users);
})

app.post('/signin', (req,res) => {
    // Load hash from your password DB.
    bcrypt.compare("bacon", '$2a$10$Id3NDoyTbwXCPQOUUDa3wuXeGZYmMzcbmoTerefjGHc5ciPtVuYnW', function(err, res) {
        // console.log('first guess', res);
    });
    bcrypt.compare("veggies", '$2a$10$Id3NDoyTbwXCPQOUUDa3wuXeGZYmMzcbmoTerefjGHc5ciPtVuYnW', function(err, res) {
        // res = false
        // console.log('second guess', res);
    });

    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json(database.users[0]);
            console.log(req.body.email,req.body.password, 'Login' )
        } else {
            res.status(400).json('error!');
        }
})

app.post('/register', (req,res) => {
    const {email, name, password} = req.body;
    db('users')
        .returning('*')
        .insert({
        email: email,
        name: name,
        joined: new Date()
    })
        .then(user => {
            res.json(user[0]);
        })
        .catch(err => res.status(400).json('Unable to register user'))
    
})

app.get('/profile/:id', (req,res) => {
    const { id } = req.params;
    let found = false;

    db.select('*').from('users').where({id})
    .then(user => {
        if(user.length) {
            res.json(user[0])
        } else {
            res.status(400).json('User not found') 
        }
    })
    .catch(err => res.status(400).json('Error getting User'))
})

app.put('/image', (req, res) => {
    const { id } = req.body
    
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entry => {
        console.log(entry[0])
    })
    .catch(err => res.status(400).json('Unable to get entries'))
})

// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });



app.listen(3000, () => {
    //console.log('app is shit');
})