var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var MovieSchema = new Schema({
	title: String,
	director: String,
	language: String,
	country: String,
	year: Number,
	poster: String,
	flash: String,
	summary: String,
	category: {
		type: ObjectId,
		ref: 'Category'
	},
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

//每次调用save都会先执行里面的操作
MovieSchema.pre('save', function (next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}

	next();
});

//为模式添加方法
MovieSchema.statics = {
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

module.exports = MovieSchema;