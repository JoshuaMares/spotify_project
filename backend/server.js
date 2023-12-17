require('dotenv').config()
const express = require('express');

const app = express();
app.listen(process.env.PORT, () => console.log('listening on port 4000'));

app.use((req, res, next) => {
    console.log('PATH: ', req.path);
    console.log('METHOD: ', req.method);
    next();
});

app.get('/', (req, res) => {
    res.json({'mssg': 'Welcome to the app'});
});