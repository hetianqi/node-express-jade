/**
 * 用户相关控制器
 */

var User = require('../models/user'),
	log = console.log;

//用户列表
exports.list = function (req, res) {
	User.fetch(function (err, users) {
		if (err) {
			log(err);
			return;
		}

		res.render('userlist', {
			title: '用户列表页',
			users: users,
			path: 'userlist'
		});
	});
}

//注册用户
exports.signup = function (req, res) {
	var _user = req.body;

	User.findOne({name: _user.name}, function (err, user) {
		if (err) {
			log(err);
			return;
		}

		if (user) {
			res.json({ret: 1, msg: '用户名已存在'});
		} else {
			user = new User(_user);

			user.save(function (err, user) {
				if (err) {
					log(err);
					return;
				}

				res.json({ret: 0});
			});
		}
	});	
}

//删除用户
exports.del = function (req, res) {
	var id = req.query.id;

	if (id) {
		User.remove({_id: id}, function (err, user) {
			if (err) {
				log(err);

				res.json({ret: 1});

				return;
			}

			res.json({ret: 0});
		});
	}
}

//用户登录
exports.signin = function (req, res) {
	var _user = req.body,
		name = _user.name,
		password = _user.password;

	User.findOne({name: name}, function (err, user) {
		if (err) {
			log(err);
			return;
		}

		if (!user) {
			res.json({ret: 1, msg: '用户名不存在'});
			return;
		}

		user.comparePassword(password, function (isMatch) {
			if (isMatch) {
				//保存用户的登录对话
				req.session.user = user;

				res.json({ret: 0});
			} else {
				res.json({ret: 1, msg: '密码错误'});
			}
		});
	});	
}

//用户登出
exports.logout = function (req, res) {
	delete req.session.user;
	//delete app.locals.user;

	res.redirect('/');
}

//登录判断的中间件
exports.signinRequired = function (req, res, next) {
	var user = req.session.user;

	//如果没有登录
	if (!user) {
		return res.redirect('/');
	}

	next();
}

//用户角色判断的中间件
exports.adminRequired = function (req, res, next) {
	var user = req.session.user;

	//如果没有登录
	if (user.role == 0) {
		return res.redirect('/');
	}

	next();
}