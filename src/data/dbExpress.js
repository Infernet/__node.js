const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const urlEndcodedParse = bodyParser.urlencoded({extended: false});

const pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'infernet',
    password: 'admin',
    database: 'blog_db'
});

app.set('view engine', 'hbs');
//отображение всех пользователей
app.get('/', (req, res) => {
    pool.promise().query("select * from users")
        .then(data => {
            res.render('index.hbs', {
                users: data[0]
            });
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(400).send('<h1>Ошибка при попытке подключиться к базе данных</h1>');
        });
});
//форма добавления
app.get('/create', (req, res) => {
    res.render('create.hbs');
});
//обработка формы добавления
app.post('/create', urlEndcodedParse, (req, res) => {
    if (!req.body)
        return res.sendStatus(400);
    let user = {
        name: req.body.name,
        age: req.body.age
    };
    pool.promise().query("insert into users(name,age) values(?, ?)", [user.name, user.age])
        .then(data => {
            res.redirect('/');
        })
        .catch(error => {
            console.log("Ошибка при попытке добавления пользователя POST:/create\n" + error);
            res.sendStatus(400).send(`Ошибка при добавлении пользователя ${user.name}`);
        })
});
//редактирование пользователя
app.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    pool.promise().query('select * from users where id=?', [id])
        .then(data => {
            res.render('edit.hbs', {
                user: data[0][0]
            });
        })
        .catch(error => {
            console.log("Ошибка при попытке изменить данные пользователя GET:/edit/:id(" + id + ")\n" + error);
            res.sendStatus(400);
        });
});
//обработка отредактированных данных
app.post('/edit', urlEndcodedParse, (req, res) => {
    if (!req.body)
        return res.sendStatus(400);
    let user = {
        id: req.body.id,
        name: req.body.name,
        age: req.body.age
    };

    pool.promise().query('update users set name=?, age=? where id=?', [user.name, user.age, user.id])
        .then(data => {
            res.redirect('/');
        })
        .catch(error => {
            console.log('Ошибка при обработке запроса на изменения данных пользователя POST:/edit\n' + error);
            res.sendStatus(400);
        });
});
//удаление выбранного пользователя
app.post('/delete/:id', (req, res) => {
    let id = req.params.id;
    pool.promise().query('delete from users where id=?', [id])
        .then(data => {
            res.redirect('/');
        })
        .catch(error => {
            console.log('Ошибка при попытке удалить пользователя POST:/delete/:id(' + id + ")\n" + error);
            res.sendStatus(400);
        });
})


app.listen(process.env.PORT, process.env.HOST, () => {
    console.log('Server mysql&express ready http://' + process.env.HOST + ':' + process.env.PORT);
});