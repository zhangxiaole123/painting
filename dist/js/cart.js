$(function(){
	//shopping cart
	if($('.shopping_cart').length>0){
		(function(){
			var t;	
			var carLoad = $('.checkout-cart-index').dimmer();
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
				clearTimeout(t);
				t = setTimeout(updateCart,1000);
			};

			var updateCart = function(){
				carLoad.showUp();
				$.ajax({
					type: "POST",
					url: $('#shopping-cart-update').attr('data-url'),
					data: $('#shopping-cart-update').serialize(),
					dataType: "json",
					success: function(data){
						carLoad.hideDown();
						$('.progress').remove();
						$('.shopping_cart').replaceWith(data.html);
						$('.my-bag .pcs').text(data.qty);
					},
					error: function(){
					}
				});
			};

			var cartLinkAjax = function(element){
				carLoad.showUp();
				var url = $(element).attr('href');
				$.ajax({
					type: "GET",
					url: url,
					dataType: "json",
					success: function(data){
						resultUpdate(data);
					},
					error: function(){

					}
				});
			}

			var selectAll = function(el){
				if($(el).is(':checked')){
					$('.J_selected').each(function(){
						$(this).get(0).checked = true;
					});
				}else{
					$('.J_selected').each(function(){
						$(this).get(0).checked = false;
					});
				}
			}

			var clearSelectItem = function(){
				carLoad.showUp();
				$.ajax({
					type: "POST",
					url: "/checkout/cart/clear",
					data: $("#shopping-cart-update").serialize(),
					datType: "json",
					success: function(data){
						resultUpdate(data);
					},
					error: function(){

					}
				});
			}

			var savelaterSelectItem = function(){
				carLoad.showUp();
				$.ajax({
					type: "POST",
					url: "/saveforlater/index/savelaterSelect",
					data: $("#shopping-cart-update").serialize(),
					datType: "json",
					success: function(data){
						resultUpdate(data);
					},
					error: function(){

					}
				});
			}

			var resultUpdate = function(data){
				if(data.cart){
					$('.progress').remove();
					$('.shopping_cart').replaceWith(data.cart);
				}

				if(data.later){
					if($('.saveforlater').length>0){
						$('.saveforlater').replaceWith(data.later);
					}else{
						$('.shopping_cart').after(data.later);
					}
				}else{
					$('.saveforlater').remove();
				}

				if(data.qty){
					$('.my-bag .pcs').text(data.qty);
				}
				carLoad.hideDown();
			}
			var bind = function(){
				$('.checkout-cart-index').delegate('.j-minus','click',function(e){
					var numInput = $(this).siblings('.qty');
					setNumInput(numInput,'minus');
					return false;
				});
				$('.checkout-cart-index').delegate('.j-plus','click',function(){
					var numInput = $(this).siblings('.qty');
					setNumInput(numInput,'plus');
					return false;
				});
				$('.checkout-cart-index').delegate('.qty','blur',function(e){
					setNumInput($(this));
					return;
				});
				
				$('.checkout-cart-index').delegate('.J_wish','click',function(e){
					saveWish(this);
					return false;
				});
				$('.checkout-cart-index').delegate('.J_cart-delete','click',function(e){
					cartLinkAjax(this);
					return false;
				});
				$('.checkout-cart-index').delegate('.J_save-for-later','click',function(e){
					cartLinkAjax(this);
					return false;
				});
				$('.checkout-cart-index').delegate('.J_move-to-bag','click',function(e){
					cartLinkAjax(this);
					return false;
				});
				$('.checkout-cart-index').delegate('.J_later-delete','click',function(e){
					cartLinkAjax(this);
					return false;
				});
				$('.checkout-cart-index').delegate('.J_select-all','change',function(){
					selectAll(this);
				});
				$('.checkout-cart-index').delegate('#J_clear','click',function(){
					clearSelectItem();
					return false;
				});
				$('.checkout-cart-index').delegate('#J_savelater','click',function(){
					savelaterSelectItem();
					return false;
				});
				$('.checkout-cart-index').delegate('#coupon_code','focus',function(){
					var Sometext = ('<p class="coupontip">You have a coupon <b>SHE40</b> for <span>40%</span> off available for your first order</p>');				
					$(this).parent().append(Sometext);
					return false;
				});
				$('.checkout-cart-index').delegate('#coupon_code','blur',function(){
					$('.coupontip').detach();
					return false;
				});
			};

			//first loaddding
			bind();

			if($('.shopping_cart .items .loading').length){
				updateCart();
			}
		})();

	}
});