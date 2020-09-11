
var bodyParser =require('body-parser')

// 加载hbs模块
var hbs = require('hbs');


// 加载处理模块
var handlerEngine = require('./handler');

var path = require("path");

var express = require("express");


var fs = require("fs");








module.exports = function (app) {
  // 指定模板文件的后缀名为html
  app.set('view engine', 'html');

  // 运行hbs模块
  app.engine('html', hbs.__express);

  //app.use(bodyParser.json({type:'application/x-www-form-urlencoded'}));
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(express.static(path.join('views')));

  console.log(__dirname);

  app.post('/prepublish/upload', function (req, res) {
  	  handlerEngine.updateData(req.body);
      res.send('Hello world');
  });

  app.post('/prepublish/delete', function (req, res) {
      console.log(req.body.deb_version);
      handlerEngine.deleteData(req.body.deb_version);

       
       res.redirect(301, '/prepublish/show');
       //res.location();
       //res.send(301);
  });

  app.get('/prepublish/show', function(req, res){
  	   //getShowPage(app);

      handlerEngine.getShowPageParams().then(function(data){

    
        res.render('show',{entries:data});
      });

  });

  app.get('/prepublish/zh-cn.default.css', function(req, res){

      res.render('zh-cn.default.css');
  });
  
  app.get('/admin', function(req, res){
       res.send('admin page');
   });
};










/*

console.log(`Server running at http://${hostname}:${port}/`);
http.createServer(function (req, res) {
    
    //暂存请求体信息
    var body = "";
 
    //请求链接
    //console.log(req.url);
 
    //每当接收到请求体数据，累加到post中
    req.on('data', function (chunk) {
        body += chunk;  //一定要使用+=，如果body=chunk，因为请求favicon.ico，body会等于{}
       // console.log("chunk:",chunk);
    });
 
    //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
    req.on('end', function () {
        // 解析参数
       // body = querystring.parse(body);  //将一个字符串反序列化为一个对象
        //console.log("body:",body);
        // 设置响应头部信息及编码\

        //判断请求类型
        if (req.url.toString() == "/prepublish/upload" && req.method.toString() == "POST" )
        {
            updateData(body);
        } else if (req.url.toString() == "/prepublish/show" && req.method.toString() == "GET" )
        {   
            getShowPage();
        }
 
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});  
        res.write("ok");
        res.end();
    });
}).listen(port, hostname);

*/