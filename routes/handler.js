const db = require("../Prepublish");


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
		
        //try 
       // {
        //    var dataJsonObj =  JSON.parse(body);
       // }catch (e)
       // {
       //     console.log("is not a JSON",body);
       //     return null;
       // }

       // if ( dataJsonObj != null )
       // {

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
* @返回显示页面
*/
function getShowPageParams(){
   return db.GetSome(-1,-1);
   // return entries;
}




exports.deleteData = function (deb_version) {
      db.Delete(deb_version);
}
exports.updateData = updateData;
exports.getShowPageParams = getShowPageParams;