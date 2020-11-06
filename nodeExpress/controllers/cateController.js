const { sqlConnect } = require('../utils/dbCnfig');
var cheerio = require('cheerio');//引入cheerio
var superagent = require('superagent');//引入superagent
var superagentCharset = require('superagent-charset');//引入superagent-charset 
superagentCharset(superagent);

module.exports={ 
    // 接口一：获取封面轮播图图片
    getAllcates:(req, res)=>{ 
        var sql = "select * from dataOutside";
        var sqlArr = [];
        var callback = (err,data)=>{
        if(err){
            console.log('数据库连接异常');  
            return
        }else{ 
            //返回数据
            res.status(200).json({
                code:'0000',
                msg:'成功',
                data:{ 
                    Catelist:data
                }
            })
        }
        } 
        sqlConnect(sql,sqlArr,callback)
    },

    // 接口二、家用宝存储数据
    saveHomeLoan:(req,res)=>{   
        let payName = req.body.payName
        let colName = req.body.colName
        let payMoney = req.body.payMoney
        let payWay = req.body.payWay
        let payDate = req.body.payDate
        let other = req.body.other
        var sql = "INSERT INTO SaveHomeLoan (payName,colName,payMoney,payWay,payDate,other) VALUES (?,?,?,?,?,?)";
        var sqlArr = [payName,colName,payMoney,payWay,payDate,other];
        var callback = (err,data)=>{
        if(err){
            console.log('数据库连接异常');  
            return
        }else{  
            //返回数据
            res.status(200).json({
                code:'0000',
                msg:'保存成功'
            })
        }
        } 
        sqlConnect(sql,sqlArr,callback)
    },

    //四、查询所有家用宝数据
    getAllHomeLoan:(req,res)=>{
        var sql = "select * from SaveHomeLoan";
        var sqlArr = [];
        var callback = (err,data)=>{
        if(err){
            console.log('数据库连接异常');  
            return
        }else{ 
            //返回数据
            res.status(200).json({
                code:'0000',
                msg:'成功',
                data:{ 
                    HomeLoan:data
                }
            })
        }
        } 
        sqlConnect(sql,sqlArr,callback)
    },

    //爬取外部数据
    getOutData:(req, res)=>{
        //设置请求头
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        //类型
        var type = req.query.type;
        //页码
        var page = req.query.page;
        type = type || 'weixin';
        page = page || '1'; //页码
        //源数据地址
        var items = []; 
        var baseUrl = "http://www.imomoe.ai/so.asp?page="+page
        
        // 用 superagent 去抓取baseUrl的内容
        superagent.get(baseUrl)
        .charset('gb2312')
        .end(function (err, sres) {
            // 常规的错误处理
            if (err) {
                return res.json({ code: 400, msg: err, sets: items });
            }
            // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
            // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
            // 剩下就都是 jquery 的内容了
            var $ = cheerio.load(sres.text);
            $('div.pics ul li a img ').each(function (idx, element) {
                var $element = $(element);   
                items.push({ 
                    id:idx,
                    alt: $element.attr('alt'),
                    src: $element.attr('src')
                });

                // 插入数据库开始
                var sqlArr = [];  
                //插入指令
                var sql = `INSERT INTO dataOutside (id,alt,src) VALUE ('${idx}','${$element.attr('alt')}','${$element.attr('src')}')`;
                var callback = (err,data)=>{
                if(err){
                    console.log('数据库连接异常'+err);  
                    return
                    }
                } 
                sqlConnect(sql,sqlArr,callback) 
                //插入结束

            }); 
            res.json({ code: 200,page:"当前第"+page+"页", msg: "第"+page+"页爬取成功", data: items });
        }); 
    }

}