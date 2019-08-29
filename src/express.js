const express = require('express');
const fs = require('fs');
const bodyParser = require("body-parser");
const hbs = require("hbs");
const expressHbs = require("express-handlebars");

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = express.json();


// устанавливаем настройки для файлов layout
app.engine("hbs", expressHbs({
    layoutsDir: "views/layouts",
    defaultLayout: "layout",
    extname: "hbs",
}));

app.set("view engine", "hbs");
//app.set("views", "templates");
hbs.registerPartials("./views/partials");

hbs.registerHelper('getTime', () => {
    let myDate = new Date();
    let hour = myDate.getHours();
    let min = myDate.getMinutes();
    let sec = myDate.getSeconds();

    if (min < 10)
        min = '0' + min;
    if (sec < 10)
        sec = '0' + sec;
    let res = `Текущее время: ${hour}:${min}:${sec}`;
    return res;
});

console.log(hbs.handlebars.helpers.getTime());


app.use('/static/', express.static(__dirname + "/../public"));


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

app.use('/contact', (req, res) => {
    res.render("contact.hbs", {
        title: 'Мои контакты',
        emailsVisible: true,
        emails: ["gavgav@mycorp.com", "mioaw@mycorp.com"],
        phone: '+8-(800)-535-35-35'
    });
});

app.use("/home", (req, res) => {
    res.render("home.hbs");
});




app.get('/register', urlencodedParser, (req, res) => {
    res.redirect(301, 'static/register.html');
});
app.post('/register', urlencodedParser, (req, res) => {
    if (!req.body)
        return res.sendStatus(404);
    console.log(req.body);
    res.send(`${req.body.userName} - ${req.body.userAge}`);
});



app.get("/game/", (req, res) => {
    res.redirect(301, 'static/game.html');
});

app.get('/test', (req, res) => {
    res.send({ 'gg': 3, 'test': 'test msg', 'obj': { 'first': 0 } });
});


const addRouter = express.Router();



addRouter.get('/:x/:y', (req, res, next) => {
    if (!(isNaN(req.params['x']) || isNaN(req.params['y']))) {
        let summ = +req.params['x'];
        summ += +req.params['y'];
        res.send(`Сумма x(${req.params['x']}) + y(${req.params['y']}) равна: ${summ}`);
    } else
        next();
});

addRouter.get('/', (req, res, next) => {
    if (!isNaN(req.query.x) && !isNaN(req.query.y)) {
        let summ = +req.query.x;
        summ += +req.query.y;
        res.send(`<h3>Результат сложения по GET x(${req.query.x}) + y(${req.query.y}): ${summ}</h3>`);
    } else
        next();
});

app.use('/add/', addRouter);


app.get('/buffer', (req, res) => {
    console.log("Route /buffer");
    res.send(Buffer.from("Hello, world", "utf8"));
})


app.get("/", (req, res) => {
    res.redirect(301, 'static/index.html');
});

app.post('/user', jsonParser, (req, res) => {
    console.log(req.body);
    if (!req.body)
        return res.sendStatus(400);

    req.body.userName = 'server_name';
    res.json(req.body);
});

app.use((req, res) => {
    res.status(404).send('<h3>Page Not Found</h3>');
})


app.listen(process.env.PORT, process.env.HOST, () => {
    console.log('Server ready http://' + process.env.HOST + ':' + process.env.PORT);
});