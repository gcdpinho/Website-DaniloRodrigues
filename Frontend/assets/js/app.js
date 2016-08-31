$(document).ready(function(){

	var index = new Index();

	$('#nav-icon1,#nav-icon2,#nav-icon3,#nav-icon4').click(function(){
		$(this).toggleClass('open');
	});

	$('#nav-icon3').on('click', function() {
		$('.hidden-menu').slideToggle();
		$(this).toggleClass('fixed');
	});

	$('header li a').on('click', function(e){
		if ($(window).width() <= 992) {
			$('#nav-icon3').click();
			var id = $(this).data('id');
			$('body,html').delay(500).animate({
				scrollTop: $('#' + id).offset().top
			}, 1000);
		} else {
			var id = $(this).data('id');
			$('body,html').animate({
				scrollTop: $('#' + id).offset().top
			}, 1000);
		}
	});

	$('.negotiate li').on('click', function() {

		var tab = $(this).data('negotiate');

		if (tab !== 'chat') {

			$('.negotiate .list').slideUp(200);
			$('.close-forms').fadeIn(300);

			$('.forms-negotiate').each(function() {

				if ($(this).data('form') === tab) {
					$(this).delay(200).slideDown(300);
				}

			});

		}

	});

	$('.btn-chat').on('click', function(e) {
		e.preventDefault();
		$zopim.livechat.button.hide();
	});

	$('.close-forms').on('click', function() {

		$(this).fadeOut(300);
		$('.forms-negotiate').slideUp(200);
		$('.negotiate .list').delay(200).slideDown(300);
		$('.forms-negotiate input, .forms-negotiate textarea').removeClass('error').val('');

	});

});
