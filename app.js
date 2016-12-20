
//引入依赖包
var express = require('express'),
	mongoose = require('mongoose'),
	path = require('path'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	logger = require('morgan'),
	multer = require('multer');

//创建变量
var app = express(),
	port = process.env.PORT || 3000,
	log = console.log,
	dbUrl = 'mongodb://localhost/imovie';

//连接mongo数据库
mongoose.connect(dbUrl);

//设置视图和模板引擎
app.set('views', './app/views/pages');
app.set('view engine', 'jade');

//设置静态文件请求路径
app.use(express.static(path.join(__dirname, '/public')));

//格式化提交表单，extended为true表示将post过来的字符串转化为json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//实现session持久化到mongodb
app.use(session({
	secret: 'imooc',
	store: new MongoStore({
		url: dbUrl,
		collection: 'sessions'
	})
}));

app.use(multer({
	dest: './public/upload',
	rename: function (fieldname, filename, req, res) {
		return Date.now();
	}
}));

//模板中调用本地方法
app.locals.moment = require('moment');

//启动服务，监听端口
app.listen(port, function () {
	log('server is started on port ' + port);
});

//开发环境下打印
if (app.get('env') === 'development') {
	/*app.set('showStackError', true);
	app.use(logger('dev'));
	app.locals.pretty = false;
	mongoose.set('debug', true);*/
}

//路由入口
require('./routes/route.js')(app);
