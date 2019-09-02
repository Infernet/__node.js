const express = require('express');
const Sequelize=require('sequelize');
const bodyParser=require('body-parser');

const app = express();
const urlEndcodedParse = bodyParser.urlencoded({ extended: false });
const sequelize=new Sequelize('blog_db','infernet','admin',{
    dialect:'mysql',
    host:'localhost',
    define: {
        timestamps: false
    }
});

const User=sequelize.define('user',{
   id:{
       type: Sequelize.INTEGER,
       autoIncrement:true,
       primaryKey:true,
       allowNull:false
   },
    name:{
       type:Sequelize.STRING,
        allowNull: false
    },
    age:{
       type:Sequelize.INTEGER,
        allowNull:false
    }
});
//
// sequelize.sync({force: true}).then(result=>{
//     console.log(result);
// })
//     .catch(error=>{
//         console.error(error);
//     });
//
//
app.use('/static',express.static("./public"));

app.get('/create',(req,res)=>{
   res.redirect('/static/sequelize.html');
});

app.get('/',(req,res)=>{
    User.findAll({raw:true})
        .then(users=>{
            let body="<!DOCTYPE html>" +
                "<html lang=\"en\">" +
                "<head>" +
                "    <meta charset=\"UTF-8\">" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "    <meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\">" +
                "    <title>Title</title>" +
                "</head>" +
                "<body>"+
                "<a href='/create'>Добавить запись</a>"+
                "<table><thead><th>ID</th><th>Name</th> <th>Age</th></thead>";
            users.forEach((user)=>{
                body+=`<tr><td>${user.id}</td><td>${user.name}</td><td>${user.age}</td></tr>`;
            });
            body+="</table></body></html>";
            res.status(200).send(body);
        })
        .catch(error=>{
            res.sendStatus(400);
        });
});

app.post('/create',urlEndcodedParse,(req,res)=>{
    if(!req.body)
        return res.sendStatus(400);
    User.create({
        'name':req.body.name,
        'age':req.body.age
    })
        .then(result=>{
            res.redirect('/');
        })
        .catch(error=>{
            console.log(error);
            res.status(400).send('Ошибка при попытке добавления нового пользователя'+
             `{name: ${req.body.name},age:${req.body.age}}`);
        })
});
















app.listen(process.env.PORT, process.env.HOST, () => {
    console.log('Server mysql&express ready http://' + process.env.HOST + ':' + process.env.PORT);
});