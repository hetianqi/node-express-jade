/**
 * 添加修改电影页
 */

$(document).ready(function () {
	$('#getDoubanApi').on('click', function () {
		var id = $('#inputDouban').val();

		if (id) {
			$.ajax({
				url: 'https://api.douban.com/v2/movie/subject/' + id,
				type: 'GET',
				dataType: 'jsonp',
				jsonp: 'callback',
				success: function (data) {
					$('#inputTitle').val(data.title)
					$('#inputDirector').val(data.directors[0].name)
					$('#inputCountry').val(data.countries[0])
					$('#inputLanguage').val('英语')
					$('#inputPoster').val(data.images.large)
					$('#inputYear').val(data.year)
					$('#inputSummary').val(data.summary)
				}
			});
		}
	});

	$('#uploadBtn').click(function () {
		$('#uploadPoster').click();
	});
});