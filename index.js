const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const { User } = require('./models/user');

mongoose.connect(config.mongoURI,{useNewUrlParser:true})
    .then(() => console.log('Db connected'))
    .catch(err => console.log('error:',err));

app.get('/',(req,res) => {
    res.send("Hello Manish");
});

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.post('/api/users/register', (req, res) => {
    console.log(req.body);
    const user = new User(req.body);
    
    user.save((err,userData) => {
        if(err){
            return res.json({success:false,err});
        }
        return res.json({success:true}).status(200);
    });
});

app.listen(5000);