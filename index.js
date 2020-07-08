const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:abcd1234@blog.h3ah2.mongodb.net/sample_airbnb?retryWrites=true&w=majority',
{useNewUrlParser:true})
.then(() => console.log('Db connected'))
.catch(err => console.log('error:',err));

app.get('/',(req,res) => {
    res.send("Hello Manish");
});

app.listen(5000);