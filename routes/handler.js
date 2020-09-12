const db = require("../Prepublish");
var exec = require('child_process').exec; 

/**
* @ 这里更新数据到数据库中
* @ 数据格式：
        deb_version (版本号)  -  主键
        name        (版本名字) 
        date        (上传日期)
        filePath    (文件下载地址)
        desc        (描述信息)
*/
function updateData(body)
{	
		var dataJsonObj =   body;

        if ( 'deb_version' in dataJsonObj && 
            'name' in dataJsonObj &&
            'date' in dataJsonObj && 
            'filePath' in dataJsonObj && 
            'desc' in dataJsonObj)
        {
            console.log("deb_version:       ",dataJsonObj.deb_version);
            console.log("name:       ",dataJsonObj.name);
            console.log("date:       ",dataJsonObj.date);
            console.log("filePath:       ",dataJsonObj.filePath);
            console.log("desc:       ",dataJsonObj.desc);
            db.Get(dataJsonObj.deb_version).then(function(data){
                db.Update(dataJsonObj.deb_version,dataJsonObj.name,dataJsonObj.date,dataJsonObj.filePath,dataJsonObj.desc);
            }).catch(function(err){
                db.Insert(dataJsonObj.deb_version,dataJsonObj.name,dataJsonObj.date,dataJsonObj.filePath,dataJsonObj.desc);
            });
        }
    
}

/**
* @发布版本
*/
function publishVersion(deb_version,res)
{
    
    console.log("deb_version:       ",deb_version);

    db.Get(deb_version).then(function(data){
        var output = encodeURIComponent(data.desc);
        var cmdStr = 'python3.5 script/publish_version.py '+data.name+' '+data.date+' '+data.filePath+' \"'+output+'\"';

        exec(cmdStr, function(err,stdout,stderr){
        if(err) {
            console.log('get weather api error:'+stderr);
          } else {
            
            console.log("stdout:       ",stdout);
            db.Delete(deb_version);   //发布成功后删除
            res.send(stdout);
          }
        });
    }).catch(function(err){
        console.log("not found version:",deb_version);
        res.render('reply',{replyStr:"[删除失败] - [未找到记录]"});
    });
    
}

/**
* @返回显示页面
*/
function getShowPageParams(){

       //    db.Insert("35","test","asfg","dsgfhdsfgh","sdfgdfs");
     //   db.Insert("36","test","asfg","dsgfhdsfgh","sdfgdfs");
     //    db.Insert("37","test","asfg","dsgfhdsfgh","sdfgdfs");
     //     db.Insert("38","test","asfg","dsgfhdsfgh","sdfgdfs");
     //      db.Insert("39","test","asfg","dsgfhdsfgh","sdfgdfs");
      ////      db.Insert("40","test","asfg","dsgfhdsfgh","sdfgdfs");
      //       db.Insert("41","test","asfg","dsgfhdsfgh","sdfgdfs");


   return db.GetSome(-1,-1);

   // return entries;
}


/**
* @删除记录
*/
function deleteRecoder(deb_version,res)
{

    db.Get(deb_version).then(function(data){
        
        db.Delete(deb_version);

        res.render('reply',{replyStr:"[删除成功]"});
         
    }).catch(function(err){
        console.log("not found version:",deb_version);
        res.render('reply',{replyStr:"[删除失败] - [未找到记录]"});
    });

    
}




exports.deleteData = deleteRecoder;
exports.updateData = updateData;
exports.getShowPageParams = getShowPageParams;
exports.publishVersion = publishVersion;