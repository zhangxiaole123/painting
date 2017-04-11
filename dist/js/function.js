(function($){
    var DropDown = function(element){
		element.each(function(i){
			$(this).mouseenter (function(){
				$(this).addClass("active");
				$(this).find(".drop_content").show();
			});
			$(this).mouseleave (function(){
				$(this).removeClass("active");
				$(this).find(".drop_content").hide();
			});
		});
	};
    var Menu = function(element){
		var ul = element.find("ul");
		var li = element.find("li");
		var subs = element.find(".subNav");
		var is_active = false;
		var init = function(){
			subs.each(function(i){
				$(this).hide();
			});
			if($(element).hasClass("active")==true){
				is_active = true;
			}
		};
		init();
		li.each(function(i){
			$(this).on("mouseenter",function(event){
				ul.find(".active").removeClass("active");
				$(this).addClass("active");
				ul.find(".subNav").hide();
				$(this).find(".subNav").show();
			});
		});
		
		ul.on("mouseleave",function(){
			ul.find(".active").removeClass("active");
			subs.each(function(i){
				$(this).hide();
			});
		});

		if(is_active==false){
			element.on("mouseenter",function(event){
				element.css({"box-shadow": "0 2px 5px rgba(0, 0, 0, 0.3)"});
				element.children(".list").show();
			});
			element.on("mouseleave",function(event){
				element.css({"box-shadow": "none"});
				element.children(".list").hide();
			});
		}
	};
    var Dimmer = function(element){
    	var contain = $(element);
		var option = {
	        color: "#f39c11",
	        bg: "rgba(255,255,255,0.5)"
	    };
        var dimmer = '';
	   	var init = function(){
	   		dimmer = $("<div></div>");
	   		dimmer.css({
	            width: '100%',
	            height: '100%',
	            left: '0px',
	            top: '0px',
	            background: option.bg,
	            display: 'none',
	            zIndex: 2,
	            position: 'absolute'
	        });
	        loader = $("<div class='square-spin ajax-loading'><div></div></div>");
	        loader.find('div').css('background', option.color);
	        dimmer.append(loader);
	   	};
	   	var showUp = function(fn){
	   		var fn = fn ? fn : function() {};
	   		dimmer.appendTo(contain);
	   		dimmer.fadeIn('fast', function() {
	            fn();
	        });
	   	};
	   	var hideDown = function(fn){
	   		var fn = fn ? fn : function() {};
	   		dimmer.fadeOut('fast', function() {
	            dimmer.remove();
	            fn();
	        });
	   	};
	   	var extend = function(options){
	   		for (var i in options) {
                option[i] = option[i];
	        }
	   	};
	    //extend(options);
        //contain = $(options.contain);
	   	init();
        return {
            showUp:showUp,
            hideDown:hideDown,
            dimmer: dimmer
        };
	};
    var getFinalStyle = function getFinalStyle(dom, property) {
        return (dom.currentStyle ? dom.currentStyle : window.getComputedStyle(dom, null))[property];
    }
  	var getActualRect = function(dom){
        var nodes = [dom],
            backUp = [],
            actual;
        function parents(dom) {
            var parent = dom.parentNode;
            if (getFinalStyle(parent, 'display') == 'none') {
                nodes.push(parent);
            } else {
                return false;
            }
            parents(parent);
        }
        parents(dom);
        style = "display:block!important;visibility:hidden!important;";
        inlineStyle = "display:inline-block!important;visibility:hidden!important;";
        
        for (var i = 0; i < nodes.length; i++) {
            var cssText = nodes[i].style.cssText;
            backUp.push(cssText);
            if (i == 0) {
                nodes[i].style.cssText = cssText + inlineStyle;
            } else {
                nodes[i].style.cssText = cssText + style;
            }
        };
        actual = {
            'width': dom.clientWidth,
            'height': dom.clientHeight
        };
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].style.cssText = backUp[i]
        };
        return actual
    };
    var whichAnimationEvent = function(){
        var t,
            el = document.createElement("fakeelement");   
        var animations = {
            "animation": "animationend",
            "OAnimation": "oAnimationEnd",
            "MozAnimation": "animationend",
            "WebkitAnimation": "webkitAnimationEnd"
        }  
        for (t in animations) {
            if (el.style[t] !== undefined) {
                return animations[t];
            }
        }
    };
    var PopUp = function(element,setting){
        var options = {
            handler: null,
            dimmer: element,
            width: null,
            height: null,
            preHeight: null,
            isPopUp:false,
            contain: null,
            afterShow: function() {},
            afterClose: function() {}
        };
        var actual,
        	close;
        var init = function(){
            if (options.width) {
                options.inner.css('width', options.width);
            }
            if (options.height) {
                options.inner.css('height', options.height);
            }
            actual = getActualRect(options.inner.get(0));
            sizePop();
            if (window.Modernizr.cssanimations) {
                options.contain.css({
                    opacity: 0,
                    display: 'inline-block'
                });
            };
            closeBtn();
            bind();
        };
        var setActualRect = function(){
            actual = getActualRect(options.inner.get(0));
            options.contain.css({
                height: actual.height,
                width: actual.width
            });  
        };
        var bind = function(){
            var that = this,resizeHandler;
            options.handler.click(function(event) {
                event.preventDefault();
                event.stopPropagation();
                showUp();
            });
            close.click(function(event) {
                event.preventDefault();
                event.stopPropagation();
                hideDown();
            });
            options.dimmer.click(function(event) {
                if (event.target == options.dimmer.get(0)) {
                    hideDown();
                }
            });
            $(window).resize(function(event) {
                if(options.isPopUp) {
                    clearTimeout(resizeHandler);
                    resizeHandler = setTimeout(function(){
                        sizePop();
                    }, 500);
                }
            });
        };
        var showUp = function(){
            options.dimmer.fadeIn('fast', function() {
                if (window.Modernizr.cssanimations) {
                    options.contain.addClass('active');
                    var animatEvent = whichAnimationEvent();
                    options.contain.bind(animatEvent, function(event) {
                        options.contain.css({
                            opacity: 1,
                            display: 'block'
                        });
                        options.afterShow();
                        options.contain.off();
                    });
                } else {
                    options.contain.fadeIn('fast', function() {
                        options.afterShow();
                    });
                }
                options.isPopUp = true;
            });  
        };
        var hideDown = function(){
            if (window.Modernizr.cssanimations) {
                var animatEvent = whichAnimationEvent();
                options.contain.removeClass('active').addClass('noactive');
                options.contain.bind(animatEvent, function(event) {
                    options.contain.css({
                        opacity: 0,
                        display: 'block'
                    });
                    options.contain.removeClass('noactive');
                    options.dimmer.fadeOut('fast');
                    options.afterClose();
                    options.contain.off();
                });
            } else {
                options.contain.fadeOut('fast', function() {
                    options.dimmer.fadeOut('fast', function() {
                        options.afterClose();
                    });
                });
            }
            options.isPopUp = false;  
        };
        var closeBtn = function(){
           	close = $(".close");
            close.appendTo(options.contain);  
        };
        var sizePop = function(){
            var winW = $(window).width(),
                winH = $(window).height(),
                newW, newH;
            if (actual.width > winW && actual.heigth < winH) {
                newW = winW - 80;
                newH = actual.height * newW / actual.width;
            }
            if (actual.height > winH && actual.width < winW) {
                newH = winH - 80;
                newW = actual.width * newH / actual.height;
            }
            if (newW) {
                options.contain.css({
                    'height': newH,
                    'width': newW
                });
                options.inner.css({
                    'height': newH,
                    'width': newW,
                    'overflow': 'auto'
                });
            } else {
                options.contain.css({
                    'height': actual.height,
                    'width': actual.width
                });
                options.inner.removeAttr('style');
            }  
        };
        var extend = function(){
            for (var i in setting) {
                options[i] = setting[i];
            }
            options.inner = element.find('.J_inner');
            options.contain = element.children('.J_popup');
            options.handler = $(options.handler);  
        };
        extend(setting);
        init();
        return{
            showUp:showUp,
            hideDown:hideDown
        }
    };
	var Slider = function(element){
		var ul = element.children(".J_imgs");
		var extra_ul = element.children('.J_num');
		var list  = ul.children("li");
		var list_num = 
		t.length;
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
    var ScrollBox = function(element,num,width){
		var ul = element.find("ul");
		var lists = ul.children("li");
		var list_width = 0;
		var totalWidth = 0;
		var left = 0;
		var pageNum = 1;
		var curPage = 1;
		var init = function(){
			//ul.wrap('<div class="temwap"></div>');
			var wap = element.children(".J_scroll-wrap");
			wap.css({
				"width":width,
				"overflow":"hidden",
				"position":"relative"
			});
		};
		var ListWidth = function(){
			lists.each(function(i){
				if(i==0){
					list_width = $(this).outerWidth(true);
				}
				totalWidth = totalWidth+$(this).outerWidth(true);
			});
			pageNum = Math.ceil(lists.length/num);
			
			ul.css({
				"width":totalWidth,
				"overflow":"hidden",
				"position":"relative",
				"left":"0"
			});
		};
		var next = function(){
			//var left = ul.css("left");
			curPage = curPage+1;
			if(curPage==pageNum){
				if(lists.length%num==0){
					var starNum = (curPage-1)*num;
				}else{
					var starNum = (curPage-1)*num-(num-lists.length%num);
				}
				left = starNum*list_width;
			}else if(curPage>pageNum){
				left = 0;
				curPage = 1;
			}else{
				left = (curPage-1)*num*list_width;
			}
			if(Modernizr.csstransforms3d){
				ul.css({
					"width":totalWidth,
					"overflow":"hidden",
					"position":"relative",
					"transition":"all 800ms ease",
					"transform":"translate3d("+"-"+left+"px, 0px, 0px)"
				});
			}else{
				ul.css({
					"width":totalWidth,
					"overflow":"hidden",
					"position":"relative",
					"left":-left
				});
			}
		};
		var prev = function(){
			curPage = curPage-1;
			if(curPage==1){
				left = 0;
			}else if(curPage==0){
				if(lists.length%num==0){
					var starNum = (pageNum-1)*num;
				}else{
					var starNum = (pageNum-1)*num-(num-lists.length%num);
				}
				left = starNum*list_width;
				curPage = pageNum;			
			}else{
				left = left-width;
			}
			if(Modernizr.csstransforms3d){
				ul.css({
					"width":totalWidth,
					"overflow":"hidden",
					"position":"relative",
					"transition":"all 800ms ease",
					"transform":"translate3d("+"-"+left+"px, 0px, 0px)"
				});
			}else{
				ul.css({
					"width":totalWidth,
					"overflow":"hidden",
					"position":"relative",
					"left":-left
				});
			}
		};
		init();
		ListWidth();
		element.find(".J_prev").on("click",function(){
			prev();
			return false;
		});
		element.find(".J_next").on("click",function(){
			next();
			return false;
		});
	};
	var Tab = function(){

	};
	var EasyDialog = function(options){
		var container = options.container;
			content = options.container.content;
			header = options.container.header;
			autoClose = options.autoClose;

			w_height = $(window).height();
			w_width = $(window).width();
			//fixed = options.fixed;
		var init = function(){
			if($(".dialoggb").length==0){
				$("body").append('<div class="dialoggb"></div>');
				$(".dialoggb").css({
					"display": "none",
					"position": "fixed",
				    "top": "0",
				    "left": "0",
				    "width": "100%",
				    "height": "100%",
				    "background-color": "#333",
				    "opacity": "0.8",
				    "z-index": "99"
				});
			}
			if($(".dialogwrap").length==0){
				$(".dialoggb").after('<div class="dialogwrap"><div class="dialogcon"></div></div>');
				$(".dialogwrap").css({
						"display": "none",
					    "position": "fixed",
					    "background-color": "#fff",
					    "z-index": "100"
				});
			}
			open();
		};
		var open = function(){
			if(content){
				$(".dialogcon").html(content);
				var dialog_w = $(".dialogwrap").outerHeight();
					dialog_h = $(".dialogwrap").outerWidth();
				$(".dialoggb").css({
					"display": "block",
				});
				$(".dialogwrap").css({
					"display": "block",
					"top": w_height/2-dialog_h/2,
					"left": w_width/2-dialog_w/2
				});
				createHeader();
				createClose("dialogwrap");
			}else{
				$(container).wrap('<div class="dialogbox"></div>');
				createClose("dialogbox");
			}
		};
		var createHeader = function(){
			$(".dialogcon").before('<div class="header"><span>Title</span></div>');
		};
		var createClose = function(className){
			var d_width = $('.'+className).width();
				d_height = $('.'+className).height();
			$('.'+className).prepend('<span class="close">xx</span>');
			$(".close").css({
				"cursor": "pointer",
				"position": "absolute",
				"top": "-10px",
				"left": d_width
			});
			$(".close").on("click",function(){
				$(this).parent().hide();
				$(".dialoggb").hide();
			});
		};
		init();
	};
	var SelectDrop = function(element,sl){
		var init = function(){
			element.each(function(i){
				var select_id = $(this).attr("id");
				$(this).before('<div class="'+select_id+' sel_container"><span></span><i class="iconfont icon-down"></i></div>');
				createOption(this);
			});
		};
		var createOption = function(select){
			var options = $(select).children('option');
			var select_id = $(select).attr("id");
			var select_value = $(select).val();
			$('.'+select_id).children("i").after('<div class="option"><ul></ul></div>');
			options.each(function(i){
				if($(this).attr("selected")){
					$('.'+select_id).children("span").text($(this).text());
				}else if(i==0){
					$('.'+select_id).children("span").text($(this).text());
				}
				$('.'+select_id).find("ul").append('<li date-value="'+$(this).attr('value')+'">'+$(this).text()+'</li>');
			});
		};
		var drop = function(){
			element.each(function(i){
				var select_id = $(this).attr("id");
				that = $(this);
				$('.'+select_id).on("click",function(){
					$(this).find('.option').toggle();
				});
				$('.'+select_id).find("li").each(function(i){
					$(this).on("click",function(){
						li_that = $(this);
						that.children("option").each(function(i){
							console.log(i);
							if(i==li_that.index()){
								$(this).attr('selected',true);
							}else{
								$(this).removeAttr("selected");
							}
						});
						$('.'+select_id).find("span").text($(this).text());
					});
				});
			});
		};
		init();
		drop();
	};
    var ScrollTo = function(element){
        
        var config = {
            "speed": 600
        };
        var offset = offset || 0;
        element.each(function() {
            $(this).click(function(event) {
                event.preventDefault();
                var scrolltodom = $(this).attr("data-scroll");
                if ($(scrolltodom).length) {
                    $(this).addClass("active").parent("li").siblings().find("a").removeClass("active");
                    $('html,body').animate({
                        scrollTop: $(scrolltodom).offset().top - offset
                    }, config.speed);
                    return false;
                }
            });
        });  
    };
    var ScrollToTop = function(element,options){
        var config = {
            "speed": 800
        };
        if (options) {
            $.extend(config, {
                "speed": options
            });
        }
        element.each(function() {
            that = $(this);
            $(window).scroll(function() {
                if ($(this).scrollTop() > 100) {
                    that.fadeIn();
                } else {
                    that.fadeOut();
                }
            });

            $(this).click(function(e) {
                e.preventDefault();
                $("body, html").animate({
                    scrollTop: 0
                }, config.speed);
            });

        });  
    };
	var LazyLoadImg = function(imgs){
        var imgsArray = [];
	    var init = function(){
	    	for (var i = imgs.length - 1; i >= 0; i--) {
	        	placeHolder(imgs.eq(i));
	        };
	        loadFirst();
	        loadBind();
	    };
	    var placeHolder = function(dom){
	    	var dimmer = new Dimmer(dom.parent());
	        dom.data("dimmer", dimmer);
	        dimmer.showUp();
	    }
	    var loadBind = function(){
	    	$(window).scroll(function(event) {
	            checkLoad();
	        });
	    };
	    var checkLoad = function(){
	    	for (var i = 0; i < imgs.length; i++) {
	            if (imgs[i]) {
	                var top = imgs.get(i).getBoundingClientRect().top;
	                    winHeight = $(window).height();
	                if (top <= winHeight) {
	                    loadNow(imgs.eq(i));
	                    imgs[i] = null;
	                }
	            }
	        }	
	    };
	    var loadFirst = function(){
	    	checkLoad();
	    };
	    var loadNow = function(dom){
	    	var src = dom.attr('data-src');
	    	dom.attr('src', src),
	    	dom.css('opacity', '0');
	    	dom.load(function(event) {
	            dom.data('dimmer').hideDown(function() {
	                dom.css('opacity', '1');
	            })
	        });
	        dom.error(function() {
	            dom.data('dimmer').hideDown();
	        });
	    };
	    init();
	};
    var SwitchImg = function(select){
        containt = select,
        lis = containt.find('li'),
        targetCon = containt.find('div'),
        targetImg = targetCon.find('img'),
        dimmer = '',
        url = '';
        var init = function(){
            imgW = targetImg.attr('width');
            imgH = targetImg.attr('height');
            createDimmer();
            bind();
        };
        var createDimmer = function(){
            dimmer = $("<div></div>").css({
                position: 'absolute',
                width: '100%',
                height: '100%',
                zIndex: '2',
                display: 'none',
                left: '0px',
                top: '0px',
                background: 'rgba(255,255,255,0.5)'
            });
            dimmer.append($("<div class='square-spin ajax-loading'><div></div></div>"));
        };
        var showDimmer = function(){
            dimmer.appendTo(targetCon).fadeIn('fast');
        };
        var hideDimmer = function(){
            dimmer.fadeOut('fast', function() {
                $(this).remove();
            });
        };
        var updateStyle = function(index){
            lis.removeClass('active');
            lis.eq(index).addClass('active').addClass('loaded');
        };
        var updateImg = function(img){
            img.attr({
                width: imgW,
                height: imgH
            });
            targetCon.find('img').fadeOut('fast', function() {
                $(this).remove();
                targetCon.append(img);
            });
        };
        var loadImg = function(url,index,loaded){
            var img = new Image();
            if (loaded) {
                updateImg($(img));
                updateStyle(index);
            } else {
                showDimmer();
                img.onload = function() {
                    hideDimmer();
                    updateImg($(img));
                    updateStyle(index);
                }
                img.onerror = function() {
                    hideDimmer();
                }
            }
            img.src = url;
        };
        var bind = function(){
            lis.click(function(event) {
                var index = $(this).index(),
                    url = $(this).attr('data-src'),
                    loaded = $(this).hasClass('loaded');
                loadImg(url, index, loaded);
            });
        };
        init();     
    };
    var InputNum = function(element){
		contain = $(element);
	    add = contain.find('.plus');
	    min = contain.find('.minus');
	    //input = contain.find('input');

		var minNum = 1;
			maxNum = 9999;
			stepNum = 9999;

		var init = function(){
			//dealInput();
			/*
	        if (!window.Modernizr.inputtypes.number) {
	            bind();
	        } else {
	            add.hide();
	            min.hide();
	        }
	        */
	        bind();
	        blurCheck();
		};
		var dealInput = function(input){
			minNum = input.attr('min'),
	        maxNum = input.attr('max'),
	        stepNum = input.attr('step');
		};
		var checkValue = function(input){
			dealInput(input);
	        var value = input.val();
                value = Number(value);
	        if (isNaN(value) || Number(value) > maxNum || Number(value) < minNum) {
	            input.val(minNum);
	        }
		};
		var bind = function(){
	        add.click(function(event) {
         	    var input = $(this).siblings("input");
	            checkValue(input);
	            var value = input.val(),
	                result;
	            result = Number(value) + Number(stepNum);
	            if (result <= maxNum) {
	                input.val(result);
	            }
	        });
	        min.click(function(event) {
	            var input = $(this).siblings("input");
	            checkValue(input);
	            var value = input.val(),
	                result;
	            result = Number(value) - stepNum;
	            if (result >= minNum) {
	                input.val(result);
	            }
	        });
		};
		var blurCheck = function(){
		    var inputs = contain.find('input'); 
            inputs.each(function(i){
                $(this).blur(function(event){
                    checkValue($(this)); 
                });
            });
		};
		init();
	};
    
    var CountTimer = function(select, format){
        var dom = $(select),
            limittime = Number(dom.attr('data-time')),
            offtime = 1; 
        var limiter = setInterval(function() {
            var day = 0,
                hour = 0,
                minute = 0,
                second = 0;
            if (limittime > 0) {
                day = Math.floor(limittime / (60 * 60 * 24 * offtime));
                hour = Math.floor(limittime / (60 * 60 * offtime)) - (day * 24);
                minute = Math.floor(limittime / (60 * offtime)) - (day * 24 * 60) - (hour * 60);
                second = Math.floor(limittime / offtime) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            }else {
                clearInterval(limiter);
                dom.css('visibility', 'hidden');
            }
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;
            var content = format.format({
                d: day,
                h: hour,
                m: minute,
                s: second
            })
            dom.html(content)
            limittime -= offtime;
        },1000);
    };
    var Radio = function(select){
        radios = select;
        var init = function(){
            radios.each(function(index, el) {
                if (el.checked) {
                    $(el).parent('label').addClass('selected');
                }
            });
        };
        var bind = function(){
            var that = this;
            radios.change(function(event) {
                event.cancelBubble = true;
                reset();
                $(this).parent('label').addClass('selected');
            })
        };
        var reset = function(){
            radios.each(function(index, el) {
                $(el).parent('label').removeClass('selected');
            });
        };
        init();
        bind();  
    };
    var Checkbox = function(select){
        inputs = select;
        var init = function(){
            inputs.each(function(index, el) {
                if (el.checked) {
                    $(el).parent('label').addClass('selected');
                }
            });
        };
        var bind = function(){
            inputs.change(function(event) {
                if (this.checked) {
                    $(this).parent('label').addClass('selected');
                } else {
                    $(this).parent('label').removeClass('selected');
                }
            });
        };
        init();
        bind();  
    };
    var SelectUnio = function(country, stateSelect, stateInput){
        var country = $(country);
        var stateSelect = $(stateSelect);
        var stateInput = $(stateInput);
        var init = function(){
            bind();
        };
        var bind = function(){
            country.change(function(event) {
                getState(this.value);
            });
        };
        var getState = function(coun){
            $.ajax({
                url: '/directory/ajax/getRegions/country/' + coun,
                type: 'GET',
                dataType: 'json'
            })
                .done(function(data) {
                    buildState(data);
                })
                .fail(function() {
                })
                .always(function() {
                });
        };
        var buildState = function(data){
            if (data) {
                stateInput.hide();
                stateSelect.html("").append(jQuery(data)).show();
            } else {
                stateSelect.hide();
                stateInput.show();
            }
        }
        init();
    };
    var Rate = function(element){
        var settings;
        settings = {
            getScore: function(score) {}
        };
        
        settings = $.extend(settings, this);
        var icons = element.find('.fa');
        var score = 0;
        var input = element.find('input');
        input.val(icons.last().attr('data-ratings'));
        return element.each(function(index, el) {
            var that = this;
            $(this).mouseover(function(event) {
                if (jQuery(event.target).hasClass('fa')) {
                    var index = jQuery(event.target).index();
                    icons.slice(0, index + 1).addClass('hover');
                }
            });
            $(this).mouseout(function(event) {
                icons.removeClass('hover');
            });
            $(this).click(function(event) {
                if (jQuery(event.target).hasClass('fa')) {
                    var index = jQuery(event.target).index();
                    // score = index + 1;
                    input.val(jQuery(event.target).attr('data-ratings'))
                    // settings.getScore(score);
                    icons.slice(0, index + 1).addClass('active');
                    icons.slice(index + 1).removeClass('active');
                }
            });
        });
    };
    var ImagePreview = function(){
        var init = function(){
            popDimmer = $("<div class='popDimmer imagePreviewPop'><div class='popUp'><div class='popInner'></div></div></div>");
            popInner = popDimmer.find('.popInner');
            popUp = popDimmer.find('.popUp');
            loading = $("<div class='square-spin ajax-loading'><div></div></div>");
            loading.find('div').css('background', '#f39c11');
            whiteB = $("<div class='whiteB'></div>");
            whiteB.css({
                background: 'white',
                width: '100%',
                height: '100%'
            });
            $('body').append(popDimmer);
            popUpContain = $().popUp({
                dimmer: '.imagePreviewPop',
                width: '400px',
                height: '400px',
                afterClose: function() {
                    that.onClose();
                }
            });
        };
        var bind = function(){
            resizeHandle = null;
            contain.click(function(event) {
                if ($(event.target).hasClass('reviewImage')) {
                    var origin = $(event.target).attr('href');
                    popUpContain.showUp();
                    clear();
                    getImg(origin);
                }
            });
            $(window).resize(function(event) {
                if (showed) {
                    clearTimeout(resizeHandle);
                    resizeHandle = setTimeout(function() {
                        resizeImg();
                    }, 500)
                }
            });    
        };
        var getImg = function(){
            img = new Image();
            popInner.append(loading);
            img.onload = function() {
                loading.remove();
                originW = this.width,
                originH = this.height,
                img = this;
                self = this;
                resizeImg();
            }
            window.setTimeout(function() {
                img.src = url;
            }, 1000)
        };
        var resizeImg = function(){
            var that = this,
                ins = this.checkeMaxWidth(this.originW, this.originH),
                check = this.popInner.children('img').length;
            if (check) {
                jQuery(this.img).hide();
            }
            this.img.width = ins.width;
            this.img.height = ins.height;
            this.popUp.animate({
                'width': ins.width,
                'height': ins.height
            }, 'fase', function() {
                if (check) {
                    jQuery(that.img).fadeIn('fast');
                } else {
                    that.showImg(jQuery(that.img));
                }
            })
        };
        var checkeMaxWidth = function(width, height){
            var wW = jQuery(window).width(),
                wH = jQuery(window).height(),
                ratio = 0.8;
    
            function resize(width, height) {
                var cW = width + 40,
                    cH = height + 40; //padding width
                if (cW < wW && cH < wH) {
                    return {
                        width: width,
                        height: height
                    }
                }
                if (cW > wW) {
                    var newW = wW * ratio,
                        newH = height * (newW / width);
                    return resize(newW, newH);
                }
                if (cH > wH) {
                    var newH = wH * ratio,
                        newW = width * (newH / height);
                    return resize(newW, newH);
                }
            }
            return resize(width, height);
        };
        var onClose = function(){
            this.clear();
            this.showed = false;
        };
        var clear = function(){
            this.popInner.find('img').remove();
            this.popInner.find('.whiteB').remove();
            this.popUp.css({
                width: "400px",
                height: "400px"
            });
        };
        var showImg = function(img){
            var that = this;
            this.popInner.append(this.whiteB);
            img.hide().appendTo(that.popInner).fadeIn('fast', function() {
                that.showed = true;
            });
        };
    };
    $.fn.dropDown = function(){
		var dropDown = new DropDown(this);
	};
	$.fn.menu = function(){
		var menu = new Menu(this);
	};
    $.fn.scrollTo = function(){
        var scrollTo = new ScrollTo(this);
    };
    $.fn.scrollToTop = function(options){
        var scrollToTop = new ScrollToTop(this,options);
    };
	$.fn.dimmer = function(){
		return new Dimmer(this);
	};
    $.fn.popUp = function(setting){
        return popUp = PopUp(this,setting);
    };
	$.fn.slider = function(){
		var slider = new Slider(this);
	};
    $.fn.scrollBox = function(num,width){
		var scrollBox = new ScrollBox(this,num,width);
	};
	$.fn.easyDialog = function(options){
		var easyDialog = new EasyDialog(options);
	};
	$.fn.selectDrop = function(){
		var selectDrop = new SelectDrop(this);
	};
	$.fn.lazyLoadImg = function(){
        var lazyLoadImg = new LazyLoadImg(this);
	};
    $.fn.switchImg = function(){
        var switchImg = new SwitchImg(this);
    };
    $.fn.inputNum = function(){
        var inputNum = new InputNum(this);
    };
    $.fn.radio = function(){
        var radio = new Radio(this);
    }
    $.fn.checkbox = function(){
        var checkbox = new Checkbox(this);
    }
    $.fn.selectUnio = function(stateSelect,stateInput){
        var selectUnio = new SelectUnio(this,stateSelect,stateInput);
    }
    $.fn.countTimer = function(format){
        var countTimer = new CountTimer(this,format);
    };
    $.fn.rate = function(options){
        var rate = new Rate(this);  
    };
    $.fn.imagePreview = function(){
        var imagePreview = ImagePreview(this);
    };

    	var GallaryZoom = function(element,options){
    		setting = {
    	        'zoomAreaW': 470,
    	        'zoomAreaH': 470,
    	        'showAreaW': 470,
    	        'showAreaH': 470,
    	        'originalImgW': 670,
    	        'originalImgH': 670
        	};
        	var imgW = 0;
        		imgH = 0;
        		dimmer = '';
        		zoomDimmer = '';
        		zoomFilter = '';
        		zoomIn = '';
        		zoomInImg = '';

        	var extend = function(options){
        		for (var i in options) {
                	this.setting[i] = options[i]
            	}
        	};
        	var init = function(){
        		imgW = targetImg.attr('width');
    	        imgH = targetImg.attr('height');
    	        createDimmer();
    	        createZoomFilter();
    	        createZoomDimmer();
    	        createZoomIn();
    	        bind();
        	};
        	var createZoomDimmer = function(){
        		zoomDimmer = $("<div></div>");
    	        zoomDimmer.css({
    	            position: 'absolute',
    	            width: '100%',
    	            height: '100%',
    	            left: '0px',
    	            top: '0px'
    	        });
    	        zoomDimmer.appendTo(this.targetCon);
        	};
        	var createZoomFilter = function(){
        		zoomFilter = $("<div></div>");
    	        zoomFilter.css({
    	            position: 'absolute',
    	            border: '1px solid white',
    	            background: 'rgba(255,255,255,0.7)',
    	            width: setting.zoomFilterW,
    	            height: setting.zoomFilterH,
    	            display: 'none'
    	        });
    	        zoomFilter.appendTo(this.targetCon);
        	};
        	var createZoomIn = function(){
        		zoomIn = $("<div><img src=''/></div>");
    	        zoomIn.css({
    	            position: 'absolute',
    	            overflow: 'hidden',
    	            top: '0px',
    	            marginLeft: '10px',
    	            display: 'none',
    	            zIndex:'10',
    	            left: setting.zoomAreaW,
    	            width: setting.zoomAreaW,
    	            height: setting.zoomAreaH,
    	            backgroundColor : '#fff',
    	        });
    	        zoomInImg = zoomIn.find('img');
    	        zoomInImg.attr('src', $('.thumbnail').find('.active').attr('data-url'));
    	        zoomInImg.css({
    	            position: 'absolute',
    	            width : setting.zoomAreaW*1.6,
    	            height : setting.zoomAreaH*1.6
    	        });
    	        zoomIn.appendTo(this.containt);
        	};
        	var createDimmer = function(){
        		dimmer = $("<div></div>").css({
    	            position: 'absolute',
    	            width: '100%',
    	            height: '100%',
    	            zIndex: '2',
    	            display: 'none',
    	            left: '0px',
    	            top: '0px',
    	            background: 'rgba(255,255,255,0.5)'
    	        });
    	        dimmer.append($("<div class='square-spin ajax-loading'><div></div></div>"));
        	};
        	var showDimmer = function(){
        		dimmer.appendTo(targetCon).fadeIn('fast');
        	};
        	var hideDimmer = function(){
        		dimmer.fadeOut('fast', function() {
    	            $(this).remove();
    	        });
        	};
        	var updateStyle = function(index){
        		lis.removeClass('selected');
            	lis.eq(index).addClass('selected').addClass('loaded');
        	};
        	var updateImg = function(img){
    	        img.attr({
    	            width: imgW,
    	            height: imgH
    	        });
    	        targetCon.find('img').fadeOut('fast', function() {
    	            $(this).remove();
    	            targetCon.append(img);
    	        });
        	};
        	var loadImg = function(url, index, loaded){
        		var img = new Image();
    	        if (loaded) {
    	            updateImg($(img));
    	            updateStyle(index);
    	        } else {
    	            showDimmer();
    	            img.onload = function() {
    	                hideDimmer();
    	                updateImg($(img));
    	                updateStyle(index);
    	            }
    	            img.onerror = function() {
    	                hideDimmer();
    	            }
    	        }
    	        img.src = url;
        	};
        	var positionFilter = function(x,y){
        		var w = setting.zoomFilterW,
    	            h = setting.zoomFilterH,
    	            sw = setting.showAreaW,
    	            sh = setting.showAreaH,
    	            left, top;
    	        left = x - w / 2;
    	        top = y - h / 2;
    	        if (x < w / 2) {
    	            left = 0;
    	        }
    	        if (y < h / 2) {
    	            top = 0;
    	        }
    	        if (sw - x < w / 2) {
    	            left = sw - w;
    	        }
    	        if (sh - y < h / 2) {
    	            top = sh - h;
    	        }
    	        zoomFilter.css({
    	            left: left,
    	            top: top
    	        });
    	        zoomInImg.css({
    	            left: 0 - left,
    	            top: 0 - top
    	        });
        	};
        	var bind = function(){
    	        lis.click(function(event) {
    	            var index = $(this).index(),
    	                url = $(this).attr('data-url'),
    	                zoomUrl = $(this).attr('data-url'),
    	                loaded = $(this).hasClass('loaded');
    	            loadImg(url, index, loaded);
    	            $(this).addClass('active').siblings().removeClass('active');
    	            zoomInImg.attr('src', zoomUrl);
    	        });
    	        zoomDimmer.mouseenter(function(event) {
    	            zoomFilter.fadeIn('fast');
    	            zoomIn.fadeIn('fast');
    	        }).mouseleave(function(event) {
    	            zoomFilter.fadeOut('fast');
    	            zoomIn.fadeOut('fast');
    	        }).mousemove(function(event) {
    	            positionFilter(event.offsetX, event.offsetY)
    	        });
        	};

        	extend(options);
        	setting.zoomFilterW = setting.originalImgW - setting.zoomAreaW;
        	setting.zoomFilterH = setting.originalImgH - setting.zoomAreaH;
        	containt = $(element);
        	lis = containt.find('li');
        	targetCon = containt.find('.J_main-img');
        	targetImg = targetCon.find('img');

        	init();
    	};

    	var RatingStar = function(lis){
    		var ratings = $(lis);
    		var bind = function(){
    			ratings.each(function(i){
    				var stars = $(this).find('.J_star');
    				stars.on('mouseover',function(event){
    					viewStar(this,stars);
    				});

    				stars.on('mouseout',function(){
    					recovery(stars);
    				});

    				stars.on('click',function(event){
    					changeRating(this,stars);
    				});
    			});
    		};

    		var viewStar = function(el,stars){
    			var index = $(el).index();
    			stars.slice(0,index).addClass('icon-wujiaoxingman-copy');
    			stars.slice(index).removeClass('icon-wujiaoxingman-copy');
    		};
    		
    		var recovery = function(stars){
    			stars.removeClass('icon-wujiaoxingman-copy');
    		}

    		var changeRating = function(el,stars){
    			var index = $(el).index();
    			var input = $(el).siblings('input');
    			input.val($(el).attr('data-value'));

    			stars.slice(0,index).addClass('icon-wujiaoxingman');
    			stars.slice(index).removeClass('icon-wujiaoxingman');
    		};
    		bind();
    	}

    	var sizeRect = function(dom){
    		var w = $(dom).outerWidth();
    	    var h = $(dom).outerHeight();
    	    var margins = $(dom).css('margin').split(' ');
    	    if (margins.length > 1) {
    	        var width = parseInt(margins[1]) + parseInt(margins[3]) + w;
    	        var height = parseInt(margins[0]) + parseInt(margins[2]) + h;
    	    } else {
    	        var width = w;
    	        var height = h;
    	    }
    	    return {
    	        'sizeW': width,
    	        'sizeH': height
    	    }
    	};
    	
    	$.fn.ratingStar = function(){
    		var ratingStar = new RatingStar(this);
    	}

    	$.fn.gallaryZoom = function(options){
    		var gallaryZoom = new GallaryZoom(this,options);
    	};
})(jQuery);

function BatchCheck(sub, main) {
    main.change(function(event) {
        if (this.checked) {
            sub.each(function(index, el) {
                el.checked = true;
                jQuery(el).parent('label').addClass('selected');
            });
        } else {
            sub.each(function(index, el) {
                el.checked = false;
                jQuery(el).parent('label').removeClass('selected');
            });
        }
    });
}

String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof(args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}

