jQuery(document).ready(function($) {
	var h3 = $('h3'),
		showdiv = $('.showdiv');
		showdiv.slideUp();
	h3.click(function(event) {
		$(this).toggleClass('active').siblings('h3').removeClass('active');
		$(this).next('div').toggle();
	});
});