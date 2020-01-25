//importing express and morgan
const express = require('express');
const morgan = require('morgan');

//setting app to express method
const app = express();

//Setting morgan
app.use(morgan('dev'))

//Response
app.use((req, res) => {
    res.send('Hello, world!!')
});

//Setting port
const PORT = 8000;

//Listener
app.listen(PORT, () => {
    console.log(`Serving on PORT ${PORT}`)
});