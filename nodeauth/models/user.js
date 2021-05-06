var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/nodeauth', {useNewUrlParser: true});

mongoose.connection
.once('open', () => console.log('MONGODB CONNECTED'))
.on('error', (error) => {
    console.log('YOUR ERROR:' + error);
});

var db = mongoose.connection;
console.log('connection' +db);
// Define User Schema
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password:{
        type : String
    },
    email:{
        type: String
    },
    name:{
        type: String
    },
    profileimage:{
        type: String
    }
});

var User = module.exports = mongoose.model('User', UserSchema);
module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback)
{
    var  query = {username: username};
    User.findOne(query, callback);
}
module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch)
    {
        callback(null, isMatch);
    });
}
module.exports.createUser = function(newUser, callback)
{
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
        });
    });    
}

