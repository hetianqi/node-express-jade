
$(document).ready(function () {
	$('.del').on('click', function () {
		var id = $(this).data('id'),
			type = $(this).data('type'),
			$tr = $('.item-id-' + id);

		$.ajax({
			url: '/admin/' + type + '/del?id=' + id,
			type: 'DELETE',
			success: function (res) {
				if (res.ret == 0) {
					$tr.remove();
				}
			}
		});
	});
});