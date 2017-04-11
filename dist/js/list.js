jQuery(document).ready(function($) {
	$('.J_sub_heng').fadeOut();
	(function(){
		$('.icon-liebiao').click(function(event) {
			$(this).addClass('active').parent().siblings().find('.iconfont').removeClass('active');
			$('.J_sub_li').fadeIn();
			$('.J_sub_heng').fadeOut();
		});
		$('.icon-liebiao1').click(function(event) {
			$(this).addClass('active').parent().siblings().find('.iconfont').removeClass('active');
			$('.J_sub_li').fadeOut();
			$('.J_sub_heng').fadeIn();
		});
	})();
});