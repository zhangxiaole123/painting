
(function($){
	var Slider = function(element){
		var ul = element.children(".J_imgs");
		var extra_ul = element.children('.J_num');
		var list  = ul.children("li");
		var list_num = list.length;
		var index = 0;
		var init = function(){
			list.each(function(i){
				extra_ul.append("<li><span></span></li>");
				if(i>0){
					$(this).hide();
				}
			});
            extra_ul.children('li').each(function(i){
                $(this).on("click",function(event){
                    list.eq(index).hide();
                    index = $(this).index();
                    list.eq(index).animate({opacity:'show'},1000);
                    nav();
                });
            });
			nav();
		};
		var nav = function(){
			extra_li = extra_ul.children();
			extra_li.each(function(i){
				if(i==index){
					$(this).addClass("active");
				}else{
					$(this).removeClass("active");
				}
			});
		};
		var next = function(){
			list.eq(index).hide();

			if(index==(list_num-1)){
				index = 0;
			}else{
				index++;
			}
			//list.eq(index).show();
			list.eq(index).animate({opacity:'show'},1000);
			nav();
		};
		var prev = function(){
			list.eq(index).hide();
			if(index==0){
				index = list_num-1;				
			}else{
				index--;
			}
			list.eq(index).animate({opacity:'show'},1000);
			nav();
		};
		init();
		var t = setInterval(next,5000);
		element.find(".J_next").on("click",function(){
			next();
			return false;
		});
		element.find(".J_prev").on("click",function(){
			prev();
			return false;
		});
		element.on("mouseleave",function(){
            t = setInterval(next,5000);     
		});
        element.on("mouseenter",function(){
            clearTimeout(t);
        });        
	};
	$.fn.slider = function(){
		var slider = new Slider(this);
	};
	$('.J_slider').slider();	
})(jQuery);