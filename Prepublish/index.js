/**
* @author: zhoutengbo
* @desc  : 数据库操作文件
*/

const sqlite3 = require("../../node-v12.18.3-linux-x64/lib/node_modules/sqlite3");

class Database {
    constructor(dataPath) {
        try {
            this.db = new sqlite3.Database(dataPath.toString());

        } catch (e)
        {
            console.log("open database error,path=",dataPath);
            return ;
        }
         console.log("build Database = ",dataPath," success.");
    }

    execSql(cmd,params = [],callback = []) {
        this.db.run(cmd.toString(),params,callback);
    }

    get(cmd,params = [],callback = []) {
        this.db.get(cmd.toString(),params,callback);
    }

    each(cmd,params = [],callback = []) {
        this.db.each(cmd.toString(),params,callback);
    }

    all(cmd,params = [],callback = []) {
        this.db.all(cmd.toString(),params,callback);
    }
}



class PrePublishDatabase extends Database {
    constructor(dataPath) {
        super(dataPath)
        this.table_name = "PrePublishDataTable";
        this.createTable();
    }

    createTable() {
        var createCmd = "CREATE TABLE IF NOT EXISTS `"+this.table_name+"`( \
        `deb_version` varchar(40) NOT NULL,\
        `name` varchar(255) default NULL,\
        `date` varchar(64) default NULL,\
        `filePath` varchar(2024) default NULL,\
        `desc` varchar(8192),\
        PRIMARY KEY (`deb_version`)\
        ) ;";
        
        this.execSql(createCmd.toString());
    }

    Insert(deb_version,name,date,filePath,desc) {

        var insertCmd = "INSERT INTO `"+this.table_name+"`( \
        `deb_version` ,\
        `name` ,\
        `date` ,\
        `filePath` ,\
        `desc` ) \
        VALUES (?,?,?,?,?);";


        console.log("Inserting recoder ");
        console.log(" +---- deb_version ="+deb_version);
        console.log(" +---- name        ="+name);
        console.log(" +---- date        ="+date);
        console.log(" +---- filePath    ="+filePath);
        console.log(" +---- desc        ="+desc);
        this.execSql(insertCmd.toString(),[deb_version,name,date,filePath,desc]);
    }

    Update(deb_version,name,date,filePath,desc) {
        var updateCmd = "UPDATE `"+this.table_name+"` SET \
        `name` = ? ,\
        `date` = ? ,\
        `filePath` = ? ,\
        `desc` = ?  \
        WHERE `deb_version` = ?";

        console.log("Updating recoder ");
        console.log(" +---- deb_version ="+deb_version);
        console.log(" +---- name        ="+name);
        console.log(" +---- date        ="+date);
        console.log(" +---- filePath    ="+filePath);
        console.log(" +---- desc        ="+desc);
        this.execSql(updateCmd.toString(),[name,date,filePath,desc,deb_version]);
    }

    Get(deb_version) {
        var searchCmd = "SELECT * from `"+this.table_name+"`  \
        WHERE `deb_version` = ?";
        var result = [];
        var THIS = this;

        return new Promise(function (resolve,reject){
            THIS.get(searchCmd.toString(),[deb_version],function(err, row) {
            if (err) throw err
                else {
                    if (row != undefined ) {
                        console.log("Showing recoder ");
                        console.log(" +---- deb_version ="+row.deb_version);
                        console.log(" +---- name        ="+row.name);
                        console.log(" +---- date        ="+row.date);
                        console.log(" +---- filePath    ="+row.filePath);
                        console.log(" +---- desc        ="+row.desc);
                         resolve(row);
                    } else
                    {
                         reject("not found");
                    }
                }
            });
        });

        
    }   

    Delete(deb_version) {
        var updateCmd = "DELETE  FROM `"+this.table_name+"` \
        WHERE `deb_version` = ?";

        console.log("Deleting recoder ");
        console.log(" +---- deb_version ="+deb_version);
        this.execSql(updateCmd.toString(),[deb_version]);    
    }

    /**
    * @查询指定数量的记录
    */
    GetSome(start_pos,num)
    {
        var getSomeCmd = "SELECT * from `"+this.table_name+"`\
        order by `deb_version` desc limit ?,?\
        ";

        //var end_pos = start_pos + num;
        var result = [];
        var THIS = this;
        
        return new Promise(function (resolve,reject){
            THIS.all(getSomeCmd.toString(),[start_pos,num], function(err, row) {
                if (err) throw err
                    else {
                        if (row != undefined ) {
                          //  console.log("Showing recoder ");
                          //  console.log(" +---- deb_version ="+row.deb_version);
                          //  console.log(" +---- name        ="+row.name);
                          //  console.log(" +---- date        ="+row.date);
                          //  console.log(" +---- filePath    ="+row.filePath);
                          //  console.log(" +---- desc        ="+row.desc);
                            
                            resolve(row);
                           // result.push(row);
                        } else
                        {
                            reject("not found");
                        }
                    }
                });
        } );
    }
}



module.exports = new PrePublishDatabase("prepublish.db");