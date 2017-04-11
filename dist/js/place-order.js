$(function(){

(function(){
	var shippingMethodLoad = $('.shippingOptions').children('div').dimmer(),
		orderSummaryLoad = $('.order_summary').dimmer(),
		popup = $('.J_pop-dimmer').popUp({width:'800px',height: '683px'}),
		dimmer = $('.popup').dimmer(),
		index = -1;
	//country and States
	$('.J_country').selectUnio('.J_state-select','.J_state-input');

	//selected shipping address
	$('#firecheckout-form').delegate("input[name='billing_address_id']",'change',function(){
		orderSummaryLoad.showUp();
		updateOrder();
		$('.edit').hide();
		$(this).siblings('label').find('.edit').show();
	});

	//show address form
	$('.J_newaddress').on('click',function(){
		showForm(this);
		return false;
	});

	//edit address
	$('.address_list').delegate('.J_edit','click',function(){
		showForm(this);
		return false;
	});

	//save address
	$('.J_inner').delegate('button','click',function(e){
		saveAdress(this);
	});

	//change country on shipping address 
	$('.J_country').on('change',function(){
		shippingMethodLoad.showUp();
		orderSummaryLoad.showUp();
		updateOrder();
	});

	//selected shipping method
	$('#firecheckout-form').delegate("input[name='shipping_method']",'change',function(){
		orderSummaryLoad.showUp();
		updateOrder();
	});

	//checkbox Tracking Number
	$('#firecheckout-form').delegate('input[name="tracking_number"]','change',function(){
		trackingNnumber(this);
	});

	//place to order 
	$('.J_place-order').on('click',function(e){
		validatePlaceForm();
	});

	var trackingNnumber = function(element){
		orderSummaryLoad.showUp();
		if($(element).is(':checked')){
			var is_checked = 1;
		}else{
			var is_checked = 0;
		}
		$.ajax({
			type: "POST",
			url: "/hqshippinginsurance/index/trackingnumber/",
			data: {checked:is_checked},
			dataType: "json",
			success: function(data){
				orderSummaryLoad.hideDown();
				if(data.update_section){
					$('.order_summary').html(data.update_section);
				}
			},
			error: function(){

			}
		});
	};

	var showForm = function(element){
		var id = $(element).parents('.J_div').attr('data-id'),
			url = $(element).attr('href');
		if(id){
			index = $(element).parents('.contentd').index();
		}else{
			index = -1;
		}	
		dimmer.showUp();
		popup.showUp();
		$.ajax({
			type: "GET",
			url: url,
			dataType: "html",
			success: function(data){
				$('.J_inner').html(data);
				dimmer.hideDown();
			},
			error: function(){

			}
		});
		
	};

	var saveAdress = function(element){
		var form = $(element).parents('form');
		form.validate({
			errorElement: "p",
			submitHandler: function(){
				dimmer.showUp();
				$.ajax({
					type: "POST",
					url: form.attr('data-url'),
					data: form.serialize() + "&type=option",
					dataType: "json",
					success: function(data){
						dimmer.hideDown();
						if ( index == -1 ){
							$('.address_list').find('.J_newaddress').before(data);
						}else{
							var li = $('.address_list').children("div").eq(index);
							li.replaceWith(data);
						}
						popup.hideDown();
					},
					error: function(){

					}
				});
			}
		});
		
	};
	var validatePlaceForm = function(){ 
		var test = $('#firecheckout-form').validate({
			errorElement: "p",
			submitHandler: function(){
				placeOrder();
			}
		});
	};
	var updateOrder = function(){
		$.ajax({
			type: "POST",
			url: $('#firecheckout-form').attr('update-url'),
			data: $('#firecheckout-form').serialize(),
			dataType: "json",
			success: function(data){
				if(data.update_section['shipping-method']){
					$('.shippingOptions').children('div').html(data.update_section['shipping-method']);
				}
				if(data.update_section.review){
					$('.order_summary').html(data.update_section.review);
				}
			},
			error: function(){
				console.log('error');
			},
			fail: function(){
				console.log('fail');
			}
		});
	};
	var placeOrder = function(){
		$.ajax({
			type: "POST",
			url: $('#firecheckout-form').attr('save-url'),
			data: $('#firecheckout-form').serialize(),
			dataType: "json",
			success: function(data){
				if(data.redirect){
					window.location.href = data.redirect;
				}
			},
			error: function(){

			},
			fail: function(){

			}
		});
	};
})();

//right fix
(function(){
	var width = $(window).width(),
		fixOff= $('.cart_right').offset();

	if(width<1200){
		var position = 'absolute';
	}else{
		var position = 'fixed';
	}

	$(window).scroll(function(e){
		BoxPostion();
	});
	$(window).resize(function(){
		width = $(window).width();
		if(width<1000){
			position = 'absolute';
		}else{
			position = 'fixed';
		}
		BoxPostion();
	});
	var BoxPostion = function(){
		var scrollTop = $(document).scrollTop();
		if(fixOff.top<=scrollTop){
			if(position=='fixed'){
				var left = (width-1200)/2+745+55;
				left = parseInt(left)+'px';
				$('.cart_right').css({
					"position": "fixed",
					"top":"4px",
					"left":left
				});
			}else{
				var top = (scrollTop+4)+'px';
				var left = 745+55+'px';
				$('.cart_right').css({
					"position": "absolute",
					"top":top,
					"left":left,
					"background-color":"#fff"
				});
			}
		}else{
			$('.cart_right').css({
				"position": "static",
				"top":"4px",
				"left":left
			});
		}
	};
})();

});