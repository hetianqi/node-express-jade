var mongoose = require('mongoose');
var crypto = require('crypto');

var SALT_WORK_FACTORY = 10;

var UserSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true
	},
	password: String,
	// 0 normal user
	// 1 admin user
	role: {
		type: Number,
		default: 0
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
UserSchema.pre('save', function (next) {
	var user = this;

	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}

	//每次都要重新构建hash，否则会报Caught exception: TypeError: HashUpdate fail
	var sha1 = crypto.createHash('sha1');

	user.password = sha1.update(user.password).digest('hex');

	next();
});

//为模式添加静态方法
UserSchema.statics = {
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

//实例方法
UserSchema.methods = {
	comparePassword: function (password, cb) {
		//将密码进行sha算法加密
		
		var sha1 = crypto.createHash('sha1'),
			_password = sha1.update(password).digest('hex');

		cb(_password == this.password);
	}
};

module.exports = UserSchema;