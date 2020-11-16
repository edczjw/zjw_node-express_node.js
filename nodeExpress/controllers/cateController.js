const { sqlConnect } = require('../utils/dbCnfig');     //引入连接数据库配置文件
var cheerio = require('cheerio');                       //引入cheerio
var superagent = require('superagent');                 //引入superagent
var superagentCharset = require('superagent-charset');  //引入superagent-charset 
superagentCharset(superagent);

module.exports={   
    // webSite数据提交接口
    saveWebSite:(req,res)=>{   
        let webName = req.body.webName
        let webUrl = req.body.webUrl
        let webLogo = req.body.webLogo
        let webDesc = req.body.webDesc
        let webType = req.body.webType 
        var sql = "INSERT INTO webSiteList (webName,webUrl,webLogo,webDesc,webType) VALUES (?,?,?,?,?)";
        var sqlArr = [webName,webUrl,webLogo,webDesc,webType];
        var callback = (err,data)=>{
        if(err){
            return res.json({ code: 400, msg: err});
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

    //获取website数据
    getWebList:(req,res)=>{
        var sql = "select * from webSiteList";
        var sqlArr = [];
        var callback = (err,data)=>{
        if(err){
            return res.json({ code: 400, msg: err});
        }else{   
            //返回数据
            res.status(200).json({
                code:'0000',
                msg:'成功',
                data:{ 
                    webSiteList:data
                }
            })
        }
        } 
        sqlConnect(sql,sqlArr,callback)
    }, 
    //爬取外部数据
    getOutData:(req, res)=>{ 
        var type = req.query.type || 'weixin';                          //类型
        var page = req.query.page || '1';                               //页码 
        var baseUrl = "http://www.alloyteam.com/nav/"                   //源数据地址
        var items = [];                                                 //存放收集页面网址

        // 用 superagent 去抓取baseUrl的内容
        superagent.get(baseUrl)
        .charset('utf-8') 
        .end(function (err, sres) {
            // 常规的错误处理
            if (err) {
                return res.json({ code: 400, msg: err, sets: items });
            }
            // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
            // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
            // 剩下就都是 jquery 的内容了  
            var $ = cheerio.load(sres.text); 
            $('table#oTable tbody tr').each(function (idx, element) {
                var $element = $(element);   
                let td = $element.find('td').text() 
                items.push({
                    td:td
                })

                // 插入数据库开始
                var sqlArr = [];  
                //插入指令
                // var sql = `INSERT INTO dataOutside (alt,src) VALUE (${$element.attr('alt')}','${$element.attr('src')}')`;
                // var callback = (err,data)=>{
                // if(err){
                //     console.log('数据库连接异常'+err);  
                //     return
                //     }
                // } 
                // sqlConnect(sql,sqlArr,callback) 
                //插入结束

            }); 
            res.json({ code: 200,page:"当前第"+page+"页", msg: "第"+page+"页爬取成功", data: items });
        }); 
    }

}