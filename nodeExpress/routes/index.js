var express = require('express');
var cateControllers = require('../controllers/cateController');
var router = express.Router(); 

//API请求接口的路由指向
router.post('/savewebsite', cateControllers.saveWebSite); //保存网址数据信息
router.get('/WebList', cateControllers.getWebList); //获取网址数据信息
router.get('/OutData', cateControllers.getOutData); //爬取数据

module.exports = router;
