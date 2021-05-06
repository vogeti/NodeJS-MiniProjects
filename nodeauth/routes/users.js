var express = require('express');
//const { validationResult } = require('express-validator');
var router = express.Router();
var multer = require('multer');
// Handle File Uploads
var upload = multer({dest:'./uploads'});
var User = require('../models/user')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource',{title: 'Members'});
});
// Register route
router.get('/register', function(req, res, next) {
  res.render('register', {title: 'Register'});
});

//Login route
// Register route
router.get('/login', function(req, res, next) {
  res.render('login', {title:'Login'});
});


router.post('/login',
passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Invalid username or password'}),
function(req,res)
{
  console.log('coming through success');
  req.flash('success', 'You are now registered and can login.');
  res.redirect('/');
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
  User.getUserByUsername(username, function(err, user)
  {
    if(err) throw err;
    if(!user) 
    {
      return done(null, false, {message: 'Invalid user'})
    }
    User.comparePassword(password, user.password, function(err, isMatch){
      console.log('user passworddddd:' + user.password);
      if(err) return done(err);
      if(isMatch) {
        console.log('ismatch');
        return done(null, user);
      }
      else {
        console.log('isNOTmatch');
        return done(null, false, {message: 'Invalid Password'});
      }
    });
  });
}));

// Register route
router.post('/register', upload.single('profileimage'), function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;

  if(req.file)
  {
    console.log('File uploaded success');
    var profileimage = req.file.filename;
  }
  else {
    console.log('No filed uploaded');
    var profileimage = 'noimage.jpeg';
  }
  
  // Form validations
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('confirmpassword', 'Password do not match').equals(password);

  //Check Errors
  var errors = req.validationErrors();
  if(errors)
  {
    res.render('register', {
      errors: errors
    });
  }
  else {
    var newUser = new User({
      name: name,
      email:email,
      username:username,
      password:password,
      profileimage:profileimage
    });
  User.createUser(newUser , function(err, user)
  {
    if(err) throw err;
  });
  req.flash('success', 'You are now registered and can login.');
  res.location('/');
  res.redirect('/');
  }
});


// router.get('/logout',function(req, res, next) {
//   res.render('logout', {title:'login'});
// });

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/users/login');
})

module.exports = router;
