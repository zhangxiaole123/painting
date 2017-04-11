jQuery(document).ready(function($) {
	(function(){
		$('.J_scroll-box').scrollBox(5,470);
		$('.J_pro-images').gallaryZoom();
		$('.J_rating').ratingStar();
	})();
	//option
	(function(){
		var bind = function(){
			$('.J_size').delegate('li', 'click', function(event) {
				selectSize($(this));
			});
			$('.J_num .icon-jianshao').on('click',  function(event) {
				event.preventDefault();
				setNumInput($(this).siblings('input'),'minus');
			});
			$('.J_num .icon-iconfontzengjia').on('click',  function(event) {
				event.preventDefault();
				setNumInput($(this).siblings('input'),'plus');
			});
			$('.J_pro .btn').on('click', function(event) {
				event.preventDefault();
				$(this).text('Adding...');
				addCartLoad = $('.product-cont').dimmer();	
				addCartLoad.showUp();
				addCart($(this));
			});
		};
		bind();
		var selectSize = function(element){
			var ID = element.attr('data-id'),
				input = element.parents().find(':hidden');
			element.addClass('active').siblings().removeClass('active');
			input.val(ID);
		};
		var setNumInput = function(input,action){
			var min = input.attr('min'),
				max = input.attr('max');
			num = input.val();
			if(action=='minus'){
				newNum = parseInt(num)-1;
			}else if(action=='plus'){
				newNum = parseInt(num)+1;
			}else{
				newNum = parseInt(num);
			}				
			if(isNaN(newNum)||newNum<min){
				input.val(min);
			}else if(newNum>max){
				input.val(max);
			}else{
				input.val(newNum);
			}
		};
		var addCart = function(element){
			var SIZE = $('.J_size').find('.active').attr('data-id'),
				QTY = $('.J_num').find('input').val();
			var DATA = {
				size : SIZE,
				qty : QTY
			};
			var jsp =  JSON.stringify(DATA);
			console.log(jsp);
			$.ajax({
				url: $('#product_addCart').attr('data-url'),
				type: 'POST',
				dataType: 'JSON',
				data : jsp,
				//data:$('#product_addCart').serialize(),
				success: function(data){
					element.text('add to cart');
					$('.gwc').find('.tip').text(data.qty);
					$('.J_topcar').show().html(data.html);
					addCartLoad.hideDown();
				},
			})						
		};
		
	})();
	//tanchuang
	(function(){
		var loading = $('.J_popup').dimmer(),
			popup = $('.J_pop-dimmer').popUp({
				width : "800px",
				height : "500px"
			});
		var bind = function(){
			$('.J_inner').delegate('.button', 'click', function(event) {
				event.preventDefault();
				view($(this));							
			});
			$('.J_reviews').click(function(event) {
				popup.showUp();
			});
		};
		bind();
		var view = function(element){
			var url = element.parents('form').attr('data-url'),
				input_price = $('.input-price').val(),
				input_value = $('.input-value').val(),
				input_quality = $('.input-quality').val(),
				pingfen = 'price='+input_price + ',value=' +input_value +',quality='+ input_quality,
				data= {
					name : $('#name').val(),
					content : $('#contents').val(),
					pingfen : pingfen,
				},
				jsp =  JSON.stringify(data);
			$.ajax({
				url: url,
				type: 'GET',
				dataType: 'json',
				data: jsp,
				success: function(data){
					console.log(jsp);
					popup.hideDown();
				},
			})
		};
	})();
	//buy from Amazon
	(function(){
		$('.select').on('change', function(event) {
			selected($(this));
		});
		var selected = function(element){
			var options = element.find(':selected');
			var url = options.val();
			$('.J_buy').attr('href',url);
		};
	})();
});