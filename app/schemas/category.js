var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var CategorySchema = new Schema({
	name: {
		type: String,
		unique: true
	},
	movies: [{
		type: ObjectId,
		ref: 'Movie'
	}],
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		}
	}
});

//为模式添加静态方法
CategorySchema.statics = {
	//查找所有数据
	fetch: function (cb) {
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb);
	},
	//查找单个数据
	findById: function (id, cb) {
		return this
			.findOne({_id: id})
			.exec(cb);
	}
};

module.exports = CategorySchema;