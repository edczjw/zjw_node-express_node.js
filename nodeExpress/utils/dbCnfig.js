const mysql = require('mysql');//因为项目中安装了mysql  所以创建一个对象
// 将数据库连接配置信息暴露出去
module.exports = {
    // 开始连接数据库，使用mysql连接池方式连接
    //连接池的对象  三个参数：sql语句  sql数组  callback回调  优点：当数据很大时可以减少数据查询的时间
    sqlConnect:function(sql,sqlArr,callback){   
        var config={
            host:'localhost',
            port:'3306',//端口
            user:'root',//用户名
            password:'root',//密码
            database:'express_app'//数据库名称
        };
        var pool = mysql.createPool(config);  
        // 开始连接
        pool.getConnection((err,conn)=>{
            console.log('开始连接数据库express_app');
            //判断失败成功
            if(err){
                console.log('数据库express_app连接失败');
                return;
            } 
            console.log('数据库express_app连接成功');
            // 连接成功  事件驱动回调
            conn.query(sql,sqlArr,callback);  
            // 最后一定要释放连接数据库  关闭连接
            conn.release();
        })
    }
}