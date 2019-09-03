const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');

const app = express();
const urlEndcodedParse = bodyParser.urlencoded({extended: false});
app.set('view engine', 'hbs');


const sequelize = new Sequelize('dev_db', 'infernet', 'admin', {
    dialect: 'mysql',
    host: 'localhost',
    define: {
        timestamps: false
    }
});
const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    age: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});
//one to many
const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});
const Company = sequelize.define('company', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
Company.hasMany(Product, {onDelete: "cascade"});

//many to many
const Student = sequelize.define('student', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
const Course = sequelize.define('course', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
//
const Enrolment = sequelize.define('enrolment', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    grade: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Student.belongsToMany(Course, {through: Enrolment});
Course.belongsToMany(Student, {through: Enrolment});

app.get('/', (req, res) => {
    Student.findOne({where: {name: "Tom"}})
        .then(student => {
            student.getCourses()
                .then(courses => {
                    for (course of courses) {
                        if (course.name == "JavaScript")
                            course.enrolment.destroy();
                    }
                    res.sendStatus(200);
                })
        })
});
app.get('/test', (req, res) => {
    Student.findOne({where: {name: "Tom"}})
        .then(student => {
            student.getCourses()
                .then(courses => {
                    let result = `<html><head><meta charset="UTF-8"></head><body>` +
                        `<h3>Sudent: ${student.name}</h3>`;
                    courses.forEach(course => {
                        result += `<p>Id: ${course.id}</p>` +
                            `<p>Name: ${course.name}</p>` +
                            `<p>Grade: ${course.enrolment.grade}</p>`;
                    });
                    result += `</body></html>`;
                    res.send(result);
                })
        })
});

app.get('/:id', (req, res) => {
    Company.findByPk(req.params.id)
        .then(company => {
            let result = `<html><head><meta charset="UTF-8"></head><body>`;
            company.getProducts()
                .then(data => {
                    data.forEach(e => {
                        result += `<p>Id: ${e.id}</p>` +
                            `<p>Name: ${e.name}</p>` +
                            `<p>Company: ${company.name}</p>`
                            + '<br><br>';
                    })
                    result += `</body></html>`;
                    res.send(result);
                });
        })
        .catch(reason => res.sendStatus(400));
});
//
// //select
// app.get('/', (req, res) => {
//     User.findAll({raw: true})
//         .then(data => {
//             res.render('index.hbs', {
//                 users: data
//             })
//         })
//         .catch(error => {
//             console.log(error);
//             res.sendStatus(400);
//         });
// });
// //insert
// app.get('/create', (req, res) => {
//     res.render('create.hbs')
// });
// app.post('/create', urlEndcodedParse, (req, res) => {
//     if (!req.body)
//         return res.sendStatus(400);
//     User.create({name: req.body.name, age: req.body.age})
//         .then(resolve => {
//             res.redirect('/');
//         })
//         .catch(reason => {
//             console.log(reason);
//             res.sendStatus(400);
//         });
// });
// //select for update
// app.get('/edit/:id', (req, res) => {
//     let userId = req.params.id;
//     User.findAll({where: {id: userId}, raw: true})
//         .then(data => {
//             res.render('edit.hbs', {
//                 user: data[0]
//             });
//         })
//         .catch(reason => {
//             console.log(reason);
//             res.sendStatus(400);
//         });
// });
// //update
// app.post('/edit', urlEndcodedParse, (req, res) => {
//     if (!req.body)
//         return res.sendStatus(400);
//     User.update({name: req.body.name, age: req.body.age}, {where: {id: req.body.id}})
//         .then(resolve => {
//             res.redirect('/');
//         })
//         .catch(reason => {
//             console.log(reason);
//             res.sendStatus(400);
//         });
// });
// //delete
// app.post('/delete/:id', (req, res) => {
//     User.destroy({where: {id: req.params.id}})
//         .then(resolve => res.redirect('/'))
//         .catch(reason => {
//             console.log(reason);
//             res.sendStatus(400);
//         });
// });

sequelize.sync({force: false})
    .then(result => {
        console.log(result);
        app.listen(process.env.PORT, process.env.HOST, () => {
            console.log('Server mysql&express ready http://' + process.env.HOST + ':' + process.env.PORT);
        });
    })
    .catch(error => {
        console.error(error);
    });


