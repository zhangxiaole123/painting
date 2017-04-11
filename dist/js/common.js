jQuery(document).ready(function($) {
	//toubu suosou
	(function(){
		var J_showdiv = $('.J_showdiv'),
			search_input = $('.search-input'),
			J_sousuo = $('.J_sousuo'),
			hide_input = $('.hide-input');	

		J_showdiv.hide();		
		J_sousuo.click(function(event) {
			$(this).hide();
			hide_input.hide();
			J_showdiv.show().animate({width:"290px"}, 300,function(){
				$('.icon-sousuo').show();
			});
			search_input.animate({width:"86%"}, 500);
			$(document).one("click", function(e){
		    	J_showdiv.animate({width:"0"}, 300,function(){
			    	$(this).hide();
			       	J_sousuo.show();
			       	hide_input.show();
		   		});
		   		$('.icon-sousuo').hide();		       
		    });	
		    event.stopPropagation();
		});
		search_input.on("click", function(e){
		    e.stopPropagation();
		});
		$('.gwc').on('mouseover', function(event) {
			$(this).find('.J_topcar').show();
		});
		$('.gwc').on('mouseout', function(event) {
			$(this).find('.J_topcar').hide();
		});
	})();
	//chou cang
	(function(){
		$('.J_pro').delegate('.icon-weixuanzhongxin', 'click', function(event) {
			view($(this));
			animated($(this));
		});
		var view = function(elment){
			var DataID = elment.attr('data-id');
			$.ajax({
				url: DataID,
				type: 'GET',
				dataType: 'text',
				success : function(){
					animated(elment);
				}
			})
		};
		var animated = function(elment){
			elment.css({ 
				transform:"scale(2,2)"
			}).fadeOut().fadeIn('1000',function(){
				$(this).toggleClass('icon-shixinred').css({
					transform:"scale(1,1)",
				})
			});		
		};
	})();
	//shicha gundong
	(function(){
		//new WOW().init();
	})();

	//wishlist and saveforlate delete
	(function(){
		$('.mywishlist').delegate('.J_delete', 'click', function(event) {
			removePro($(this));
		})
		var removePro = function(elment){
			var url = elment.attr('data-url'),
				data = elment.parents("li").attr('data-id');
			$.post(url, {id: data}, function(res) {
				/*optional stuff to do after success */
				if(res){
					elment.parents("li").remove()
				}
			});
		} 
	})();
});