/**
 * 首页控制器
 */

var Movie = require('../models/movie'),
	Category = require('../models/category'),
	log = console.log;

//首页
exports.index = function (req, res) {
	Category
		.find({})
		.populate({
	    	path: 'movies',
	    	select: 'title poster',
	    	options: {limit: 6 }
	    })
		.exec(function (err, categories) {
			if (err) {
				log(err);
				return;
			}

			res.render('index', {
				title: '首页',
				categories: categories
			});
		});
}

//搜索页
exports.search = function (req, res) {
	var query = req.query,
		catId = query.cat,
		q = query.q,
		page = +query.p || 1,
		limit = 6;

	if (typeof catId != 'undefined') {
		Category
			.find({_id: catId})
			.populate({
		    	path: 'movies',
		    	select: 'title poster'
		    })
			.exec(function (err, categories) {
				if (err) {
					log(err);
					return;
				}

				var category = categories[0] || {},
					movies = category.movies || [],
					results = movies.slice((page-1) * limit, page * limit);

				res.render('result', {
					title: '列表页',
					keyword: category.name,
					r: 'cat=' + catId,
					movies: results,
					currPage: page,
					totalPage: Math.ceil(movies.length / limit)
				});
			});
	} else {
		Movie
			.find({title: new RegExp('.*' + q + '.*', 'i')})
			.exec(function (err, movies) {
				if (err) {
					log(err);
					return;
				}

				var results = movies.slice((page-1) * limit, page * limit);

				res.render('result', {
					title: '搜索页',
					keyword: q,
					r: 'q=' + q,
					movies: results,
					currPage: page,
					totalPage: Math.ceil(movies.length / limit)
				});
			});
	}
}