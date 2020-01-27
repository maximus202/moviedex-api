//importing express and morgan
require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const MOVIEDEX = require('./moviedex.json');
const helmet = require('helmet');
const cors = require('cors');

//setting app to express method
const app = express();

//Setting morgan
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))

app.use(helmet())
app.use(cors())

//Validation
app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    //move to next middleware if request is authenticated
    next()
})

//Create API Response
app.get('/movies', function handleGetMovies(req, res) {
    let response = MOVIEDEX;

    //Search by genre (match specific string), case insensitive
    if (req.query.genre) {
        response = response.filter(movie =>
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
    }

    //Search by country (match specific string), case insensitive
    if (req.query.country) {
        response = response.filter(movie =>
            movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        )
    }

    //Search by avg. vote (Greater than or equal to the supplied number)
    if (req.query.avg_vote) {
        response = response.filter(movie =>
            movie.avg_vote >= req.query.avg_vote
        )
    }

    //response
    res.json(response);
});

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_END === !'production') {
        response = { error: { message: 'server error' } }
    } else {
        response = { error }
    }
    res.status(500).json(response)
})

//Setting port
const PORT = process.env.PORT || 8000;

//Listener
app.listen(PORT);