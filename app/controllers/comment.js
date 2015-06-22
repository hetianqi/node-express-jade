/**
 * 评论相关控制器
 */

var Comment = require('../models/comment'),
	log = console.log;

//保存评论
exports.save = function (req, res) {
	var _comment = req.body.comment,
		movieId = _comment.movie;

	Comment.findById(_comment.cid, function (err, comment) {
		if (err) {
			log(err);
			return;
		}

		if (comment) {
			comment.reply.push({
				from: _comment.from,
				to: _comment.tid,
				content: _comment.content
			});

			comment.save(function (err, comment) {
				if (err) {
					log(err);
					return;
				}

				res.redirect('/movie/details/' + movieId);
			});
		} else {
			comment = new Comment(_comment);

			comment.save(function (err, comment) {
				if (err) {
					log(err);
					return;
				}

				res.redirect('/movie/details/' + movieId);
			});
		}		
	})	
}