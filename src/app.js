const express=require('express');
const bodyParser=require('body-parser');
const multer  = require("multer");
const app=express();
const storageConfig=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads");
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
});
const fileFilter=(req,file,cb)=>{
  if(file.mimetype==="image/png" || file.mimetype==="image/jpg" || file.mimetype==="image/jpeg")
      cb(null,true);
  else
      cb(null,false);
};
//Routers
const userRouter=require("../routes/userRouter.js");
const homeRouter=require("../routes/homeRouter.js");

app.set('view engine','hbs');
app.use(bodyParser.urlencoded({extended: false}));

app.use('/users',userRouter);
app.use('/',homeRouter);

app.post('/upload',multer({storage:storageConfig,fileFilter:fileFilter}).single('filedata'),(req,res,next)=>{
    let filedata=req.file;
    console.log(filedata);
    if(!filedata)
        res.send('Error');
    else
        res.send('Successful');
});

app.use((req,res,next)=>{
    res.status(404).send('Страница не найдена');
});


app.listen(process.env.PORT, process.env.HOST, () => {
    console.log('Server mysql&express ready http://' + process.env.HOST + ':' + process.env.PORT);
});