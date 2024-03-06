var express = require("express");
var bodyParser = require("body-parser");
const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo:27017/Afrid');
var db = mongoose.connection;

db.on('error', console.log.bind(console, "connection error"));
db.once('open', function (callback) {
    console.log("connection succeeded");
});

var app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// Validations
function isValidEmail(email) {
    // Regular expression for basic email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhoneNumber(phone) {
    return /^\d{10}$/.test(phone);
}

app.post('/sign_up', function(req, res) {
    var fullName = req.body.fullName;
    var dob = req.body.dob;
    var gender = req.body.gender;
    var ssn = req.body.ssn;
    var maritalStatus = req.body.maritalStatus;
    var phone = req.body.phone;
    var email = req.body.email;

    var data = {
        "fullName": fullName,
        "dob": dob,
        "gender": gender,
        "ssn": ssn,
        "maritalStatus": maritalStatus,
        "phone": phone,
        "email": email
    };

    if (!isValidEmail(email)) {
        return res.status(400).send("Invalid email address");
    }
    if (!isValidPhoneNumber(phone)) {
        return res.status(400).send("Invalid phone number");
    }

    db.collection('details').insertOne(data, function (err, collection) {
        if (err) {
            console.error("Error saving user details:", err);
            return res.status(500).send("Error saving user details");
        }
        console.log("User details saved successfully:", data);
        return res.redirect('/signup_success.html');
    });
});

app.get('/', function(req, res) {
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    return res.redirect('index.html');
});

app.listen(3000, function() {
    console.log("server listening at port 3000");
});
