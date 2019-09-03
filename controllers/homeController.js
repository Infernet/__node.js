exports.index = (req, res) => {
    res.render("index.hbs");
};
exports.about = (req, res) => {
    res.send("О сайте");
};