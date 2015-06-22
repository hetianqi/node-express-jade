/**
 * 电影详情页
 */

$(document).ready(function () {
	$('.comment').on('click', function () {
		var cid = $(this).data('cid'),
			tid = $(this).data('tid'),
			$form = $('#commentForm');

		if ($form.children('input[name="comment[tid]"]').length > 0) {
			$('input[name="comment[tid]"]', $form).val(tid);
			$('input[name="comment[cid]"]', $form).val(cid);
		} else {
			$form.append('<input type="hidden" name="comment[tid]" value="' + tid + '">')
				.append('<input type="hidden" name="comment[cid]" value="' + cid + '">');
		}

		setTimeout(function () {
			$('.comment-content').focus();
		}, 0);

		return false;
	});
});