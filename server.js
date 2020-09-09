const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

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
        console.log('first guess', res);
    });
    bcrypt.compare("veggies", '$2a$10$Id3NDoyTbwXCPQOUUDa3wuXeGZYmMzcbmoTerefjGHc5ciPtVuYnW', function(err, res) {
        // res = false
        console.log('second guess', res);
    });

    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json('success');
        } else {
            res.status(400).json('error!');
        }
})

app.post('/register', (req,res) => {
    const {email, name, password} = req.body;
    database.users.push({
            id:'126',
            name: name,
            email: email,
            password: password,
            entries: 0,
            joined: new Date(),
    })
    res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req,res) => {
    const { id } = req.params;
    let found = false;

    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        } 
    })
    if(!found) {
        res.status(400).json('User not found!');
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body
    let found = false;

    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        } 
    })
    if(!found) {
        res.status(400).json('User not found!');
    }
})

// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });



app.listen(3000, () => {
    console.log('app is shit');
})