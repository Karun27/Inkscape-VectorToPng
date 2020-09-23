const express = require('express');
const app = express();
const fs = require("fs");
const nodeCmd = require('node-cmd');
const bodyParser = require('body-parser');
const multer = require('multer');
const appRoot = require('app-root-path');
const base64Img = require("base64-img");
const util = require('util');
const exec = util.promisify(require('child_process').exec);

app.use(bodyParser.json({limit: '50mb',extended: true}));
app.use(express.static('public'));
app.use(express.static('convertedFiles'));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit:50000}));
const upload = multer({ dest: '/tmp' })

app.get('/', function (req, res) {
     res.sendFile(__dirname + "/" + "fileupload.html");
})

async function lsWithGrep(convert,src) {
     try {
           console.log('====================started processing file ===================');
           console.log(convert);
           console.log(src);
           const commandFile = 'inkscape --export-filename=C:\\Users\\kkatasani\\FSG\\inkscape-test\\convertedfiles\\'+convert+' C:\\Users\\kkatasani\\FSG\\inkscape-test\\'+src;
         console.log("Commmand File", commandFile)
           const { stdout, stderr } = await exec(commandFile);
         console.log('stdout:', stdout);
         console.log('stderr:', stderr);
     }catch (err) {
           console.log(err);
           console.log('entered error phase');
     };
   };

app.post('/file_upload', upload.single("file"), function (req, res) {
     var convert = '';
     console.log("Request is ", req)
     const file = __dirname + "/" + req.file.originalname;
     fs.readFile(req.file.path, function (err, data) {
          fs.writeFile(file, data, async function (err) {
               if (err) {
                    console.error(err);
                    response = {
                         message: 'Sorry, file couldn\'t be uploaded.',
                         filename: req.file.originalname
                    };
               } else {
                    const src = req.file.originalname
                    console.log("Source file", src);
                    const path = src.split(".");
                    const name = path[0];
                    console.log("Path", path[0])
                    convert = name.concat(".png");
                    console.log("Convert", convert)
                    var fsg = await lsWithGrep(convert,src);
               } 
               res.send(convert)
          });
     });
})

const server = app.listen(8085, function () {
     const host = server.address().address
     const port = server.address().port

     console.log("Example app listening at http://%s:%s", host, port)
})
