const express = require('express');
const fileStream = require('fs');
const app = express();
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(fileStream.readFileSync('./public/index.html', { encoding: "UTF-8" }));
});
app.listen(3000, () => console.log('Server ready'))
process.on('SIGTERM', () => {
    app.close(() => {
        console.log('Process terminated')
    })
})