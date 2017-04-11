jQuery(document).ready(function($) {
	//nav
	(function(){
		jQuery.fx.interval = 1;
		var nav = $('.J_nav'),
			Li = nav.children('li'),
			sanjiao = $('.icon-tripple-down');
		Li.mouseover(function(event) {
			$(this).addClass('hover').siblings().removeClass('hover');
			var index = nav.find('.hover').index();
			animated($(this),index);
		}).click(function(event) {
			$(this).addClass('active').siblings().removeClass('active');
		});
		nav.mouseout(function(event) {
			var index =nav.find('.active').index();
			animated($(this),index);
		});
		var animated = function(element,index){
			var Left = ((index+1)*145)+23;
			sanjiao.stop();
			sanjiao.animate({left:Left}, 'fast');
		};
		animated(nav.find('.active'),nav.find('.active').index());
	})();
	//tab
	(function(){
		var showdiv = $('.J_div').children('div');
		showdiv.hide().eq(0).show();
		$('.J_tab li').click(function(event) {
			$(this).addClass('active').siblings().removeClass('active');
			var index = $('.J_tab').find('.active').index();
			showdiv.eq(index).show().siblings().hide();
		});
	})();
	//orders showimg
	(function(){
		var J_next = $('.J_products_next'),
			J_prev = $('.J_products_prev'),
			index = 0;
		J_next.on('click', function(event) {
			var J_img = $(this).siblings('.products_show').find('.J_img img');
			event.preventDefault();
			index++;
			if (index > J_img.length-1) {
				index = 0;
			}
			J_img.hide().siblings().eq(index).show();
		});
		J_prev.on('click', function(event) {
			var J_img = $(this).siblings('.products_show').find('.J_img img');
			event.preventDefault();
			index--;
			if (index < 0 ) {
				index = J_img.length-1;
			}
			J_img.hide().siblings().eq(index).show();		
		});
	})();
	//radio css
	(function(){
		$('.input-radio').click(function(event) {
			/* Act on the event */
			$(this).parents().addClass('checked').siblings('.inputcss').removeClass('checked');
		});
	})();
});
//address
$(function(){
	if($('.addressbook').length>0){
		(function(){

			var loading = $('.J_popup').dimmer(),
				popup = $('.J_pop-dimmer').popUp({width:"800px",height:"683px"}),
				index = -1;
			var bind  = function(){
				$('.addressbook').delegate('.J_delete','click',function(){
					deleted(this);
					return false;
				});
				$('.addressbook').delegate('.J_edit','click',function(){
					showForm(this);
					return false;
				});
				$('.addressbook').delegate('.default','click',function(e){
					MakeDefault(this);
					$(this).addClass('defaultStyle').text('default').parents('li')
					.siblings().find('.default').removeClass('defaultStyle').text('Make Default');
					return false;
				});
				$('.J_newaddress').on('click',function(){
					showForm(this);
					return false;
				});
				$('.J_inner').delegate('button','click',function(e){
					save(this);
				});
			};

			var deleted = function(element){
				var url = $(element).attr('href');
				$.ajax({
					type: "GET",
					url: url,
					dataType: "json",
					success: function(data){
						if(data.result){
							$(element).parents("li").remove();
						}else{
							console.log('delete error');
						}
					},	
					error: function(){

					}
				});

			};

			var showForm = function(element){
				var id = $(element).parents('li').attr('data-id'),
					url = $(element).attr('href');
				loading.showUp();
				popUp.showUp();
				index = $(element).parents('li').index();
				if(!id){
					index = -1;
				}
				$.ajax({
					type: "GET",
					url: url,
					dataType: "html",
					success: function(data){
						$('.J_inner').html(data);
						loading.hideDown();
					},
					error: function(){

					}
				});
				
			};

			var save = function(element){
				var form = $(element).parents('form');
				form.validate({
					errorElement: "p",
					submitHandler: function(){
						loading.showUp();
						$.ajax({
							type: "POST",
							url: form.attr('data-url'),
							data: form.serialize() + "&type=list",
							dataType: "json",
							success: function(data){
								loading.hideDown();
								if(index==-1){
									$('.addressbook').find('li:last').after(data);
								}else{
									var li = $('.addressbook').children('li').eq(index);
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

			var MakeDefault = function(element){
				if(!$(element).hasClass('defaultStyle')){
					url = $(element).attr('href');
					$.ajax({
						type: "GET",
						url: url,
						dataType: "json",
						success: function(element){
							
						},
						error: function(element){
							
						},					
					});
				}
			};
			bind();
		})();

	}
});
$(function(){
	if($('.img-container').length>0){
		var popUp = $('.J_pop-dimmer').popUp({width: '725px',height:'477px'});
		$('.J_file').on('click',function(){
			popUp.showUp();
		})  
		$('.img-container > img').cropper({
		 	aspectRatio:1/1, 
		 	autoCropArea :1/3,
		 	background : false,
		});
		$('.J_sub').on('click',function(){
			var data = new FormData(),
				url = $('#containerform').attr('data-url');		
				$.each($('#containerform')[0].files, function(i, file) {
				    data.append('upload_file', file);
				});
			$.ajax({
				url:url,
				type: 'POST',
				dataType: 'JSON',
				data: data,
				contentType: false,    
		      	processData: false, 
				success:function (data) {
					popUp.hideDown();
					$('#result i').hide();
					$('#result img').remove();
					$('#result').append('<img src='+ data.imgsrc +'>');
				},
				error:function(data){
					console.log("error");
					popUp.hideDown();				
				},
			})	
			var canvas = $('.modal-body canvas');		

			canvas.cropper({
				built: function () {
					canvas.cropper('getCroppedCanvas').toBlob(function (blob) {
					  	var data = $("#download").attr('href'),
					  		url = $('#containerform').attr('data-url');
					  		console.log(data);
						$.ajax({
							url:url,
						    method: "POST",
						    data: data,
						    processData: false,
						    contentType: false,
						    success: function (data) {
						    	console.log('Upload success');
						    },
						    error: function () {
						      	console.log('Upload error');
						    }
						});
					});
				}
			});
		})
	}
});