const express = require('express');
// const fileStream = require('fs');
const Emitter = require("events");
const util = require("util");

const app = express();


class User extends Emitter {
    sayHi(data) {
        this.emit(eventName, data);
    }
}


// util.inherits(User, Emitter);

let eventName = 'greet';
// User.prototype.sayHi = function(data) { this.emit(eventName, data) };
let user = new User();
user.on(eventName, (data) => console.log('Сработало событие: ' + data));

app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.send('hello, world');
});


app.listen(process.env.PORT, process.env.HOST, () => {
    console.log('Server ready http://' + process.env.HOST + ':' + process.env.PORT);
    user.sayHi("Мне нужна твоя одежда...");
});
process.on('SIGTERM', () => {
    app.close(() => {
        console.log('Process terminated')
    })
})