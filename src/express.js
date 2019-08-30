const express = require('express');
const bodyParser = require("body-parser");
const fs = require('fs');

const app = express();
// const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = express.json();

const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "infernet",
    database: "blog_db",
    password: "admin"
});


app.use(express.static("./public"));


app.use(express.static(__dirname + "/public"));
// получение списка данных
app.get("/api/users", function(req, res) {

    var content = fs.readFileSync(__dirname + "/data/users.json", "utf8");
    var users = JSON.parse(content);
    res.send(users);
});
// получение одного пользователя по id
app.get("/api/users/:id", function(req, res) {

    var id = req.params.id; // получаем id
    var content = fs.readFileSync(__dirname + "/data/users.json", "utf8");
    var users = JSON.parse(content);
    var user = null;
    // находим в массиве пользователя по id
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            user = users[i];
            break;
        }
    }
    // отправляем пользователя
    if (user) {
        res.send(user);
    } else {
        res.status(404).send();
    }
});
// получение отправленных данных
app.post("/api/users", jsonParser, function(req, res) {

    if (!req.body) return res.sendStatus(400);

    var userName = req.body.name;
    var userAge = req.body.age;
    var user = { name: userName, age: userAge };

    var data = fs.readFileSync(__dirname + "/data/users.json", "utf8");
    var users = JSON.parse(data);

    // находим максимальный id
    var id = Math.max.apply(Math, users.map(function(o) { return o.id; }))
        // увеличиваем его на единицу
    user.id = id + 1;
    // добавляем пользователя в массив
    users.push(user);
    var data = JSON.stringify(users);
    // перезаписываем файл с новыми данными
    fs.writeFileSync(__dirname + "/data/users.json", data);
    res.send(user);
});
// удаление пользователя по id
app.delete("/api/users/:id", function(req, res) {

    var id = req.params.id;
    var data = fs.readFileSync(__dirname + "/data/users.json", "utf8");
    var users = JSON.parse(data);
    var index = -1;
    // находим индекс пользователя в массиве
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            index = i;
            break;
        }
    }
    if (index > -1) {
        // удаляем пользователя из массива по индексу
        var user = users.splice(index, 1)[0];
        var data = JSON.stringify(users);
        fs.writeFileSync(__dirname + "/data/users.json", data);
        // отправляем удаленного пользователя
        res.send(user);
    } else {
        res.status(404).send();
    }
});
// изменение пользователя
app.put("/api/users", jsonParser, function(req, res) {

    if (!req.body) return res.sendStatus(400);

    var userId = req.body.id;
    var userName = req.body.name;
    var userAge = req.body.age;

    var data = fs.readFileSync(__dirname + "/data/users.json", "utf8");
    var users = JSON.parse(data);
    var user;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == userId) {
            user = users[i];
            break;
        }
    }
    // изменяем данные у пользователя
    if (user) {
        user.age = userAge;
        user.name = userName;
        var data = JSON.stringify(users);
        fs.writeFileSync(__dirname + "/data/users.json", data);
        res.send(user);
    } else {
        res.status(404).send(user);
    }
});



// app.get('/forms', (req, res) => {
//     res.redirect(301, 'static/forms.html');
// });

// app.use(function(request, response, next) {

//     let now = new Date();
//     let hour = now.getHours();
//     let minutes = now.getMinutes();
//     let seconds = now.getSeconds();
//     let data = `${hour}:${minutes}:${seconds} ${request.method} ${request.url} ${request.get("user-agent")}`;
//     console.log(data);
//     fs.appendFile("./logs/server.log", data + "\n", function() {});
//     next();
// });


// app.get('/register/', urlencodedParser, (req, res) => {
//     res.redirect(301, '/static/register.html');
// });
// app.post('/register', urlencodedParser, (req, res) => {
//     if (!req.body)
//         return res.sendStatus(404);
//     console.log(req.body);
//     res.send(`${req.body.userName} - ${req.body.userAge}`);
// });



// app.get("/game", (req, res) => {
//     res.redirect(301, 'static/game.html');
// });

// app.get('/test', (req, res) => {
//     res.send({ 'gg': 3, 'test': 'test msg', 'obj': { 'first': 0 } });
// });


// const addRouter = express.Router();



// addRouter.get('/:x/:y', (req, res, next) => {
//     if (!(isNaN(req.params['x']) || isNaN(req.params['y']))) {
//         let summ = +req.params['x'];
//         summ += +req.params['y'];
//         res.send(`Сумма x(${req.params['x']}) + y(${req.params['y']}) равна: ${summ}`);
//     } else
//         next();
// });

// addRouter.get('/', (req, res, next) => {
//     if (!isNaN(req.query.x) && !isNaN(req.query.y)) {
//         let summ = +req.query.x;
//         summ += +req.query.y;
//         res.send(`<h3>Результат сложения по GET x(${req.query.x}) + y(${req.query.y}): ${summ}</h3>`);
//     } else
//         next();
// });

// app.use('/add/', addRouter);


// app.get('/buffer', (req, res) => {
//     console.log("Route /buffer");
//     res.send(Buffer.from("Hello, world", "utf8"));
// })


// app.get("/", (req, res) => {
//     res.redirect(301, '/static/index.html');
// });

// app.post('/user', jsonParser, (req, res) => {
//     console.log(req.body);
//     if (!req.body)
//         return res.sendStatus(400);

//     req.body.userName = 'server_name';
//     res.json(req.body);
// });

// app.use((req, res) => {
//     res.status(404).send('<h3>Page Not Found</h3>');
// })


app.listen(process.env.PORT, process.env.HOST, () => {
    console.log('Server ready http://' + process.env.HOST + ':' + process.env.PORT);
});