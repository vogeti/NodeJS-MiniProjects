var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var nodeMailer = require('nodemailer');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req,res){
    res.render('index',{'title':'Computer Not Working?'});
});

app.get('/about', function(req,res){
    res.render('about',{'AboutUs': 'About Us'})
})

app.get('/contact', function(req,res){
    res.render('contact')
})

app.post('/contact/send', function(req,res){
    var transporter = nodeMailer.createTransport(
        {
            service : 'Gmail',
            auth: 
            {
                user: 'vaditya.vogeti@gmail.com',
                pass: 'creatingapassword'
            }
        });

    var mailOptions =
    {
        from: 'Aditya Vogeti <vaditya.vogeti@gmail.com>',
        to: 'vaditya.vogeti@gmail.com',
        subject: 'Website submission',
        text: 'You have a submission with the following details... Name: ' + req.body.name + ' Email: '+req.body.email + ' Message: ' + req.body.message,
        html: '<p> You have submission with following details... </p> <ul> <li>Name: ' + req.body.name+ '</li><li>Email: ' + req.body.email + '</li><li>' + req.body.message + '</li></ul>'
    };
    transporter.sendMail(mailOptions, (error, info) =>
    {
        if(error)
        {
            console.log(error);
            res.redirect('/');
        }
        else 
        {
            console.log('Message Sent: ' + info.response);
            res.redirect('/');

        }
    });

});
app.listen(3000);
console.log('Listening on 3000...');