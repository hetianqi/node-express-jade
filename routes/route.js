
//引入控制器
var IndexController = require('../app/controllers/index'),
	UserController = require('../app/controllers/user'),
	MovieController = require('../app/controllers/movie'),
	CommentController = require('../app/controllers/comment'),
	CategoryController = require('../app/controllers/category');

//输出路由
module.exports = function (app) {
	//预处理
	app.use(function (req, res, next) {
		//保存用户的登录状态到全局
		var user = req.session.user;
		app.locals.user = user;

		next();
	});

	//带 /admin 的表示后台管理页面，需要验证是否登录以及角色是否为管理员

	//首页
	app.get('/', IndexController.index);

	//电影
	app.get('/movie/details/:id', MovieController.details);

	app.get('/admin/movie/list', UserController.signinRequired, UserController.adminRequired, MovieController.list);
	app.get('/admin/movie/add', UserController.signinRequired, UserController.adminRequired, MovieController.add);
	app.get('/admin/movie/update/:id', UserController.signinRequired, UserController.adminRequired, MovieController.update);
	app.post('/admin/movie/do', UserController.signinRequired, UserController.adminRequired, MovieController.do);
	app.delete('/admin/movie/del', UserController.signinRequired, UserController.adminRequired, MovieController.del);

	//用户
	app.post('/user/signup', UserController.signup);
	app.post('/user/signin', UserController.signin);
	app.get('/user/logout', UserController.logout);

	app.get('/admin/user/list', UserController.signinRequired, UserController.adminRequired, UserController.list);
	app.delete('/admin/user/del', UserController.signinRequired, UserController.adminRequired, UserController.del);

	//评论
	app.post('/comment', UserController.signinRequired, CommentController.save);

	//分类
	app.get('/admin/category/list', UserController.signinRequired, UserController.adminRequired, CategoryController.list);
	app.get('/admin/category/add', UserController.signinRequired, UserController.adminRequired, CategoryController.add);
	app.get('/admin/category/update/:id', UserController.signinRequired, UserController.adminRequired, CategoryController.update);
	app.post('/admin/category/do', UserController.signinRequired, UserController.adminRequired, CategoryController.do);
	app.delete('/admin/category/del', UserController.signinRequired, UserController.adminRequired, CategoryController.del);

	//搜索页
	app.get('/results', IndexController.search);
};