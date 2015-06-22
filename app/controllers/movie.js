/**
 * 电影相关控制器
 */

var underScore = require('underscore'),
	Movie = require('../models/movie'),
	Comment = require('../models/comment'),
	Category = require('../models/category'),
	fs = require('fs'),
	log = console.log;

//查看电影详情
exports.details = function (req, res) {
	var id = req.params.id;

	Movie.findById(id, function (err, movie) {
		Comment
			.find({movie: id})
			.populate('from', 'name')		//利用populate方法实现关联查询
			.populate('reply.from reply.to', 'name')
			.exec(function (err, comments) {
				res.render('details', {
					title: movie.title,
					movie: movie,
					comments: comments
				});
			});
	});
}

//后台电影列表
exports.list = function (req, res) {
	Movie
		.find({})
		.populate('category', 'name')
		.exec(function (err, movies) {
			if (err) {
				log(err);
				return;
			}

			res.render('movielist', {
				title: '电影列表页',
				movies: movies,
				path: 'movielist'
			});
		});
}

//添加电影页
exports.add = function (req, res) {
	Category.find({}, function (err, categories) {
		res.render('movie', {
			title: '电影录入页',
			categories: categories,
			movie: {}
		});
	});
}

//更新电影
exports.update = function (req, res) {
	var id = req.params.id;

	Category.find({}, function (err, categories) {
		Movie.findById(id, function (err, movie) {
			res.render('movie', {
				title: '电影更新页',
				categories: categories,
				movie: movie
			});
		});
	});
}

//电影操作
exports.do = function (req, res) {
	var movieObj = req.body.movie,
		id = movieObj.id,
		_movie;

	if (req.files.uploadPoster.path) {
		movieObj.poster = req.files.uploadPoster.path.substring(6);
	}

	if (id) {	//修改电影
		Movie.findById(id, function (err, movie) {
			if (err) {
				log(err);
				return;
			}

			if (movieObj.category != movie.category) {		//改变了分类

				Category.findById(movie.category, function (err, category) {	//删除旧分类
					var movies = category.movies;

					for (var i = 0; i < movies.length; i++) {

						if (movie._id.equals(movies[i])) {
							movies.splice(i, 1);

							category.save();

							break;
						}
					}
				});

				Category.findById(movieObj.category, function (err, category) {	//添加新分类
					category.movies.push(movie._id);
					category.save();
				});
			}

			//将前者数据覆盖到后者
			_movie = underScore.extend(movie, movieObj);

			_movie.save(function (err, movie) {
				if (err) {
					log(err);
					return;
				}

				res.redirect('/admin/movie/list');
			});
		});
	} else {	//添加电影
		_movie = new Movie(movieObj);

		_movie.save(function (err, movie) {
			if (err) {
				log(err);
				return;
			}

			Category.findById(movie.category, function (err, category) {		//将新电影添加到分类
				category.movies.push(movie._id);

				category.save(function (err, category) {
					if (err) {
						log(err);
						return;
					}
					
					res.redirect('/admin/movie/list');
				});
			});		
		});
	}
}

//删除电影
exports.del = function (req, res) {
	var id = req.query.id;

	if (id) {
		Movie.remove({_id: id}, function (err, movie) {
			if (err) {
				log(err);

				res.json({ret: 1});

				return;
			}

			res.json({ret: 0});
		});
	}
}