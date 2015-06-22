var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;	//引用主键

var CommentSchema = new Schema({
	movie: {
		type: ObjectId,
		ref: 'Movie'		//关联哪个文档
	},
	from: {
		type: ObjectId,
		ref: 'User'
	},
	reply: [{
		from: {
			type: ObjectId,
			ref: 'User'
		},
		to: {
			type: ObjectId,
			ref: 'User'
		},
		content: String
	}],
	content: String,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		}
	}
});

//为模式添加方法
CommentSchema.statics = {
	//查找所有数据
	fetch: function (cb) {
		return this
			.find({})
			.sort('meta.createAt')
			.exec(cb);
	},
	//查找单个数据
	findById: function (id, cb) {
		return this
			.findOne({_id: id})
			.exec(cb);
	}
};

module.exports = CommentSchema;