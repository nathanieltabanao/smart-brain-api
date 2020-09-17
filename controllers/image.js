const Cllarifai = require ('clarifai');

const app = new Clarifai.App({apiKey: '2280267f608c487993f64a14e944c6fd'});

const handleApiCall = (req, res) => {
    app.models.predict('a403429f2ddf4b49b307e318f00e528b', req.body.input)
        .then(data => {
            res.json(data)
        })
        .catch(err => res.status(400).json('API not Working'))
}

const handleImage = (req, res, db) => {
    const { id } = req.body
    
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entry => {
        console.log(entry[0], id)
    })
    .catch(err => res.status(400).json('Unable to get entries'))
}

module.exports = {
    handleImage: handleImage,
    handleApiCall
}