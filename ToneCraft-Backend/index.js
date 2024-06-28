const pinataSdk = require('@pinata/sdk');
const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const upload = multer( {dest: 'uploads/' });
require('dotenv').config()
const PORT = process.env.PORT || 5000;
const pinata = new pinataSdk(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

app.use(express.json({limit:"200mb"}));
app.use(express.urlencoded({limit:"200mb",extended: true ,parameterLimit:5000}));
app.use(cors());

function Verify(req, res, next) {
    const { user, password } = req.query;
    if(user !== process.env.USER_ID && password !== process.env.PASSWORD) return res.redirect('/');
    next();
}

function clearUpload(){
    fs.rm(path.join(__dirname,'./uploads'),{recursive:true ,force:true},()=>{
        fs.mkdirSync(path.join(__dirname,'./uploads'))
    })
}

async function pinFile(file){
   const fileStream =  fs.createReadStream(path.join(__dirname,file.path));
   const options = {
    pinataMetadata: {
                name: file.filename
                },
    pinataOptions: {
                cidVersion: 0
            }
        }
    try{

        let Data = await pinata.pinFileToIPFS(fileStream,options)
        if(Data) return Data
    }
    catch(err){
        console.log(err);1223
        throw {success:false}
    }

    
}

app.get('/', async (req, res) => {
    let result = await pinata.testAuthentication();
    return res.json(result);
});

app.use(Verify);

app.post('/api/upload',upload.single('audio') ,async (req, res) => {

    try{    
        var spawn = require("child_process").execFile;
        var process = spawn('python3',['dummy.py',path.join(__dirname,req.file.path)]);
        process.on('exit',()=>{
            pinFile({path:'combined_audio.mp3',filename:req.file.filename}).then((data)=>{
                res.json(data);
                clearUpload();
            })
            .catch((err) => {
                console.log(err)
                res.status(500).json(err)
            })
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json(err)
    }
    
    

    return res;
});

app.post('/api/nft',async (req, res) => {
    console.log("I am here master");
    try{
    const options = {
        pinataOptions: {
            cidVersion: 0
        }
    };
    const body=JSON.parse(req.body.data);
    console.log(req.body,"request body");
    const result = await pinata.pinJSONToIPFS(body, options);
    console.log(result+"result");
    res.json(result);
    }
    catch(err){
        res.status(500).json(err);
    }
 

    return res;
});

// app.get('/test', async (req, res) => {

//     try{    
//         var spawn = require("child_process").execFile;
//         var process = spawn('python3',['dummy.py','./uploads/manas.pdf']);
    
        
//         process.on('exit',(e)=>console.log(e))
//     }
//     catch(err){
//         console.log(err);
//     }
//     return res.send("yyyy")
// })

app.listen(PORT, () => {
    console.log('Listening to port 5000....');
});