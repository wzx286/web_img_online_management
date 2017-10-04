var fs = require('fs');
var express = require("express");
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended:true,limit:'20mb'}));
app.use(express.static(__dirname+'/..'));

var server = app.listen(8081,function(){
	var host = server.address().address;
    var port = server.address().port;
    console.log(" http://%s:%s", host, port);
});

app.get('/getImgUrl',function(req,res){
	fs.readFile('data_file/imgData.json',function(err,data){
		if (err) {
			console.log(err);
		} else {		
			res.send(JSON.stringify(JSON.parse(data)));
		}
	})
});

app.post("/deleteImg",function(req,res){
	var imgURL = decodeURIComponent(req.body.imgURL);
	fs.unlink('../'+imgURL,function (err) {
		if(err)
			console.log(err)
	})
	fs.readFile('data_file/imgData.json',function(err,data){
		if (err) {
			return console.log(err);
		}
			d = JSON.parse(data);
			var indexOfImg = -1;
			d.some(function (el,i) {
				if(el.src === imgURL){
					indexOfImg = i;
					return true;
				}
			});
			(indexOfImg !== -1) && d.splice(indexOfImg, 1);
		
		fs.writeFile('data_file/imgData.json',JSON.stringify(d),function(err){
			if (err) {
				console.log(err);
			}	
		});
	});
});


app.post("/addImg",function(req,res){
	var d;
	console.log("111");
	var imgData = decodeURIComponent(req.body.img).replace(/^data:image\/png;base64,/,'');

	//生成图片在服务器中的路径,仅作测试,同名的可能性很小
	var imgUrl = 'imgs/'+('1'+Math.random()).replace('.','')+'.jpg';
	decodeBase64ToImg(imgData,'../'+imgUrl);
	fs.readFile('data_file/imgData.json',function(err,data){
		if (err) {
			return console.log(err);
		}
			d = JSON.parse(data);
			var el = {"src":imgUrl};
			d.push(el);	
		
		fs.writeFile('data_file/imgData.json',JSON.stringify(d),function(err){
			if (err) {
				console.log(err);
			} else {

			}			
		});
	})
});

//接收客户端传送来的图片保存到服务器中
function decodeBase64ToImg(base64,file) {
	var temp = new Buffer(base64,'base64');
	fs.writeFileSync(file,temp);
}