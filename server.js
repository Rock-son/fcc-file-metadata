'use strict';

var express = require('express');
var cors = require('cors');
const path = require("path");
const fs = require("fs");
const upload = require("multer")({dest: "./uploads", limits: 150000});
const file = upload.single('upfile');

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });


app.post("/api/fileanalyse", file, function(req, res) {
	if (req.file) {
		var tmp_path = req.file.path,
			target_path = path.join(__dirname, "uploads", req.file.originalname),
			readStream = fs.createReadStream(tmp_path),
			dest = fs.createWriteStream(target_path);

		readStream.pipe(dest);
		readStream.on("error", function(err) {res.send({"error": err})});
		readStream.on("end", function() {
			var stats = fs.statSync(target_path);
			fs.unlinkSync(tmp_path);
			fs.unlinkSync(target_path);

			res.set({status: 200, "content-type":"application/json"});
			res.send({"size": stats.size })

		});
	} else {
		res.send("Error uploading file! Please try again.");
	}
});

app.get('/hello', function(req, res){
	res.json({greetings: "Hello, API"});
  });

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
