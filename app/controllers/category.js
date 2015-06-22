/**
 * 分类相关控制器
 */

var Category = require('../models/category'),
	log = console.log;

//分类列表
exports.list = function (req, res) {
	Category.fetch(function (err, categories) {
		if (err) {
			log(err);
			return;
		}

		res.render('categorylist', {
			title: '分类列表页',
			categories: categories,
			path: 'categorylist'
		});
	});
}

//添加分类
exports.add = function (req, res) {
	res.render('category', {
		title: '分类录入页',
		category: {
			name: ''
		}
	});
}

//更新分类
exports.update = function (req, res) {
	var id = req.params.id;

	Category.findById(id, function (err, category) {
		res.render('category', {
			title: '分类更新页',
			category: category
		});
	});
}

//分类操作
exports.do = function (req, res) {
	var categoryObj = req.body.category,
		id = categoryObj.id,
		_category;

	if (id !== 'undefined') {
		Category.findById(id, function (err, category) {
			if (err) {
				log(err);
				return;
			}

			//将前者数据覆盖到后者
			_category = underScore.extend(category, _category);

			_category.save(function (err, movie) {
				if (err) {
					log(err);
					return;
				}

				res.redirect('/admin/category/list');
			});
		});
	} else {
		_category = new Category({
			name: categoryObj.name
		});

		_category.save(function (err, category) {
			if (err) {
				log(err);
				return;
			}

			res.redirect('/admin/category/list');
		});
	}
}

//删除分类
exports.del = function (req, res) {
	var id = req.query.id;

	if (id) {
		Category.remove({_id: id}, function (err, category) {
			if (err) {
				log(err);

				res.json({ret: 1});

				return;
			}

			res.json({ret: 0});
		});
	}
}