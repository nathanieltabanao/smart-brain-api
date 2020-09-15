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

app.get('/', (req,res)=> {
    res.send(database.users);
})

app.post('/signin', (req,res) => {
    db.select('email','hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
        if(isValid) {
            return db.select('*').from('users')
                .where('email', '=', req.body.email)
                .then(user => {
                    res.json(user[0])
                })
            .catch(err => res.status(400).json('Unable to get user'))
        } else {
            res.status(400).json('Invalid Credentials')
        }
    })
    .catch(err => res.status(400).json('Invalid Credentials'))
})

app.post('/register', (req,res) => {
    const {email, name, password} = req.body;

    var hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
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