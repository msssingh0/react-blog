const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const { User } = require('./models/user');
const {auth} = require('./middleware/auth');
const { compare } = require('bcrypt');

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
    console.log('req body',req.body);
    const user = new User(req.body);
    
    user.save((err,userData) => {
        if(err){
            return res.json({success:false,err}).status(400);
        }
        return res.json({success:true, userData}).status(200);
    });
});

app.get('/api/users/auth',auth, (req,res) => {
    res.status(200).json({
        _id: req._id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
    });
});

app.post('/api/users/login',(req,res) => {
    User.findOne({email: req.body.email}, (err,user) => {
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "Auth failed. Email not found",
            });
        }

        user.comparePassword(req.body.password,(err,isMatch)=>{
            if(!isMatch){
                return res.json({ loginSuccess: false, message: "wrong Password"});
            }
        });

        user.genrateToken((err,user)=> {
            if(err) return res.send(err).status(400);
            res.cookie("user_token",user.token).status(200).json({loginSuccess: true});
        });
    });
});

app.post('/api/users/logout',auth,(req,res) => {
    User.findOneAndUpdate({_id: req.user._id}, {token: ""}, (err,doc)=>{
        if(err) return res.json({ success: false,err}).status(400);
        return res.status(200).send({
            success:true,
        });
    });
});

const port = process.env.PORT || 5000;
app.listen(port, ()=> {
    console.log(`Server runniing at port ${port}`);
});