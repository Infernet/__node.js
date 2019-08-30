//ejs
app.set("view engine", "ejs");

app.use('/contact', (req, res) => {
    res.render("contact", {
        title: "Мои контакты",
        emails: ["gavgav@mycorp.com", "mioaw@mycorp.com"],
        phone: "+1234567890"
    });
})





//hbs
const hbs = require("hbs");
const expressHbs = require("express-handlebars");
// устанавливаем настройки для файлов layout
app.engine("hbs", expressHbs({
    layoutsDir: "templates/layouts",
    defaultLayout: "layout",
    extname: "hbs",
    helpers: {
        getTime: () => {
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
        },
        createStringList: (array) => {
            var result = "";
            for (var i = 0; i < array.length; i++) {
                result += "<li>" + array[i] + "</li>";
            }
            return new hbs.SafeString("<ul>" + result + "</ul>");
        }
    }
}));

app.set("view engine", "hbs");
app.set("views", "templates");
hbs.registerPartials("./templates/partials");


app.set('view engine', 'handlebars');







app.use('/contact', (req, res) => {
    res.render("contact.hbs", {
        title: 'Мои контакты',
        emailsVisible: true,
        emails: ["gavgav@mycorp.com", "mioaw@mycorp.com"],
        phone: '+8-(800)-535-35-35'
    });
});

app.use("/home", (req, res) => {
    res.render("home.hbs", {
        fruit: ["apple", "lemon", "banana", "grape"]
    });
});













//pug
app.set('view engine', 'pug');
app.use('/contact', (req, res) => {
    res.render('contact', {
        title: "Мои контакты",
        emails: ["gavgav@mycorp.com", "mioaw@mycorp.com"],
        phone: "+1234567890"
    });
});