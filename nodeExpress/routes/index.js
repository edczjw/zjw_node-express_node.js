var express = require('express');
var cateControllers = require('../controllers/cateController');
var router = express.Router(); 

//API请求接口的路由指向
router.post('/SaveHomeLoanData', cateControllers.saveHomeLoan); //保存家用数据
router.get('/Homelist', cateControllers.getAllHomeLoan); //获取家用宝数据
router.get('/Catelist', cateControllers.getAllcates); //获取封面轮播图图片
router.get('/OutData', cateControllers.getOutData); //爬取数据

module.exports = router;
