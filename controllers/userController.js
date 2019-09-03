const User = require("../models/user.js");

exports.addUser = (req, res) => {
    res.render("create.hbs");
};
exports.getUsers = (req, res) => {
    res.render('user.hbs', {
        users: User.getAll()
    });
};
exports.postUser = (req, res) => {
    let data = {
        name: req.body.name,
        age: req.body.age
    };
    let user = new User(data.name, data.age);
    user.save();
    res.redirect('/users');
};