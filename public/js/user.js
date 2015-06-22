/**
 * [用户登录注册ajax]
 */
$(document).ready(function () {
	$('.btn-signup').click(function () {
		userSignup();

		return false;
	});

	$('.btn-signin').click(function () {
		userSignin();

		return false;
	});
});

/**
 * [userSignup 用户注册]
 * @return {[type]} [description]
 */
function userSignup () {
	var data = {
		name: $('#signupName').val(),
		password: $('#signupPassword').val()
	};

	$.post('/user/signup', data, function (data) {
		if (data.ret == 0) {
			window.location.reload();
		} else {
			$('#signupModal .form-tip').html(data.msg);
		}
	});
}

/**
 * [userSignup 用户登录]
 * @return {[type]} [description]
 */
function userSignin () {
	var data = {
		name: $('#signinName').val(),
		password: $('#signinPassword').val()
	};

	$.post('/user/signin', data, function (data) {
		if (data.ret == 0) {
			window.location.reload();
		} else {
			$('#signinModal .form-tip').html(data.msg);
		}
	});
}