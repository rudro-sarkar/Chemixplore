require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const path = require('path');

const app = express();

const PORT = 4001;

app.set('view engine', 'ejs');
app.set('views', path.resolve('templates'));

app.use(express.static(path.resolve('public')));
app.use(express.urlencoded({extended: true}));

// Database connection
const mongo_uri = process.env.MONGO_URI;
mongoose.connect(mongo_uri).then(() => {
    console.log("Connected to DB");
}).catch(err => console.log(err));

// Routes
const landing_router = require("./routes/landing");
const main_router = require("./routes/main");

app.use(landing_router);
app.use(main_router);

app.listen(PORT, () => {
    console.log(`Server is now listening on port ${PORT}`);
});
